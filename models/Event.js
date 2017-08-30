const mongoose = require('mongoose');
const slug = require('slugs');

mongoose.Promise = global.Promise;

const eventSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: 'Please enter a event name!',
  },
  description: {
    type: String,
    trim: true,
  },
  date: {
    type: Date,
  },
  address: {
    type: String,
    required: 'You must supply an address!',
  },
  author: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: 'You must supply an author',
  },
  guests: [
    { type: mongoose.Schema.ObjectId, ref: 'User' },
  ],
  slug: {
    type: String,
  },
});

// before save event - create slut by its name
eventSchema.pre('save', async function (next) {
  if (!this.isModified('name')) {
    next();
    return;
  }
  this.slug = slug(this.name);

  const slugRegEx = new RegExp(`^(${this.slug})((-[0-9]*$)?)$`, 'i');
  const storesWithSlug = await this.constructor.find({ slug: slugRegEx });
  if (storesWithSlug.length) {
    this.slug = `${this.slug}-${storesWithSlug.length + 1}`;
  }
  next();
});

module.exports = mongoose.model('Event', eventSchema);
