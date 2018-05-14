'use strict';

// TODO: change to css
$('.trip-in-progress').hide();
$('#start-over').hide();



// ------------------- TRIP TIMER LOGIC ------------------- //

// Process to build the timer:

// 1. When the user clicks 'Start Trip', grab the return time they entered and convert it to a Moment.js format so we can work with it.
// 2. Start a setInterval function that runs every second. This function will do a few things:
//    a. Calculate the time remaining (i.e. the difference between the current time and the return time. This will be in milleseconds by default, so we'll pass it into a function that breaks it down into seconds, minutes, and hours.)
//    b. Print the time remaining to the DOM. This is our countdown clock, and it'll update once per second.
//    c. Check and see if the time remaining is zero. If so, clear the interval and call the function to send texts.
// 3. While the timer is running,users can input their safe code or their emergency code.
//    a. If they enter their safe code, the timer stops and a 'Start Trip' button appers
//    b. If they enter their emergency code, the timer stops and the function to send texts is called
//    c. If they enter anything other than their safe code or emergency code, the timer keeps going and they get an error message 


// Declare an empty variable for the setInterval obj so it can be cleared from anywhere
let timer;
let trip;

// Grab and return the trip values, store in local storage
const getTrip = () => {
  trip = {
    activity: $('#activity').val(),
    returnTime: $('#return-time').val()
  }
  localStorage.setItem("trip", JSON.stringify(trip));
  return trip;
}

// Grab return time and convert it to something Moment.js can use
const getReturnTime = () => {
  let { returnTime } = getTrip();
  const todaysDate = moment().format('MM-DD-YYYY');
  returnTime = moment(`${todaysDate} ${returnTime}`);
  return returnTime;
}

// Grabs the current user's safe code and emergency code from the database
const getUserCodes = () => {
  return new Promise((resolve, reject) => {
    $.ajax({
      url: `/trip/user-codes`,
      type: 'GET',
    })
      .done(codeObj => {
        resolve(codeObj)
      })
      .fail(err => {
        reject(err);
      })
  })
}

// checks whether the user enetered their safe code, emergency code, or other. Resolves or rejcts a safe code status object.
const checkSafeCode = code => {
  return new Promise((resolve, reject) => {
    getUserCodes()
      .then(({ safe_code, emergency_code }) => {
        let safeCodeStatus = {};
        if (code !== safe_code && code !== emergency_code) {
          reject({
            message: "We don\'t recognize that code. Please try again.",
            sendText: false
          })
        } else if (code === safe_code) {
          resolve({
            message: "Glad you made it home safe!",
            sendText: false
          })
        } else if (code === emergency_code) {
          resolve({
            message: "Hang tight, we're notifying your emergency contacts.",
            sendText: true
          })
        }
      })
  })
}


// Checks and see if geolocation is available -- if so, adds a location object onto the trip. If not, sends back the trip with no location object.
const getCurrentLocation = () => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      resolve(trip);
    } else {
      navigator.geolocation.getCurrentPosition(position => {
        trip.lat = position.coords.latitude;
        trip.long = position.coords.longitude;
        resolve(trip);
      })
    }
  })
}

const sendTexts = (trip) => {
  $.ajax({
    url: `/trip/send-texts`,
    type: 'POST',
    data: trip
  })
  .done(successMsg => {
    $('.timer').text(successMsg);
    return successMsg
  })
  .fail(err => {
    console.log('could not send texts', err);
    
    return err;
  })
}


// Called if user enters emergency passcode OR if the timer finishes without a safecode response
const alertContacts = () => {
  trip = JSON.parse(localStorage.getItem("trip"));
  getCurrentLocation()
  .then(trip=> {
    sendTexts(trip)
  })
  .catch(err => {
    console.log(err);
  })
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

// prints timer to DOM (called at one second interval)
const displayTimer = ({hours, minutes, seconds, milleseconds}) => {

  // add a 0 in front of number if it's less than 10
  hours = hours < 10 ? `0${hours}` : hours;
  minutes = minutes < 10 ? `0${minutes}` : minutes;
  seconds = seconds < 10 ? `0${seconds}` : seconds;

  // print the remaining time to the dom
  $('.timer').text(`We'll text your emergency contacts in ${hours}:${minutes}:${seconds}`);
}


// accepts the setInterval object, the message we want to print to the DOM when the timer is over, and a boolean that tells us whether or not to text emergency contacts
const stopTimer = (timer, { message, sendText }) => {
  clearInterval(timer);
  $('.timer').text(message);
  sendText ? alertContacts() : homeSafe(); 
}



// Starts the timer interval and clears it when the time remaining === 0
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

// ------------------- DOM MANIPULTAION ------------------- //

// Called if the user finishes their safe code before the timer ends
// hides the timer and shows the success screen
const homeSafe = () => {
  $('#start-over').show();
} 
// Hide the trip form and show the timer
const showTripProgress = () => {
  $('.start-trip').hide();
  $('.trip-in-progress').show();
}

// Called if the user enters anything other than their safe code or emergency code
const printError = (message) => {
  $('#error').text(message);
}

// ------------------- EVENT LISTENERS ------------------- //
const startTrip = () => {
  showTripProgress();
  startTimer();
}

const endTrip = () => {
  checkSafeCode(+$("#safe-code").val())
  .then(safeCodeStatus => {
    stopTimer(timer, safeCodeStatus);
  })
  .catch(error => {
    printError(error.message);
  })
}

$('#safe-code-btn').click(endTrip);
$('#start-trip').click(startTrip);
