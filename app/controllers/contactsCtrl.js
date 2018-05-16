'use strict';

// Called on GET request to register/contacts
module.exports.displayContactsForm = (req, res, next) => {
  let registration = req.route.path === '/register/contacts' ? true : false;
  res.render('add-emergency-contact', {registration});
}

const createNewContact = (req, res, next) => {
  const { Emergency_Contact } = req.app.get("models");
  return new Promise((resolve, reject) => {
    const newContact = {
      name: req.body.name,
      phone_number: req.body.phone_number,
      user_id: req.user.id
    }
    Emergency_Contact.create(newContact)
    .then((data) => {
      resolve(data);
    })
    .catch(err => {
      const error = new Error("Could not create a new contact.");
      err.status = 400;
      next(err);
    })
  })
}

// Called on a POST request to register/ contacts (i.e. when the user clicks 'Add' to add a new emergency contact)
module.exports.addEmergencyContacts = (req, res, next) => {
  const { Emergency_Contact } = req.app.get("models");
  const path = req.route.path;
  createNewContact(req, res, next)
  .then(data => {
    if(path === '/register/contacts'){
      res.status(200).redirect('/trip/start');
    } else {
      res.status(200).redirect('/contacts');
    }
  })
  .catch(err => {
    next(err);
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
    const error = new Error("Could not get the user's contacts.");
    err.status = 400;
    next(err);
  })
}

module.exports.displayEditContactForm = (req, res, next) => {
  const { Emergency_Contact } = req.app.get("models");
  Emergency_Contact.findById(req.params.id)
  .then(contact => {
    res.render('edit-emergency-contact', { contact } )
  })
  .catch(err => {
    const error = new Error("Could not find this emergency contact.");
    err.status = 400;
    next(err);
  })
}

module.exports.editContact = (req, res, next) => {
  const { Emergency_Contact } = req.app.get('models');
  const newData = {
    name: req.body.name,
    phone_number: req.body.phone_number
  }
  Emergency_Contact.update(newData, { where: { id: req.params.id } })
    .then(newContact => {
      res.status(200).redirect('/contacts');
    })
    .catch(err => {
      const error = new Error("Could not update this emergency contact.");
      err.status = 400;
      next(err);
    })

}

module.exports.deleteContact = (req, res, next) => {
  const { Emergency_Contact } = req.app.get('models');
  Emergency_Contact.destroy({ where: { id: req.params.id } })
    .then(data => {
      res.status(200).send('OK');
    })
    .catch(err => {
      const error = new Error("Could not delete contat");
      err.status = 400;
      next(err);
    });
}

