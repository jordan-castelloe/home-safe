'use strict';

// Renders the splash page with the "start trip" button (called immediately after login)
// Checks to see how many emergency contacts you have then passes it into pug template. 
// The pug template won't let you start the trip if you have no emergency contacts
module.exports.displayTripScreen= (req, res, next) => {
  const { Emergency_Contact } = req.app.get("models");
  Emergency_Contact.findAll({
    raw: true,
    where: {
      user_id: req.user.id
    }
  })
  .then(contactArray => {
    let numberOfContacts = contactArray.length;
    res.render('start-trip', { numberOfContacts })
  })
  .catch(err => {
    const error = new Error("Could not get the user's emergency contacts in displayTripScreen to make sure they have at least 1.");
    err.status = 400;
    next(err);
  })
}

// Displays the form to start a new trip, called when the user clicks on the "start trip button" in start-trip.pug
module.exports.displayTripForm = (req, res, next) => {
  res.render('trip-form');
}

module.exports.getUserCodes = (req, res, next) => {
  const { User } = req.app.get("models");
  User.findById(req.user.id)
  .then(({ dataValues: { safe_code, emergency_code } }) => {
    res.status(200).send({ safe_code, emergency_code });
  })
  .catch(err => {
    const error = new Error("Could not find the user's safe code and emergency code.");
    err.status = 400;
    next(err);
  })
}

// TODO: Send a different text msg if they used their emergency code

const sendToTwilio = (contactArray, req) => {
  const twilio = require('twilio');
  const client = new twilio(process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN);
  const { activity, lat, long } = req;
  return Promise.all(
    contactArray.map(contact => {
      let message = `Hi ${contact.name}, your friend ${contact.first_name} went ${activity} and hasn't made it back in time. Their last known location is: ${lat} lat, ${long} long. Would you mind checking in on them?`
      return client.messages.create({
        body: message,
        to: contact.phone_number,
        from: process.env.TWILIO_NUMBER
      })
    })
  )
}


module.exports.sendTexts= (req, res, next) => {
  const Sequelize = require('sequelize');
  const sequelize = new Sequelize({
    "database": "homesafe",
    "dialect": "postgres"
  }); 
  sequelize.query(
    `SELECT e.name, e.phone_number, u.first_name FROM "Emergency_Contacts" e JOIN "Users" u ON e.user_id = u.id WHERE u.id = ${req.user.id}`
  )
  .spread( contactArray => {
    return sendToTwilio(contactArray, req.body)
  })
  .then(msg => {
    const successMsg = 'Success! We texted your emergency contacts.';
    res.status(200).send(successMsg);
  })
  .catch(err => {
    const error = new Error(`Could not send texts: ${err}`);
    err.status = 400;
    next(err);
  })
}

