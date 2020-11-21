const { getDb } = require("../../utils/dbHandler");
const { v4: uuidv4 } = require('uuid');
const { getContactDataForUser } = require('../../utils/dbCommons');

const getContactForUser = async (account_id) => {
  const db = getDb();

  return getContactDataForUser(db, account_id);
}

const createContact = async (data) => {
  const db = getDb();
  const id = uuidv4();

  db.run(`INSERT INTO Contact (contact_id, account_id, contacttype_id, value) VALUES (?, ?, ?, ?)`, id, data.account_id, data.contacttype_id, data.value);
  db.close();

  return { id, ...data };
}

const updateContact = (id, data) => {
  const db = getDb();

  if(data.contacttype_id) {
    db.run(`UPDATE Contact SET contacttype_id = ? WHERE contact_id = ?`, data.contacttype_id, id);
  }
  if(data.value) {
    db.run(`UPDATE Contact SET value = ? WHERE contact_id = ?`, data.value, id);
  }
  db.close();

  return {};
}

module.exports = {
  getContactForUser,
  createContact,
  updateContact
};
