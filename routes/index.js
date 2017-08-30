const express = require('express');

const router = express.Router();
const eventController = require('../controllers/eventController.js');
const userController = require('../controllers/userController.js');
const authController = require('../controllers/authController.js');
const errors = require('../error-handlers/errors.js');

router.get('/', eventController.homePage);

router.get('/events', eventController.getEvents);
router.get('/events/:name', errors.catchErrors(eventController.getEventBySlug));
router.get('/add', eventController.addEvent);
router.post('/add', authController.isLoggedIn, errors.catchErrors(eventController.createEvent));
router.post('/join/:id', authController.isLoggedIn, errors.catchErrors(eventController.joinEvent));

router.get('/login', userController.loginPage);
router.post('/login', authController.login);
router.get('/logout', authController.logout);

router.get('/register', userController.registerPage);
router.post('/register',
  userController.validateRegister,
  errors.catchErrors(userController.register),
  authController.login,
);

router.get('/user/:name', errors.catchErrors(userController.getUser));
router.get('/account', authController.isLoggedIn, errors.catchErrors(userController.accountPage));

module.exports = router;
