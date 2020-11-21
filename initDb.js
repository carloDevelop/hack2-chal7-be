const sqlite3 = require('sqlite3').verbose();
const { getDb } = require('./utils/dbHandler');


const initalize = () => {
  const db = getDb();

  console.info('INITIALIZING DATABASE');
  db.serialize(function() {
    console.info('recreating table Account');
    db.run('DROP TABLE IF EXISTS Account');
    db.run(`CREATE TABLE Account (
      account_id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      time NUMBER DEFAULT 0
    )`);
    const accountJohn = {
      id: 'a0b76ef3-9019-4871-95c7-d69ded0a2c72',
      name: 'John Doe',
      time: 9
    };
    const accountJane = {
      id: '1e18e664-8923-4876-83c3-7942a109f918',
      name: 'Jane Doe',
      time: 42
    };
    console.info('adding data...');
    db.run(`INSERT INTO Account (account_id, name, time) VALUES ('${accountJohn.id}', '${accountJohn.name}', ${accountJohn.time})`);
    db.run(`INSERT INTO Account (account_id, name, time) VALUES ('${accountJane.id}', '${accountJane.name}', ${accountJane.time})`);

    console.info('recreating table ContactType');
    db.run('DROP TABLE IF EXISTS ContactType');
    db.run(`CREATE TABLE ContactType (
      contacttype_id TEXT PRIMARY KEY,
      value TEXT NOT NULL
    )`);
    const contactTypePhone = {
      id: '1c37c33e-39a3-4504-87e8-53b0fa90450a',
      value: 'Telefon'
    };
    const contactTypeEmail = {
      id: 'a018cc5f-6a32-4187-b774-e6ef260b63c3',
      value: 'Email'
    };
    console.info('adding data...');
    db.run(`INSERT INTO ContactType (contacttype_id, value) VALUES ('${contactTypePhone.id}', '${contactTypePhone.value}')`);
    db.run(`INSERT INTO ContactType (contacttype_id, value) VALUES ('${contactTypeEmail.id}', '${contactTypeEmail.value}')`);

    console.info('recreating table Contact');
    db.run('DROP TABLE IF EXISTS Contact');
    db.run(`CREATE TABLE Contact (
      contact_id TEXT PRIMARY KEY,
      value TEXT NOT NULL,
      contacttype_id TEXT NOT NULL,
      account_id TEXT NOT NULL,
      FOREIGN KEY (contacttype_id) references ContactType (contacttype_id)
      FOREIGN KEY (account_id) references Account (account_id)
    )`);
    const contacts = [{
      id: 'ef5babcc-7141-4313-9ba3-0a6a7bb493ce',
      contacttype_id: contactTypePhone.id,
      account_id: accountJohn.id,
      value: '+49 111 222 333'
    }, {
      id: '93fb2716-f813-4ac6-9c91-38426b44cbdd',
      contacttype_id: contactTypeEmail.id,
      account_id: accountJohn.id,
      value: 'johndoe@example.com'
    }, {
      id: 'd3abadea-d4c8-4490-bb24-1707ce5094fa',
      contacttype_id: contactTypePhone.id,
      account_id: accountJane.id,
      value: '+49 999 888 777'
    }];
    console.info('adding data...');
    contacts.forEach(c => {
      db.run(`INSERT INTO Contact (contact_id, contacttype_id, account_id, value) VALUES ('${c.id}', '${c.contacttype_id}', '${c.account_id}', '${c.value}')`);
    });

    console.info('recreating table Event');
    db.run('DROP TABLE IF EXISTS Event');
    db.run(`CREATE TABLE Event (
      event_id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT,
      location TEXT NOT NULL,
      datetime TEXT NOT NULL,
      duration INTEGER NOT NULL
    )`);
    const eventCatering = {
      id: 'e18547e2-02fb-4211-93d6-c9e605a2b2ae',
      name: 'I want to eat cake, wanna join?',
      description: 'Cake eating contest, I do not know how to cook however',
      location: 'Frankfurt, Germany',
      datetime: '20-10-2021 9:00',
      duration: 5
    };
    const eventH2Hcombat = {
      id: 'b25cfe48-1194-425e-b808-81641456510b',
      name: 'Hand to hand training',
      description: 'Hand to hand training, but I need instructor',
      location: 'Frankfurt, Germany',
      datetime: '25-10-2021 9:00',
      duration: 1.5
    };
    console.info('adding data...');
    db.run(`INSERT INTO Event (event_id, name, description, location, datetime, duration) VALUES ('${eventCatering.id}', '${eventCatering.name}', '${eventCatering.description}', '${eventCatering.location}', '${eventCatering.datetime}', '${eventCatering.duration}')`);
    db.run(`INSERT INTO Event (event_id, name, description, location, datetime, duration) VALUES ('${eventH2Hcombat.id}', '${eventH2Hcombat.name}', '${eventH2Hcombat.description}', '${eventH2Hcombat.location}', '${eventH2Hcombat.datetime}', ${eventH2Hcombat.duration})`);

    console.info('recreating table Ability');
    db.run('DROP TABLE IF EXISTS Ability');
    db.run(`CREATE TABLE Ability (
      ability_id TEXT PRIMARY KEY,
      value TEXT NOT NULL
    )`);
    const abilityCatering = {
      id: 'fd70d44e-b558-47b3-ae1a-12619b56fe55',
      value: 'catering'
    };
    const abilityAudio = {
      id: 'dd9f4f71-30b1-4491-ad11-be159f31df87',
      value: 'audio'
    };
    const abilityH2H = {
      id: '2b8b0281-94f1-4879-8ffd-e76102994674',
      value: 'hand to hand combat'
    };
    console.info('adding data...');
    db.run(`INSERT INTO Ability (ability_id, value) VALUES ('${abilityCatering.id}', '${abilityCatering.value}')`);
    db.run(`INSERT INTO Ability (ability_id, value) VALUES ('${abilityAudio.id}', '${abilityAudio.value}')`);
    db.run(`INSERT INTO Ability (ability_id, value) VALUES ('${abilityH2H.id}', '${abilityH2H.value}')`);

    console.info('recreating table AbilityAccount');
    db.run('DROP TABLE IF EXISTS AbilityAccount');
    db.run(`CREATE TABLE AbilityAccount (
      abilityaccount_id TEXT PRIMARY KEY,
      account_id TEXT NOT NULL,
      ability_id TEXT NOT NULL,
      FOREIGN KEY (account_id) references Account (account_id)
      FOREIGN KEY (ability_id) references Ability (ability_id)
    )`);
    const abilitiesAccounts = [{
      id: '3a8b55e1-64b4-49ee-85b5-fce8349cbdb3',
      account_id: accountJohn.id,
      ability_id: abilityAudio.id
    }, {
      id: '372b9e5d-8e31-4699-b8ee-4e69923abe86',
      account_id: accountJane.id,
      ability_id: abilityCatering.id
    }, {
      id: '0d39dbc9-01b2-4669-94e1-50cc26ab3ac7',
      account_id: accountJane.id,
      ability_id: abilityH2H.id
    }];
    console.info('adding data...');
    abilitiesAccounts.forEach(ab => {
      db.run(`INSERT INTO AbilityAccount (abilityaccount_id, account_id, ability_id) VALUES ('${ab.id}', '${ab.account_id}', '${ab.ability_id}')`);
    });

    console.info('recreating table AbilityEvent');
    db.run('DROP TABLE IF EXISTS AbilityEvent');
    db.run(`CREATE TABLE AbilityEvent (
      abilityevent_id TEXT PRIMARY KEY,
      event_id TEXT NOT NULL,
      ability_id TEXT NOT NULL,
      state INTEGER DEFAULT 1,
      FOREIGN KEY (event_id) references Event (event_id)
      FOREIGN KEY (ability_id) references Ability (ability_id)
    )`);
    const abilitiesEventCatering = {
      id: 'de1dac7a-d1b3-40e6-beef-05e98abedee9',
      event_id: eventCatering.id,
      ability_id: abilityCatering.id,
    };
    const abilitiesEventH2H = {
      id: '70f022a7-0205-4fa1-a1e5-e9ab82c62d6f',
      event_id: eventH2Hcombat.id,
      ability_id: abilityH2H.id
    };
    console.info('adding data...');
    db.run(`INSERT INTO AbilityEvent (abilityevent_id, event_id, ability_id) VALUES ('${abilitiesEventCatering.id}', '${abilitiesEventCatering.event_id}', '${abilitiesEventCatering.ability_id}')`);
    db.run(`INSERT INTO AbilityEvent (abilityevent_id, event_id, ability_id) VALUES ('${abilitiesEventH2H.id}', '${abilitiesEventH2H.event_id}', '${abilitiesEventH2H.ability_id}')`);

    console.info('recreating table Registration');
    db.run('DROP TABLE IF EXISTS Registration');
    db.run(`CREATE TABLE Registration (
      registration_id TEXT PRIMARY KEY,
      event_id TEXT NOT NULL,
      account_id TEXT NOT NULL,
      FOREIGN KEY (event_id) references Event (event_id)
      FOREIGN KEY (account_id) references Account (account_id)
    )`);
    const johnRegistration = {
      id: '2e6aa3e2-6bd2-48be-9515-2b8fd43949ce',
      event_id: eventH2Hcombat.id,
      account_id: accountJohn.id
    };
    console.info('adding data...');
    db.run(`INSERT INTO Registration (registration_id, event_id, account_id) VALUES ('${johnRegistration.id}', '${johnRegistration.event_id}', '${johnRegistration.account_id}')`);

    console.info('recreating table AbilityRegistration');
    db.run('DROP TABLE IF EXISTS AbilityRegistration');
    db.run(`CREATE TABLE AbilityRegistration (
      abilityregistration_id TEXT PRIMARY KEY,
      registration_id TEXT NOT NULL,
      abilityevent_id TEXT NOT NULL,
      FOREIGN KEY (registration_id) references Registration (registration_id)
      FOREIGN KEY (abilityevent_id) references AbilityEvent (abilityevent_id)
    )`);
    const johnAbilityRegistration = {
      id: '634dde6b-6d20-4f3a-81b2-2055296c0f0f',
      registration_id: johnRegistration.id,
      abilityevent_id: abilitiesEventH2H.id
    };
    console.info('adding data...');
    db.run(`INSERT INTO AbilityRegistration (abilityregistration_id, registration_id, abilityevent_id) VALUES ('${johnAbilityRegistration.id}', '${johnAbilityRegistration.registration_id}', '${johnAbilityRegistration.abilityevent_id}')`);
    db.run(`UPDATE AbilityEvent set state = state - 1 WHERE abilityevent_id = '${johnAbilityRegistration.abilityevent_id}'`);
  });

  console.info('DONE');
  db.close();
}

initalize();