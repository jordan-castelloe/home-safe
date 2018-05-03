
'use strict';

const { Router } = require('express');
const contactsRouter = Router();
const { displayContacts, displayEditContactForm } = require('../controllers/contactsCtrl');

contactsRouter.get('/', displayContacts);
contactsRouter.get('/edit/:id', displayEditContactForm)

module.exports = contactsRouter;