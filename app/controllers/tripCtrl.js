'use strict';

// Renders the splash page with the "start trip" button (called immediately after login)
module.exports.displayTripScreen= (req, res, next) => {
  res.render('start-trip');
}

// Displays the form to start a new trip, called when the user clicks on the "start trip button" in start-trip.pug
module.exports.displayTripForm = (req, res, next) => {
  res.render('trip-form');
}

// starts timer
// renders timer
// renders space for passcode
module.exports.startTrip = (req, res, next) => {
  // TODO: start timer
  res.render('trip-in-progress');
}