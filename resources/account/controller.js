
const app = require('../../app');
const { createUser, updateUser } = require('./db');

app.post('/accounts', async function (req, res, next) {
  try {
    const result = await createUser(req.body.name);
    res.status(200).json(result);
  } catch(err) {
    next(err);
  }
});

app.put('/accounts/:id', async function (req, res, next) {
  try {
    await updateUser(req.params.id, req.body);
    res.status(200).json({});
  } catch(err) {
    next(err);
  }
});