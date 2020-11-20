const { getAllEvents, getSingleEvent } = require("./db");
const app = require('../../app');

app.get('/events', async function (req, res, next) {
  try {
    const items = await getAllEvents();
    res.json({ items: items.map(({ id }) => id) })
  } catch(err) {
    next(err);
  }
});

app.get('/events/:id', async function (req, res, next) {
  try {
    const item = await getSingleEvent(req.params.id);
    res.json({ item })
  } catch(err) {
    next(err);
  }
});