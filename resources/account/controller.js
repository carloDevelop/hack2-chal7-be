
const app = require('../../app');
const { getContactForUser } = require('../contact/db');
const { createAccount, getAccount, updateAccount } = require('./db');

app.post('/accounts', async function (req, res, next) {
  try {
    const result = await createAccount(req.body);
    res.status(200).json(result);
  } catch(err) {
    next(err);
  }
});

app.get('/accounts/:id', async function (req, res, next) {
  try {
    const result = await getAccount(req.params.id);
    res.status(200).json(result);
  } catch(err) {
    next(err);
  }
});

app.get('/accounts/:id/contacts', async function (req, res, next) {
  try {
    const result = await getContactForUser(req.params.id);
    res.status(200).json(result);
  } catch(err) {
    next(err);
  }
});

app.put('/accounts/:id', async function (req, res, next) {
  try {
    await updateAccount(req.params.id, req.body);
    res.status(200).json({});
  } catch(err) {
    next(err);
  }
});
