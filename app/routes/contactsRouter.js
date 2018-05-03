'use strict';

const { Router } = require('express');
const contactsRouter = Router();
const { displayContacts } = require('../controllers/contactsCtrl');

contactsRouter.get('/', displayContacts);

module.exports = contactsRouter;