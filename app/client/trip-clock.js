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

// is there any reason to use local storage here??
const checkTime = () => {
  // Grab return time values
  const { returnHour, returnMinute, returnTimeOfDay } = getTrip();
  
  // Grab values for current Time
  const currentHour =  parseInt(moment().format('hh'));
  const currentMinute = parseInt(moment().format('mm'));
  const currentTimeOfDay = moment().format('A');
  console.log('return time: return minute', `${returnHour}:${returnMinute} ${returnTimeOfDay}`);
  console.log('current hour: current minute', `${currentHour}:${currentMinute} ${currentTimeOfDay}`);


}

// Parent function that fires all the other functions
const startTrip = () => {
  showTripProgress();
  setInterval(checkTime, 1000);
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