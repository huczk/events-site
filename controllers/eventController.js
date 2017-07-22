const mongoose = require('mongoose');
const Event = mongoose.model('Event');
const User = mongoose.model('User');
const moment = require('moment');

exports.homePage = (req, res) => {
  res.render('index');
};

exports.getEvents = (req, res) => {
  Event.find({}, function(err, events) {
    res.render('events', {events});
  });
};

exports.addEvent = (req, res) => {
  res.render('addEvent');
};

exports.createEvent = async (req, res) => {
  const event = new Event({ name: req.body.name, description: req.body.description, address: req.body.address, date: new Date(req.body.date), author: req.user.id });

  await event.save((err) => {
    if(err) {
      req.flash('error', `Something went wrong`);
    }
  });

  res.redirect('/events');
};

exports.joinEvent = async (req, res) => {
  const guest = req.user.events.map(obj => obj.toString());
  const operator = guest.includes(req.params.id) ? '$pull' : '$push';

  let user = await User.findByIdAndUpdate(
    req.user.id,
    { [operator]: { events: req.params.id}},
    { new: true }
  );
  let event = await Event.findByIdAndUpdate(
    req.params.id,
    { [operator]: { guests: req.user.id}},
    { new: true }
  );
  let message = operator == '$push' ? 'Successfully joined' : 'Successfully resigned';
  req.flash('success', message);
  res.redirect('back');
};

exports.getEventBySlug = async (req, res) => {
  const event = await Event.findOne({slug: req.params.name}).populate('guests author');

  let dateFormat = moment(event.date).format('DD/MM/YYYY');
  let dateNow = moment(event.date).fromNow();
  let joinButton = 'Join!';

  if (req.user) {
    const guest = req.user.events.map(obj => obj.toString());
    joinButton = guest.includes(event.id) ? 'Resign' : 'Join!';
  }

  res.render('event', {event, dateNow, dateFormat, joinButton});
};
