'use strict';

// TODO: change to css
$('.trip-in-progress').hide();

// Store trip in local storage
const getTrip = () => {
  const trip = {
    location: $('#location').val(),
    activity: $('#activity').val(),
    returnHour: $('#hour').val(),
    returnMinute: $('#minute').val(),
    returnTimeOfDay: $('#am-pm').val(),
  }
  localStorage.setItem("trip", JSON.stringify(trip));
  return trip;
}

// Hide the trip form and show the timer
const showTripProgress = () => {
  $('.start-trip').hide();
  $('.trip-in-progress').show();
}

// starts the timer interval
// checks if return time == current time in callback function and stops itself
const startTimer = () => {
  const timer = setInterval(() => {
    // Grab return time values
    const { returnHour, returnMinute, returnTimeOfDay } = getTrip();

    // Grab values for current Time
    const currentHour = parseInt(moment().format('hh'));
    let currentMinute = parseInt(moment().format('mm'));
    const currentTimeOfDay = moment().format('A');

    // if the current minute is less than 10, stick a zero in front of it
    currentMinute = currentMinute < 10 ? `0${currentMinute}` : currentMinute;

    console.log('return time: return minute', `${returnHour}:${returnMinute} ${returnTimeOfDay}`);
    console.log('current hour: current minute', `${currentHour}:${currentMinute} ${currentTimeOfDay}`);

    // If the return time matches the current time, stop the timer
    if (returnHour == currentHour && returnMinute == currentMinute && returnTimeOfDay == currentTimeOfDay) {
      clearInterval(timer);
      console.log("Timer done!!");
    }
  }, 1000);
}

// Parent function that fires all the other functions
const startTrip = () => {
  showTripProgress();
  startTimer();
}

$('#start-trip').click(startTrip);


