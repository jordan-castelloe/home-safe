'use strict';

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

// Called on GET request to register/contacts
module.exports.displayContactsForm = (req, res, next) => {
  res.render('emergency-contact-form');
}

// Called on a POST request to register/ contacts (i.e. when the user clicks 'Add' to add a new emergency contact)
module.exports.addEmergencyContacts = (req, res, next) => {
  const { Emergency_Contact } = req.app.get("models");

  const newContact = {
    name: req.body.name,
    phone_number: req.body.phone_number,
    user_id: req.user.id
  }

  console.log('new contact in authCtrl', newContact);
  Emergency_Contact.create(newContact)
    .then(() => {
      console.log('CONTACT ADDED!')
    })
    .catch(err => {
      console.log(err);
    })
}
