
const getContactDataForUser = async (db, account_id) => {
  return new Promise((resolve) => {
    const sqlStr = `SELECT
      Contact.contact_id, Contact.value as contact, ContactType.value as type
    FROM Contact
    JOIN ContactType ON Contact.contacttype_id = ContactType.contacttype_id
    WHERE Contact.account_id = '${account_id}'`;
    db.all(
      sqlStr,
      function(err, rows) {
        resolve(rows);
      }
    );
  });
}

module.exports = {
  getContactDataForUser
};
