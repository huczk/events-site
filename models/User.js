const mongoose = require('mongoose');
const validator = require('validator');
const passportLocalMongoose = require('passport-local-mongoose');

mongoose.Promise = global.Promise;

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    lowercase: true,
    trim: true,
    validate: { validator: value => validator.isEmail(value), message: 'Bad email address' },
    required: 'Please Supply an email address',
  },
  name: {
    type: String,
    required: 'Please supply a name',
    trim: true,
  },
  events: [
    { type: mongoose.Schema.ObjectId, ref: 'Event' },
  ],
});

// hashing password in database automatically
userSchema.plugin(passportLocalMongoose, { usernameField: 'email' });

module.exports = mongoose.model('User', userSchema);
