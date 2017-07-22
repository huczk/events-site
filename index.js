const mongoose = require('mongoose');

require('dotenv').config({ path: 'variables.env' });

mongoose.Promise = global.Promise;
mongoose.connect(process.env.DATABASE, { useMongoClient: true })
  .then(() => console.log('mongoose is working'));
mongoose.connection.on('error', (err) => {
  console.error(err.message);
});

require('./models/Event.js');
require('./models/User.js');

const app = require('./app.js');

app.set('port', process.env.PORT || 7777);
const server = app.listen(app.get('port'), () => {
  console.log(`Express running → PORT ${server.address().port}`);
});
