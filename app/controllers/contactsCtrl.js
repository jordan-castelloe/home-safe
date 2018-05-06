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
  console.log('!!!! req params id right when the form is displayed', req.params.id);
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
  const { Emergency_Contact } = req.app.get('models');
  const newData = {
    name: req.body.name,
    phone_number: req.body.phone_number
  }
  console.log('!!!!!!!!!!!!!! NEW INFO IN CTRL', newData);
  console.log('!!!!!!!!!!!!!!!!! req.params.id', req.params.id);
  Emergency_Contact.update(newData, { where: { id: req.params.id } })
    .then((newContact) => {
      console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! new contact', newContact);
      res.redirect('/contacts')
    })
    .catch(err => {
      console.log(err);
      next(err);
    })

}

module.exports.deleteContact = (req, res, next) => {

}

