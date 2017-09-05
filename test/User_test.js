const assert = require('assert');
const mongoose = require('mongoose');
const request = require('supertest');
const User = require('../models/User');
const userController = require('../controllers/userController.js');
const app = require('../app.js');

describe('User', () => {
  beforeEach((done) => {
    const req = {
      body: {
        name: 'Andy',
        email: 'andy@example.com',
        password: '123'
      }
    }
    // Register user by userController
    userController.register(req, null, done);
  });

  it('register a user by userController', (done) => {
    // Check if registered user is in database
    User.findOne({ 'email': 'andy@example.com' }, (err, user) => {
      assert(user.email);
      done();
    });
  });
});
