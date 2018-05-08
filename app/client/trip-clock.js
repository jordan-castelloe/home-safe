'use strict';

// TODO: change to css
$('.trip-in-progress').hide();

// Store trip in local storage
const getTrip = () => {
  const trip = {
    location: $('#location').val(),
    activity: $('#activity').val(),
    // returnHour: $('#hour').val(),
    // returnMinute: $('#minute').val(),
    // returnTimeOfDay: $('#am-pm').val(),
    returnTime: $('#return-time').val()
  }
  localStorage.setItem("trip", JSON.stringify(trip));
  return trip;
}

// Hide the trip form and show the timer
const showTripProgress = () => {
  $('.start-trip').hide();
  $('.trip-in-progress').show();
}

const calculateTimeRemaining = (milleseconds) => {
  const timer = {};

  timer.hours = Math.floor(milleseconds / 3600000);
  milleseconds = milleseconds % 3600000;

  timer.minutes = Math.floor(milleseconds / 60000);
  milleseconds = milleseconds % 60000;

  timer.seconds = Math.floor(milleseconds / 1000);
  
  return timer;
}

const displayTimer = ({hours, minutes, seconds, milleseconds}) => {
  console.log('hours left:', hours);
  console.log('minutes left:', minutes);
  console.log('seconds left:', seconds);

}

// starts the timer interval
// clears interval when timer gets down to 0
const startTimer = () => {
  const timer = setInterval(() => {

    // Grab return time and convert it to something Moment.js can use
    let { returnTime } = getTrip(); 
    const todaysDate = moment().format('MM-DD-YYYY'); 
    returnTime = moment(`${todaysDate} ${returnTime}`);   
    
    // Grab the current time
    const now = moment().format('MM-DD-YYYY hh:mm:ss A');

    // calculate milleseconds, seconds, minutes, and hours left between current time and scheduled return time
    const millesecondsRemaining = returnTime.diff(now);
    const timeRemaining = calculateTimeRemaining(millesecondsRemaining);

    displayTimer(timeRemaining);

    if (millesecondsRemaining === 0) {
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



