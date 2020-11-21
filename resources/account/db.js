const { getDb } = require("../../utils/dbHandler");
const { getContactDataForUser } = require('../../utils/dbCommons');
const { v4: uuidv4 } = require('uuid');


const createAccount = async (data) => {
  const db = getDb();
  const id = uuidv4();

  db.run("INSERT INTO Account (account_id, name) VALUES (?, ?)", id, data.name);
  db.close();
  return { id, ...data };
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

    db.run("UPDATE Account SET name = ?, time = ? WHERE account_id = ?", data.name, data.time, id);

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
  updateAccount
}