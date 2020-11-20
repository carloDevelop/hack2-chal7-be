const { getDb } = require("../../utils/dbHandler");
const { v4: uuidv4 } = require('uuid');


const createAbility = (value) => {
  const db = getDb();

  return new Promise((resolve) => {
    const id = uuidv4();
    db.run("INSERT INTO Ability (ability_id, value) VALUES (?, ?)", id, value);
    db.close();
    resolve({ id, value });
  });
}


const getAbilities = async () => {
    const db = getDb();

    return new Promise((resolve) => {
      db.all("SELECT ability_id, value FROM Ability", function(err, rows) {
        resolve(rows);
        db.close();
      })
    });
}


module.exports = {
  createAbility,
  getAbilities
}