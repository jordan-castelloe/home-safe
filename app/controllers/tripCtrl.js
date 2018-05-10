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


module.exports.sendTexts = (req, res, next) => {
  
  const { User } = req.app.get("models");
  const accountSid = 'ACcae2b80fc1398969262d1eb12bd61c29';
  const authToken = 'e4c62e21eb842505db451ce827091d7f';

  const twilio = require('twilio');
  const client = new twilio(accountSid, authToken);

  const { activity, location } = req.body

  User.findById(req.user.id)
  .then(({ dataValues: { first_name } }) => {
    const userName = first_name;
    console.log('user name in .then', userName);
    const message = `Hi there, your friend ${userName} went ${activity} and hasn't made it back in time. Their last known location is ${location.lat}, ${location.long} Would you mind checking in on them?`
    console.log('!!!!!!!!!!!!!! MESSAGE', message);
      // client.messages.create({
  //   body: 'Hi! Your friend Jordan didn\'t make it back from her run in time. Mind checking up on her?',
  //   to: '+18285059785',  
  //   from: '+18286685165'
  // })
  // .then(message => {
  //   console.log('text sent!!');
  //   console.log(message.sid);
  //   res.status(200).send("Success!!");
  // })
  
  })
  .catch(err => {
    console.log(err);
  })

}

// AFTER LUNCH
// redo form to be like a fill-in the blank sentence 
// get geolocation up and running
// get user emergency contact and send them a text