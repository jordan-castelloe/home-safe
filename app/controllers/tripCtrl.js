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
  console.log('Get user codes function called');
  const userCodeObj = {safeCode: 1234, emergencyCode: 1235}
  res.status(200).send(userCodeObj);
}

module.exports.sendTexts = (req, res, next) => {
  console.log('Texts sent!!');
  res.status(200).send("Success!!");

}