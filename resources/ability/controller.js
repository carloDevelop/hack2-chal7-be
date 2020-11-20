
const app = require('../../app');
const { getAbilities, createAbility } = require('./db');

app.post('/abilities', async function (req, res, next) {
  try {
    const result = await createAbility(req.body.value);
    res.status(200).json(result);
  } catch(err) {
    next(err);
  }
});

app.get('/abilities', async function (req, res, next) {
  try {
    const result = await getAbilities();
    res.status(200).json(result);
  } catch(err) {
    next(err);
  }
});