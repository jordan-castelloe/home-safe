'use strict';

// Renders the splash page with the "start trip" button (called immediately after login)
module.exports.displayTripScreen= (req, res, next) => {
  res.render('start-trip');
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
    console.log('Err', err);
  })
}

// const getEmergencyContacts = (Emergency_Contact, userId) => {
//   return new Promise((resolve, reject) => {
//     Emergency_Contact.findAll({
//       raw: true,
//       where: {
//         user_id: userId
//       }
//     })
//     .then(contactArray => {
//       resolve(contactArray);
//     })
//     .catch(err => {
//       reject(err);
//     })
//   })
// }

// const getUserName = (UserModel, userId) => {
//   return new Promise((resolve, reject) => {
//     UserModel.findById(userId)
//     .then(({ dataValues: { first_name } }) => {
//       resolve(first_name)
//     })
//     .catch(err => {
//       reject(err);
//     })
//   })
// }

// TODO: Send a different text msg if they used their emergency code

const sendToTwilio = (userName, contactName, contactNumber, req) => {
  const accountSid = 'ACcae2b80fc1398969262d1eb12bd61c29';
  const authToken = 'e4c62e21eb842505db451ce827091d7f';
  const twilio = require('twilio');
  const client = new twilio(accountSid, authToken);
  const { activity, lat, long } = req.body;

  const message = `Hi ${contactName}, your friend ${userName} went ${activity} and hasn't made it back in time. Their last known location is: ${lat} lat, ${long} long. Would you mind checking in on them?` 

  console.log('message and number', message, contactNumber);
  // client.messages.create({
  //   body: message,
  //   to: contactNumber,
  //   from: '+18286685165'
  // })
  // .then(message => {
  //   console.log(message.sid);
  //   res.status(200).send("Texts sent!");
  // })    
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
  .spread( contacts => {
    contacts.forEach(contact => {
      console.log('contact', contact);
      sendToTwilio(contact.first_name, contact.name, contact.phone_number, req);
    })
  })
}

