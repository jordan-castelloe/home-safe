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
const noSleep = new NoSleep();


// Grab and return the trip values, store in local storage
const getTrip = () => {
  trip = {
    activity: $('#activity').val(),
    returnTime: $('#return-time').val()
  }
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
          trip.emergencyCode = true;
          resolve({
            message: "Hang tight, we're notifying your emergency contacts.",
            sendText: true
          })
        }
      })
  })
}

// Promises an object that contains the user's latitude and longitude 
const getCurrentPosition = () => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation){
        reject(false)
    } else {
      navigator.geolocation.getCurrentPosition(({coords}) => {
        resolve(coords);
      })
    }
  })
}


// Prints user's coordiantes to the dom to see how long it takes
const testLocation = () => {
  getCurrentPosition()
  .then(({latitude, longitude}) => {
    $('#testLocation').text(`Your current coordinates are ${latitude} lat, ${longitude} long`);
  })
  .catch(err => {
    $('#testLocation').text(`Sorry! Your browser doesn't support geolocation.`);
    $('#testLocationBtn').prop("disabled", true);
  })
}

// Post the trip object to the back end! The back end will organize the information and send the texts.
const sendTexts = (trip) => {
  $.ajax({
    url: `/trip/send-texts`,
    type: 'POST',
    data: trip
  })
  .done(successMsg => {
    $('#alert').text(successMsg);
    return successMsg
  })
  .fail(err => {
    console.log('could not send texts', err);
    return err;
  })
}

// Called if user enters emergency passcode OR if the timer finishes without a safecode response
// Checks to see if the user asked for geolocation or not
const alertContacts = () => {
  if($('#geolocation').is(':checked')){
    getCurrentPosition()
      .then(({latitude, longitude}) => {
        trip.lat = latitude;
        trip.long = longitude
        sendTexts(trip)
      })
      .catch(err => {
        console.log(err);
      })
  } else {
    sendTexts(trip);
  } 
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
const stopTimer = (timer, { message, sendText, emergencyCode }) => {
  clearInterval(timer);
  $('#alert').text(message);
  sendText ? alertContacts() : homeSafe(); 
  $('#safe-code-btn').remove();
  $('.timer').remove();
  $('#error').remove();
  $('#start-over').show();
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
        sendText: true,
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

// ------------------- EVENT LISTENERS FOR STARTING AND ENDING A TRIP ------------------- //
const startTrip = () => {
  noSleep.enable(); // prevent the browser from going to sleep while the timer is going by playing a tiny mp4 video
  showTripProgress();
  startTimer();
}

const endTrip = () => {
  noSleep.disable();
  checkSafeCode(+$("#safe-code").val())
  .then(safeCodeStatus => {
    stopTimer(timer, safeCodeStatus);
  })
  .catch(error => {
    printError(error.message);
  })
}

$('#testLocationBtn').click(testLocation)
$('#safe-code-btn').click(endTrip);
$('#start-trip').click(startTrip);


// ------------------- EVENT LISTENERS FOR SAMPLE MESSAGES ------------------- //
$('#activity').keyup(() => {
  $('.activitySample').text(`${$('#activity').val()} `);
})

$('#return-time').keyup(() => {
  let returnTime = getReturnTime();
  returnTime = returnTime.format('hh:mm A')
  $('.returnTimeSample').text(` ${returnTime}. `);
})

$('#geolocation').change(() => {
  getCurrentPosition()
  .then(({ latitude, longitude }) => {
    $('.gps').text(` Their last known location is: ${latitude} lat, ${longitude} long.`);
  })
  .catch(err => {
    $('#testLocation').text(`Sorry! Your browser doesn't support geolocation.`);
    $('#testLocationBtn').prop("disabled", true);
  })
})
