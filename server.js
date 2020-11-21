const app = require('./app');

const PORT = 7000;

require('./resources/ability/controller');
require('./resources/account/controller');
require('./resources/contact/controller');
require('./resources/event/controller');
require('./resources/registration/controller');

app.listen(process.env.PORT || PORT, function () {
  console.log(`CORS-enabled web server listening on port ${PORT}`)
});
