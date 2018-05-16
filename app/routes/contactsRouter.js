
'use strict';

const { Router } = require('express');
const contactsRouter = Router();
const { displayContactsForm, addEmergencyContacts, displayContacts, displayEditContactForm, editContact, deleteContact } = require('../controllers/contactsCtrl');

contactsRouter.get('/', displayContacts);
contactsRouter.get('/new', displayContactsForm);
contactsRouter.post('/new', addEmergencyContacts);
contactsRouter.get('/edit/:id', displayEditContactForm)
contactsRouter.post('/edit/:id', editContact)
contactsRouter.delete('/:id', deleteContact);

module.exports = contactsRouter;