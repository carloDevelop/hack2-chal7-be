const { getDb } = require("../../utils/dbHandler");
const { getContactDataForUser, getAbilityEventData } = require('../../utils/dbCommons');
const { v4: uuidv4 } = require('uuid');


const createAccount = async (data) => {
  const db = getDb();
  const id = uuidv4();

  db.run("INSERT INTO Account (account_id, name, location, organisation) VALUES (?, ?)", id, data.name, data.location, data.organisation);
  db.close();
  return { id, ...data };
}


const getRankedEvents = async (id) => {
  const db = getDb();
  const sqlStr = `select
    event_id,
    name,
    description,
    location,
    datetime,
    duration,
    account_id,
    (select count(1) from AbilityEvent where AbilityEvent.event_id = Event.event_id and exists (select 1 from AbilityAccount where AbilityAccount.ability_id = AbilityEvent.ability_id and AbilityAccount.account_id = '${id}')) rank
  from Event
  order by rank desc`;
  let result = await new Promise((resolve) => {
    db.all(
      sqlStr,
      function(err, rows) {
        resolve(rows);
      }
    );
  });

  await Promise.all(result.map(async (r, i) => {
    const abilityData = await getAbilityEventData(db, r.event_id);
    result[i].abilities = abilityData;
  }));

  db.close();
  return result;
}

const getAccount = async (name) => {
  const db = getDb();

  let result = await new Promise((resolve) => {
    db.get(
      `SELECT account_id, name, time FROM Account WHERE name = '${name}'`,
      function(err, row) {
        resolve(row);
      }
    );
  });

  if(!result) {
    return null;
  }

  const abilityData = await new Promise((resolve) => {
    db.all(
      `SELECT
      AbilityAccount.ability_id
      FROM AbilityAccount
      WHERE AbilityAccount.account_id = '${result.account_id}'`,
      function(err, rows) {
        resolve(rows);
      }
    );
  });
  result.abilities = abilityData.map(({ ability_id }) => ability_id);

  const registrationData = await new Promise((resolve) => {
    const sqlStr = `SELECT
      Event.event_id, Event.name, Event.datetime, Event.duration, Event.description, Registration.registration_id
    FROM Registration
    JOIN Event ON Event.event_id = Registration.event_id
    WHERE Registration.account_id = '${result.account_id}'`;
    db.all(
      sqlStr,
      function(err, rows) {
        resolve(rows);
      }
    );
  });
  result.registrations = [...registrationData];

  await Promise.all(registrationData.map(async (d) => {
    const registeredAbilities = await new Promise((resolve) => {
      const sqlStr = `SELECT
        AbilityEvent.abilityevent_id, AbilityEvent.ability_id
      FROM AbilityEvent
      JOIN AbilityRegistration on AbilityRegistration.abilityevent_id = AbilityEvent.abilityevent_id
      WHERE AbilityRegistration.registration_id = '${d.registration_id}'`;
      db.all(
        sqlStr,
        function(err, rows) {
          resolve(rows);
        }
      );
    });

    const registrationIndex = result.registrations.findIndex(r => r.registration_id === d.registration_id);
    if(registrationIndex !== -1) {
      result.registrations[registrationIndex].abilities = registeredAbilities;
    }
  }));

  const contactData = await getContactDataForUser(db, result.account_id);
  result.contacts = [...contactData];

  db.close();

  return result;
}


const updateAccount = async (id, data) => {
    const db = getDb();

    if(data.name) {
      db.run("UPDATE Account SET name = ? WHERE account_id = ?", data.name, id);
    }
    if(data.time) {
      db.run("UPDATE Account SET time = ? WHERE account_id = ?", data.name, id);
    }
    if(data.location) {
      db.run("UPDATE Account SET location = ? WHERE account_id = ?", data.location, id);
    }
    if(data.location) {
      db.run("UPDATE Account SET organisation = ? WHERE account_id = ?", data.organisation, id);
    }

    db.serialize(function() {
      if(Array.isArray(data.abilities)) {
        db.run("DELETE FROM AbilityAccount WHERE account_id = ?", id);
        const stmt = db.prepare("INSERT INTO AbilityAccount (abilityaccount_id, ability_id, account_id) VALUES (?, ?, ?)", )
        data.abilities.forEach(ability_id => {
          stmt.run(uuidv4(), ability_id, id);
        });
        stmt.finalize();
      }
    });
    db.close();

    return {};
}


module.exports = {
  createAccount,
  getAccount,
  getRankedEvents,
  updateAccount
}