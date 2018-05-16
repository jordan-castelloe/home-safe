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

const buildMessage = ({ activity, lat, long, emergencyCode, returnTime }, contactName, userName) => {
  const greeting = `Hi ${contactName}, your friend ${userName} went ${activity}.`;
  const urgency = emergencyCode ? `They entered their emergency code, which means they might be in trouble.` : `They thought they'd be back by ${returnTime} but they haven't checked in yet.`;
  const location = lat && long ? `Their last known location is: ${lat} lat, ${long} long.` : ``;
  const textMessage = `${greeting} ${urgency} ${location}  Would you mind checking up on them?`
  return textMessage;
}

const sendToTwilio = (contactArray, req) => {
  const twilio = require('twilio');
  const client = new twilio(process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN);
  return Promise.all(
    contactArray.map(contact => {
      let message = buildMessage(req, contact.name, contact.first_name);
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

