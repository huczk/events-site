const mongoose = require('mongoose');
const promisify = require('es6-promisify');

const User = mongoose.model('User');

exports.getUser = async (req, res) => {
  const someUser = await User.findOne({ _id: req.params.name }).populate('events');
  res.render('userPage', { someUser });
};

exports.loginPage = (req, res) => {
  res.render('loginPage');
};

exports.registerPage = (req, res) => {
  res.render('registerPage');
};

exports.accountPage = async (req, res) => {
  const user = await User.findOne({ _id: req.user.id }).populate('events');
  res.render('accountPage', { events: user.events });
};

// User registration validatie
exports.validateRegister = (req, res, next) => {

  // Check if user gave all data, and validate email
  req.sanitizeBody('name');
  req.checkBody('name', 'You must supply a name!').notEmpty();
  req.checkBody('email', 'That Email is not valid!').isEmail();
  req.sanitizeBody('email').normalizeEmail({
    remove_dots: false,
    remove_extension: false,
    gmail_remove_subaddress: false,
  });
  req.checkBody('password', 'Password Cannot be Blank').notEmpty();
  req.checkBody('password-confirm', 'Confirmed Password cannot be blank').notEmpty();
  req.checkBody('password-confirm', 'Your passwords do not match').equals(req.body.password);

  // check validation result, if there are error - show them to user
  req.getValidationResult()
    .then(function(result) {
      if (!result.isEmpty()) {
        req.flash('error', result.array().map(err => err.msg));
        res.render('registerPage', { title: 'Register', body: req.body, flashes: req.flash() });
        return;
      }
      next();
    });
};

exports.register = async (req, res, next) => {
  const user = new User({ email: req.body.email, name: req.body.name });
  const register = promisify(User.register, User);
  await register(user, req.body.password);
  next();
};
