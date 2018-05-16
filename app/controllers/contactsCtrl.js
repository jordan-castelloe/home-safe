'use strict';

// Called on GET request to register/contacts
module.exports.displayContactsForm = (req, res, next) => {
  let registration = req.route.path === '/register/contacts' ? true : false;
  console.log('!!!!!! are we registering??', {registration});
  res.render('add-emergency-contact', {registration});
}

const checkForContacts = (req, res, next) => {
  return new Promise((resolve, reject) => {
    const { Emergency_Contact } = req.app.get("models");
    Emergency_Contact.findAll({
      raw: true,
      where: {
        user_id: req.user.id
      }
    })
    .then(contactArray => {
      if(contactArray.length <= 3){
        resolve(contactArray);
      } else {
        resolve(false);
      }
    })
    .catch(err => {
      reject(err);
    })
  })
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
      next(err);
    })
  })
}

// Called on a POST request to register/ contacts (i.e. when the user clicks 'Add' to add a new emergency contact)
module.exports.addEmergencyContacts = (req, res, next) => {
  const { Emergency_Contact } = req.app.get("models");
  const path = req.route.path;
  // If the user is registering, add their contacts without checking and redirect to start trip
  if(path === '/register/contacts'){
    createNewContact(req, res, next)
    .then(data => {
      res.status(200).redirect('/trip/start');
    })
  // if the user is already logged in, check to make sure they have less than three contacts, add their new contact, and then redirect to contacts page
  } else {
    checkForContacts(req, res, next)
    .then(contactArray => {
      if(!contactArray){
        console.log('YOU HAVE MORE THAN THREE CONTACTS MOTHERFUCKER')
        res.status(400).send('Sorry! You can only have three contats.')
      } else {
        createNewContact(req, res, next)
        .then(data => {
            res.status(200).redirect('/contacts');
        })
        .catch(err => {
          next(err);
        })
      }
    })
  }
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
      console.log(err);
      next(err);
    })

}

module.exports.deleteContact = (req, res, next) => {
  const { Emergency_Contact } = req.app.get('models');
  Emergency_Contact.destroy({ where: { id: req.params.id } })
    .then(data => {
      res.status(200).send('OK');
    })
    .catch(err => next(err));
}

