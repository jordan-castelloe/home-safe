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
  const trip = JSON.parse(localStorage.getItem("trip"));
  const returnTime = moment(trip.returnTime, "hh:mm:ss A")
  console.log('moment obj', returnTime);
  const currentHour =  parseInt(moment().format('H'));
  const currentMinute = parseInt(moment().format('mm'));
  console.log('current hour: current minute', `${currentHour}:${currentMinute}`);
}

// Parent function that fires all the other functions
const startTrip = () => {
  storeTrip();
  showTripProgress();
  startTimer();
}

$('#start-trip').click(startTrip);


// function displayTime() {
//   $('.clock').text(moment().format('H:mm:ss a'));
//   setTimeout(displayTime, 1000);
// }

// function clearForm() {
//   document.getElementById("alarm-form").reset();
// }

// var sound = document.getElementById("sound");

// function playAlarm() {
//   sound.play();
// }

// function snoozeAlarm() {
//   clearInterval(myVar);
// }


// $(document).ready(function () {
//   //when page is loaded run displayTime
//   displayTime();
//   $('#alarm').hide();

//   $('#alarm-form').submit(function (event) {
//     event.preventDefault();

//     var hour = parseInt($('#hour').val());
//     var minute = parseInt($('#minute').val());
//     $(".alarm-set").text("Your alarm is set for " + hour + ":" + minute);

//     function alarmTimer() {
//       var currentHour = parseInt(moment().format('H'));
//       var currentMinute = parseInt(moment().format('mm'));

//       if ((hour === currentHour) && (minute === currentMinute)) {
//         $('#alarm').show();
//         $('.alarm-set').hide();
//         playAlarm();
//       }
//     }
//     var myVar = setInterval(function () { alarmTimer() }, 1000);
//     // setInterval(alarmTimer, 1000);
//   });
// });