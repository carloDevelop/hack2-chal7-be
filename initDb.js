const sqlite3 = require('sqlite3').verbose();
const { v4: uuidv4 } = require('uuid');
const { getDb } = require('./utils/dbHandler');


const initalize = () => {
  const db = getDb();

  db.serialize(function() {
    // db.run('DROP TABLE IF EXISTS Account');
    // db.run(`CREATE TABLE Account (
    //   account_id TEXT PRIMARY KEY,
    //   name TEXT NOT NULL,
    //   time NUMBER DEFAULT 0
    // )`);

    // db.run('DROP TABLE IF EXISTS ContactType');
    // db.run(`CREATE TABLE ContactType (
    //   contacttype_id TEXT PRIMARY KEY,
    //   value TEXT NOT NULL
    // )`);

    // db.run('DROP TABLE IF EXISTS Contact');
    // db.run(`CREATE TABLE Contact (
    //   contact_id TEXT PRIMARY KEY,
    //   type TEXT NOT NULL,
    //   value TEXT NOT NULL,
    //   contacttype_id TEXT NOT NULL,
    //   account_id TEXT NOT NULL,
    //   FOREIGN KEY (contacttype_id) references ContactType (contacttype_id)
    //   FOREIGN KEY (account_id) references Account (account_id)
    // )`);

    // db.run('DROP TABLE IF EXISTS Event');
    // db.run(`CREATE TABLE Event (
    //   event_id TEXT PRIMARY KEY,
    //   name TEXT NOT NULL,
    //   description TEXT,
    //   location TEXT NOT NULL,
    //   datetime TEXT NOT NULL,
    //   duration TEXT NOT NULL
    // )`);

    // db.run('DROP TABLE IF EXISTS Ability');
    // db.run(`CREATE TABLE Ability (
    //   ability_id TEXT PRIMARY KEY,
    //   value TEXT NOT NULL
    // )`);


    // db.run('DROP TABLE IF EXISTS AbilityAccount');
    // db.run(`CREATE TABLE AbilityAccount (
    //   abilityaccount_id TEXT PRIMARY KEY,
    //   account_id TEXT NOT NULL,
    //   ability_id TEXT NOT NULL,
    //   FOREIGN KEY (account_id) references Account (account_id)
    //   FOREIGN KEY (ability_id) references Ability (ability_id)
    // )`);

    // db.run('DROP TABLE IF EXISTS AbilityEvent');
    // db.run(`CREATE TABLE AbilityEvent (
    //   abilityevent_id TEXT PRIMARY KEY,
    //   event_id TEXT NOT NULL,
    //   ability_id TEXT NOT NULL,
    //   FOREIGN KEY (event_id) references Event (event_id)
    //   FOREIGN KEY (ability_id) references Ability (ability_id)
    // )`);

    // db.run('DROP TABLE IF EXISTS Registration');
    // db.run(`CREATE TABLE Registration (
    //   registration_id TEXT PRIMARY KEY,
    //   event_id TEXT NOT NULL,
    //   account_id TEXT NOT NULL,
    //   FOREIGN KEY (event_id) references Event (event_id)
    //   FOREIGN KEY (account_id) references Account (account_id)
    // )`);

    db.run('DROP TABLE IF EXISTS AbilityRegistration');
    db.run(`CREATE TABLE AbilityRegistration (
      abilityregistration_id TEXT PRIMARY KEY,
      registration_id TEXT NOT NULL,
      ability_id TEXT NOT NULL,
      FOREIGN KEY (registration_id) references Registration (registration_id)
      FOREIGN KEY (ability_id) references Ability (ability_id)
    )`);
  });

  db.close();
}

initalize();