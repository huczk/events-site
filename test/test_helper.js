const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

beforeEach((done) => {
mongoose.connect('mongodb://localhost/meetup_test', { useMongoClient: true });
mongoose.connection
  .once('open', () => { done(); })
  .on('error', (error) => console.warn('Warning', error));
});

beforeEach((done) => {
  // mongoose.connection.collections.events.drop();
  mongoose.connection.collections.users.drop(() => {
    done();
  });
});
