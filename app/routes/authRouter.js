'use strict';

const { Router } = require('express');
const authRouter = Router();
const { displayRegister, register, displayLogin, login, displayWelcome, logout} = require('../controllers/authCtrl');
const { displayContactsForm, addEmergencyContacts } = require('../controllers/contactsCtrl');
const checkAuth = require('./checkAuth');


// New users
authRouter.get('/register', displayRegister);
authRouter.post('/register', register);
authRouter.get('/register/contacts', displayContactsForm);
authRouter.post('/register/contacts', addEmergencyContacts);

// Login existing users
authRouter.get('/login', displayLogin);
authRouter.post('/login', login);

// All routes below require authentication
authRouter.use(checkAuth);

authRouter.post('/logout', logout);

module.exports = authRouter;