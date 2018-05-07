'use strict';

const startTrip = () => {
  const trip = {
    location: $('#location').val(),
    activity: $('#activity').val(),
    returnTime: $('#return-time').val()
  }
  console.log('trip', trip);
  localStorage.setItem("trip", JSON.stringify(trip));
}

$('#start-trip').click(startTrip)
