'use strict';

// TODO: change to css
$('.trip-in-progress').hide();

// Grab and return the trip values, store in local storage
const getTrip = () => {
  const trip = {
    location: $('#location').val(),
    activity: $('#activity').val(),
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

// Accepts number of milleseconds remaining, converts to hours, minutes, etc.
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

  // add a 0 in front of number if it's less than 10
  hours = hours < 10 ? `0${hours}` : hours;
  minutes = minutes < 10 ? `0${minutes}` : minutes;
  seconds = seconds < 10 ? `0${seconds}` : seconds;

  // print the remaining time to the dom
  $('.timer').text(`Time Remaining: ${hours}:${minutes}:${seconds}`);
}

// Called if user enters emergency passcode OR if the timer finishes without a safecode response
const sendTexts = () => {

}

// Called if the user finishes their safe code before the timer ends
const homeSafe = () => {

} 

// accepts the setInterval object, the message we want to print to the DOM when the timer is over, and a boolean that tells us whether or not to text emergency contacts
const stopTimer = (timer, safeCodeObj) => {
  clearInterval(timer);
  $('timer').text(message);
  sendText ? sendText() : homeSafe(); 
}

const getSafeCode = () => {
  $.ajax({
    url: `/safe-code`,
    type: 'GET',
    success: safeCode => {
      return safeCode;
    }
  })
}

const getEmergencyCode = () => {
  $.ajax({
    url: `/emergency-code`,
    type: 'GET',
    success: eCode => {
      return eCode;
    }
  })
}

const checkSafeCode = (code) => {
  const safeCode = getSafeCode();
  const emergencyCode = getEmergencyCode();
  let safeCodeStatus = {};

  if(code !== safeCode && code !== emergencyCode){
    safeCodeStatus = {
      otherCode: true,
      message: "We don\'t recognize that code. Please try again.",
      sendText: false
    }
  } else if(code === safeCode) {
    safeCodeStatus = {
      message: "Glad you made it home safe!",
      sendText: false
    }
  } else if (code === emergencyCode){
    safeCodeStatus = {
      message: "Hang tight, we're notifying your emergency contacts.",
      sendText: true
    }
  }
  return safeCodeStatus;
}

// Called if the user enters anything other than their safe code or emergency code
const printError = (message) => {
  $('#error').text(message);
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

    // calculate milleseconds remaining and then pass that into a function that breaks i
    const millesecondsRemaining = returnTime.diff(now);
    const timeRemaining = calculateTimeRemaining(millesecondsRemaining);

    displayTimer(timeRemaining);

    // ENDING A TRIP: either enter a code or let the timer expire all by itself
    $('#safe-code').click(() => {
      let { message, safeCodeBool } = checkSafeCode($("#safe-code").val());
      message ? stopTimer(timer, message, boolean) : printError();
    })

    if (millesecondsRemaining === 0) {
      let message = 'You didn\'t make it back in time! Hope you\'re okay. We let your friends know for you.'
      stopTimer(timer, message, true);
    }
  }, 1000);
}

// Parent function that fires all the other functions
const startTrip = () => {
  showTripProgress();
  startTimer();
}


$('#start-trip').click(startTrip);



