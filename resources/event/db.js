const { getDb } = require("../../utils/dbHandler");

const getAllEvents = () => {
  const db = getDb();

  return new Promise((resolve) => {
    db.all('SELECT event_id, name FROM Event', function(err, rows) {
      resolve(rows);
      db.close();
    });
  });
}

const getSingleEvent = async (eventId) => {
  const db = getDb();

  return new Promise((resolve) => {
    db.get(`SELECT event_id, name FROM Item where id = '${eventId}'`, function(err, row) {
      resolve(row);
      db.close();
    });
  });
}

module.exports = {
  getAllEvents,
  getSingleEvent
};
