
'use strict';

const { Router } = require('express');
const contactsRouter = Router();
const { displayContacts, displayEditContactForm, editContact, deleteContact } = require('../controllers/contactsCtrl');

contactsRouter.get('/', displayContacts);
contactsRouter.get('/edit/:id', displayEditContactForm)
contactsRouter.post('/edit/:id', editContact)
contactsRouter.delete('/:id', deleteContact)

module.exports = contactsRouter;