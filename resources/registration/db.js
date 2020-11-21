const { getDb } = require("../../utils/dbHandler");
const { v4: uuidv4 } = require('uuid');


const createRegistration = async (data) => {
  const db = getDb();
  const registration_id = uuidv4();
  const { event_abilities, ...evdata } = data;
  let abilitiesRegistrations = [];

  db.run("INSERT INTO Registration (registration_id, event_id, account_id) VALUES (?, ?, ?)", registration_id, evdata.event_id, evdata.account_id);

  event_abilities.forEach(abilityevent_id => {
    const abilityregistration_id = uuidv4();
    db.run("INSERT INTO AbilityRegistration (abilityregistration_id, registration_id, abilityevent_id) VALUES (?, ?, ?)", abilityregistration_id, registration_id, abilityevent_id)
    db.run("UPDATE AbilityEvent SET state = state - 1 WHERE  abilityevent_id = ?", abilityevent_id)
    abilitiesRegistrations.push(abilityevent_id);
  });

  db.close();
  return { registration_id, ...evdata, abilities_registrations: abilitiesRegistrations };
}

module.exports = {
  createRegistration
}