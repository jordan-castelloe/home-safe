'use strict';

// TODO: change to css
$('.trip-in-progress').hide();

// Store trip in local storage
const storeTrip = () => {
  const trip = {
    location: $('#location').val(),
    activity: $('#activity').val(),
    returnTime: $('#return-time').val()
  }
  localStorage.setItem("trip", JSON.stringify(trip));
}

// Hide the trip form and show the timer
const showTripProgress = () => {
  $('.start-trip').hide();
  $('.trip-in-progress').show();
}

// is there any reason to use local storage here??
const startTimer = () => {
  const trip = localStorage.getItem("trip");
  const returnTime = JSON.parse(trip.returnTime);
  console.log(returnTime);
}


// Conglomerate function that fires all the other functions
const startTrip = () => {
  storeTrip();
  showTripProgress();
  startTimer();
}

$('#start-trip').click(startTrip);
