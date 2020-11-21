const { createEvent, getAllEvents, getSingleEvent, updateEvent } = require("./db");
const app = require('../../app');

app.post('/events', async function (req, res, next) {
  try {
    const result = await createEvent(req.body);
    res.status(200).json(result)
  } catch(err) {
    next(err);
  }
});

app.get('/events', async function (req, res, next) {
  try {
    const result = await getAllEvents();
    res.status(200).json(result)
  } catch(err) {
    next(err);
  }
});

app.get('/events/:id', async function (req, res, next) {
  try {
    const result = await getSingleEvent(req.params.id);
    res.status(200).json(result);
  } catch(err) {
    next(err);
  }
});

app.put('/events/:id', async function (req, res, next) {
  try {
    await updateEvent(req.params.id, req.body);
    res.status(200).json({});
  } catch(err) {
    next(err);
  }
});
