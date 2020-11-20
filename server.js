const app = require('./app');

const PORT = 7000;

require('./resources/event/controller');
require('./resources/account/controller');
require('./resources/ability/controller');

app.listen(PORT, function () {
  console.log(`CORS-enabled web server listening on port ${PORT}`)
});
