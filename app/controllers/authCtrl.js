'use strict';
const passport = require('passport');

// creating new users
module.exports.displayRegister = (req, res, next) => {
  res.render('register');
};

module.exports.register = (req, res, next) => {
  if (req.body.password === req.body.confirm_password) {
    // first argument is name of the passport strategy we created in passport-strat.js
    passport.authenticate('local-signup', (err, user, msgObj) => {

      if (err) { console.log(err); } //or return next(err)
      if (!user) { return res.render('register', msgObj); }

      // Go ahead and login the new user once they are signed up
      req.logIn(user, (err) => {
        if (err) { return next(err); }
        // Save a msg in a cookie whose value will be added to req
        // using https://www.npmjs.com/package/express-flash-2 docs, but installed express-flash
        req.flash('registerMsg', `Thanks for signing up, ${user.first_name}!`);
        // Redirect kicks off a new request and makes the route in the URL match the location we have sent the user to. That's why we have to create a flash message so it will persist through the new request of the welcome route
        res.redirect('/register/contacts');
      });
    })(req, res, next);
  } else {
    res.render('register', { message: 'Password & password confirmation do not match' })
  }
};

// logging in existing users
module.exports.displayLogin = (req, res, next) => {
  res.render('login');
};

module.exports.login = (req, res, next) => {
  // Note we're using different strategy, this time for logging in
  passport.authenticate('local-signin', (err, user, msgObj) => {
    if (err) { console.log(err) } //or return next(err) once handler set up in app.js
    if (!user) {
      return res.render('login', msgObj)
    }

    req.logIn(user, err => {
      if (err) { return next(err) }
      req.flash('welcomeBackMsg', `Welcome back, `);
      res.redirect('/trip');
    });
  })(req, res, next);
};


// logging out
module.exports.logout = (req, res, next) => {
  req.session.destroy(function (err) {
    res.redirect('/login');
  });
};

// Called on GET request to register/contacts
module.exports.displayContactsForm = (req, res, next) => {
  res.render('emergency-contact-form');
}

// Called on a POST request to register/ contacts (i.e. when the user clicks 'Add' to add a new emergency contact)
module.exports.addEmergencyContacts = (req, res, next) => {
  const { Emergency_Contact } = req.app.get("models");

  const newContact = { 
    name: req.body.name,
    phone_number: req.body.phone_number
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