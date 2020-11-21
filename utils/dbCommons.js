
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

const getAbilityEventData = async (db, event_id) => {
  let abilityEventData = await new Promise((resolve) => {
    const sqlStr =  `SELECT
      AbilityEvent.abilityevent_id, AbilityEvent.ability_id, AbilityEvent.state
    FROM AbilityEvent
    WHERE AbilityEvent.event_id = '${event_id}'`;
    db.all(
      sqlStr,
      function(err, rows) {
        resolve(rows);
      }
    );
  });

  await Promise.all(abilityEventData.map(async (ab) => {
    const abilityRegistrationData = await new Promise((resolve) => {
      db.all(
        `SELECT
          Account.account_id, Account.name
        FROM AbilityRegistration
        JOIN Registration ON AbilityRegistration.registration_id = Registration.registration_id
        JOIN Account ON Registration.account_id = Account.account_id
        WHERE AbilityRegistration.abilityevent_id = '${ab.abilityevent_id}'`,
        function(err, rows) {
          resolve(rows);
        }
      );
    });

    await Promise.all(abilityRegistrationData.map(async (ard) => {
      const contactData = await new Promise((resolve) => {
        db.all(
          `SELECT
            Contact.value as value, ContactType.value as type
          FROM Contact
          JOIN ContactType ON ContactType.contacttype_id = Contact.contacttype_id
          WHERE Contact.account_id = '${ard.account_id}'`,
          function(err, rows) {
            resolve(rows);
          }
        );
      });
      ard.contacts = contactData;
    }));

    ab.accounts = abilityRegistrationData;
  }));

  return abilityEventData;
}

module.exports = {
  getAbilityEventData,
  getContactDataForUser
};
