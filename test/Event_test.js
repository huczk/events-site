const assert = require('assert');
const mongoose = require('mongoose');
const Event = require('../models/Event');
const User = require('../models/User');
const eventController = require('../controllers/eventController.js');

describe('Events', () => {
  beforeEach((done) => {
    mongoose.connection.collections.events.drop();
    mongoose.connection.collections.users.drop(() => {
      done();
    });
  });

  it('saves an event by eventController', (done) => {
    const bob = new User({
      email: 'bob@example.com',
      name: 'Bob'
    });
    bob.save();

    const event = {
      body: {
        'name': "Miami Vice",
        'description': "Best beaches ever!",
        'date': "10, 09, 2018",
        'address': "Miami, USA",
      },
      user: {
        id: bob.id
      }
    };

    // creating a Promise to save event in database
    var testPromise = new Promise(function(resolve, reject) {
      // Passing null as 'response' express object
      resolve(eventController.createEvent(event, null));
    });

    // Promise can throw error because in the controller is 'flash' function,
    // but we must only chceck if event is saved in database,
    // so in catch method we can chceck if event is in databse too.
    testPromise
      .then(() => findEvent())
      .catch((err) => findEvent());

    // Check if saved event is in database
    function findEvent() {
      Event.findOne({ 'name': 'Miami Vice' }, (err, event) => {
        assert(event.description);
        done();
      });
    }
  });
});
