
const app = require('../../app');
const { createContact, getContactForUser, updateContact } = require('./db');

app.post('/contacts', async function (req, res, next) {
  try {
    const result = await createContact(req.body);
    res.status(200).json(result);
  } catch(err) {
    next(err);
  }
});

app.put('/contacts/:id', async function (req, res, next) {
  try {
    await updateContact(req.params.id, req.body);
    res.status(200).json({});
  } catch(err) {
    next(err);
  }
});
