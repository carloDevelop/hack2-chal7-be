const { getDb } = require("../../utils/dbHandler");
const { v4: uuidv4 } = require('uuid');


const createUser = (name) => {
  const db = getDb();

  return new Promise((resolve) => {
    const id = uuidv4();
    db.run("INSERT INTO Account (account_id, name) VALUES (?, ?)", id, name);
    db.close();
    resolve({ id, name });
  });
}


const getAccount = async (name) => {
  const db = getDb();

  const accountData = await new Promise((resolve) => {
    db.get(`SELECT account_id, name, time FROM Item WHERE name = '${name}'`, function(err, row) {
      resolve(row);
    });
  });

  const abilityData = await new Promise((resolve) => {
    db.all(
      `SELECT
        Ability.ability_id, Ability.value
      FROM Ability
      JOIN AbilityAccount ON Ability.ability_id = AbilityAccount.ability_id
      WHERE AbilityAccount.account_id = '${accountData.account_id}'`,
      function(err, rows) {
        resolve(rows);
      }
    );
  });

  const eventData = await new Promise((resolve) => {
    db.all(
      `SELECT
        Event.event_id, Event.name, Event.datetime, Event.duration, Event.description, Registration.registration_id
      FROM Registration
      JOIN Event ON Event.event_id = Registration.event_id
      WHERE Registration.account_id = '${accountData.account_id}'`,
      function(err, rows) {
        resolve(rows);
      }
    );
  });

  eventData.forEach(async (e) => {
    const eventAbilities = await new Promise((resolve) => {
      db.all(
        `SELECT
          Ability.ability_id, Ability.value
        FROM AbilityRegistration
        WHERE AbilityRegistration.registration_id = '${e.registration_id}'`,
        function(err, rows) {
          resolve(rows);
        }
      );
    });
  });

  db.close();
}


const updateUser = async (id, data) => {
    const db = getDb();

    db.run("UPDATE Account SET name = ?, time = ? WHERE account_id = ?", data.name, data.time, id);

    if(Array.isArray(data.abilities)) {
      db.run("DELETE FROM AbilityAccount WHERE account_id = ?", id);
      const stmt = db.prepare("INSERT INTO AbilityAccount (abilityaccount_id, ability_id, account_id) VALUES (?, ?, ?)", )
      data.abilities.forEach(abilityId => {
        stmt.run(uuidv4(), abilityId, id);
      });
      stmt.finalize();
    }
    db.close();

    return true;
}


module.exports = {
  createUser,
  updateUser
}