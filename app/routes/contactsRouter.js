
'use strict';

const { Router } = require('express');
const contactsRouter = Router();
const { displayContactsForm, addEmergencyContacts, displayContacts, displayEditContactForm, editContact, deleteContact } = require('../controllers/contactsCtrl');

contactsRouter.get('/', displayContacts);
contactsRouter.get('/new', displayContactsForm);
// contactsRouter.post('/new', addEmergencyContacts);
// right now adding a new contact takes you to the page to start a trip
// if they're registering, that makes sense, but not if they're just adding a new contact from the contacts view
contactsRouter.get('/edit/:id', displayEditContactForm)
contactsRouter.post('/edit/:id', editContact)
contactsRouter.delete('/:id', deleteContact);

module.exports = contactsRouter;