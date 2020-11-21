const { createRegistration } = require("./db");
const app = require('../../app');

app.post('/registrations', async function (req, res, next) {
  try {
    const result = await createRegistration(req.body);
    res.status(200).json(result)
  } catch(err) {
    next(err);
  }
});
