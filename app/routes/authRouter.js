'use strict';

const { Router } = require('express');
const authRouter = Router();
const checkAuth = require('./checkAuth');
const { displayRegister, register, displayLogin, login, displayWelcome, logout} = require('../controllers/authCtrl');

// New users
authRouter.get('/register', displayRegister);
authRouter.post('/register', register);

// Login existing users
authRouter.get('/login', displayLogin);
authRouter.post('/login', login);

// All routes below require auth
authRouter.use(checkAuth);

authRouter.get('/welcome', displayWelcome);
authRouter.post('/logout', logout);

module.exports = authRouter;