'use strict';

// Called on GET request to register/contacts
module.exports.displayContactsForm = (req, res, next) => {
  res.render('add-emergency-contact');
}

// Called on a POST request to register/ contacts (i.e. when the user clicks 'Add' to add a new emergency contact)
module.exports.addEmergencyContacts = (req, res, next) => {
  const { Emergency_Contact } = req.app.get("models");

  const newContact = {
    name: req.body.name,
    phone_number: req.body.phone_number,
    user_id: req.user.id
  }
  Emergency_Contact.create(newContact)
    .then(() => {
      res.redirect('/trip');
    })
    .catch(err => {
      console.log(err);
      // TODO: add helpful error message
      // next(err);
    })
}

// List all of a user's contacts
module.exports.displayContacts = (req, res, next) => {
  const { Emergency_Contact } = req.app.get("models");
  Emergency_Contact.findAll({
    raw: true,
    where: {
      user_id: req.user.id
    }
  })
  .then(contactArray => {
    res.render('contacts', { contactArray })
  })
  .catch(err => {
    console.log('Err', err); 
  })
}

module.exports.displayEditContactForm = (req, res, next) => {
  const { Emergency_Contact } = req.app.get("models");
  Emergency_Contact.findById(req.params.id)
  .then(contact => {
    res.render('edit-emergency-contact', { contact } )
  })
  .catch(err => {
    console.log('err!', err);
  })
}

module.exports.editContact = (req, res, next) => {
}

module.exports.deleteContact = (req, res, next) => {

}

