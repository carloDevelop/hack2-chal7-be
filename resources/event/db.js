const { getDb } = require("../../utils/dbHandler");
const { v4: uuidv4 } = require('uuid');
const { getAbilityEventData } = require('../../utils/dbCommons');


const addAbilitiesToEvent = async (db, id, abilities=null) => {
  if(Array.isArray(abilities)) {
    db.serialize(function() {
      db.run("DELETE FROM AbilityEvent WHERE event_id = ?", id);
      const stmt = db.prepare("INSERT INTO AbilityEvent (abilityevent_id, ability_id, event_id, state) VALUES (?, ?, ?, ?)", )
      abilities.forEach(({ ability_id, state }) => {
        stmt.run(uuidv4(), ability_id, id, state);
      });
      stmt.finalize();
    });
  }
}


const createEvent = async ({ abilities, ...data }) => {
  const db = getDb();
  const id = uuidv4();

  const defaultedData = {
    description: data.description || '',
    location: data.location || '',
    datetime: data.datetime || '',
    duration: data.duration || 1
  }

  db.run(`INSERT INTO Event (event_id, name, account_id, description, location, datetime, duration) VALUES (?, ?, ?, ?, ?, ?, ?)`, id, data.name, data.account_id, defaultedData.description, defaultedData.location, defaultedData.datetime, defaultedData.duration);
  await addAbilitiesToEvent(db, id, abilities);
  db.close();

  return { id, ...data };
}


const getAllEvents = async () => {
  const db = getDb();

  let result = await new Promise((resolve) => {
    db.all(
      `SELECT event_id, name, account_id, description, location, datetime, duration FROM Event`,
      function(err, rows) {
        resolve(rows);
      }
    );
  });

  await Promise.all(result.map(async (r, i) => {
    const abilityData = await getAbilityEventData(db, r.event_id);
    if(abilityData) {
      result[i].abilities = abilityData;
    }
  }));

  db.close();
  return result;
}

const getSingleEvent = async (id) => {
  const db = getDb();

  let result = await new Promise((resolve) => {
    db.get(
      `SELECT event_id, name, description, location, datetime, duration FROM Event WHERE event_id = '${id}'`,
      function(err, row) {
        resolve(row);
      }
    );
  }) || null;

  if(result === null) {
    return {};
  }

  const abilityData = await getAbilityEventData(db, result.event_id);
  if(abilityData) {
    result.abilities = abilityData;
  }

  db.close();
  return result;
}

const updateEvent = async (id, { abilities, ...data }) => {
  const db = getDb();

  if(data.name) {
    db.run(`UPDATE Event SET name = ? WHERE event_id = ?`, data.name, id);
  }
  if(data.description) {
    db.run(`UPDATE Event SET description = ? WHERE event_id = ?`, data.description, id);
  }
  if(data.location) {
    db.run(`UPDATE Event SET location = ? WHERE event_id = ?`, data.location, id);
  }
  if(data.datetime) {
    db.run(`UPDATE Event SET datetime = ? WHERE event_id = ?`, data.datetime, id);
  }
  if(data.duration) {
    db.run(`UPDATE Event SET duration = ? WHERE event_id = ?`, data.duration, id);
  }
  await addAbilitiesToEvent(db, id, abilities);
  db.close();

  return {};
}

module.exports = {
  createEvent,
  getAllEvents,
  getSingleEvent,
  updateEvent
};
