'use strict';

// TODO: change to css
$('.trip-in-progress').hide();
$('.home-safe').hide();

// Declare an empty variable for the setInterval obj so it can be cleared from anywhere
let timer;

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
  console.log('texts sent!!');
  // $.ajax({
  //   url: `/send-text`,
  //   type: 'POST',
  //   success: successMsg=> {
  //     console.log(successMsg);
  //     // TODO: print something to the dom to say the texts were definitely sent?
  //   }
  // })
}

// Called if the user finishes their safe code before the timer ends
// hides the timer and shows the success screen
const homeSafe = () => {
  $('.home-safe').show();
  $('.trip-in-progress').hide();
} 

// accepts the setInterval object, the message we want to print to the DOM when the timer is over, and a boolean that tells us whether or not to text emergency contacts
const stopTimer = (timer, { message, sendText }) => {
  clearInterval(timer);
  $('.timer').text(message);
  sendText ? sendTexts() : homeSafe(); 
}

const getSafeCode = () => {
  // $.ajax({
  //   url: `/safe-code`,
  //   type: 'GET',
  //   success: safeCode => {
  //     return safeCode;
  //   }
  // })
  return 1234;
}

const getEmergencyCode = () => {
  // $.ajax({
  //   url: `/emergency-code`,
  //   type: 'GET',
  //   success: eCode => {
  //     return eCode;
  //   }
  // })
  return 1235;
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

const getReturnTime  = () => {
  // Grab return time and convert it to something Moment.js can use
  let { returnTime } = getTrip();
  const todaysDate = moment().format('MM-DD-YYYY');
  returnTime = moment(`${todaysDate} ${returnTime}`); 
  return returnTime;
}

// starts the timer interval
// clears interval when timer gets down to 0
const startTimer = () => {
  const returnTime = getReturnTime();

  timer = setInterval(() => {
    // Grab the current time
    const now = moment().format('MM-DD-YYYY hh:mm:ss A');

    // calculate milleseconds remaining
    const millesecondsRemaining = returnTime.diff(now);

    // pass milleseconds into the function that breaks it down into minutes, hours, etc
    const timeRemaining = calculateTimeRemaining(millesecondsRemaining);

    // print the time to the dom
    displayTimer(timeRemaining);

    // check if the timer gets down to zero and, if so, clear out the interval
    if (millesecondsRemaining === 0) {
      let safeCodeStatus = {
        message: 'You didn\'t make it back in time! Hope you\'re okay. We let your friends know for you.',
        sendText: true
      }
      stopTimer(timer, safeCodeStatus);
    }
  }, 1000);
}

// Parent function that fires all the other functions
const startTrip = () => {
  showTripProgress();
  startTimer();
}

const endTrip = () => {
  const safeCodeStatus = checkSafeCode(+$("#safe-code").val());
  safeCodeStatus.otherCode ? printError(safeCodeStatus.message) : stopTimer(timer, safeCodeStatus);
}


$('#safe-code-btn').click(endTrip);
$('#start-trip').click(startTrip);



