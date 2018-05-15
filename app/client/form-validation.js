'use strict';

const validateCode = (codeInput, messageDiv) => {
  let message;
  if (codeInput.length !== 4 && !codeInput.match('^[0-9]*$')) {
    message = 'Your safe code must be exactly four digits!';
  } else if (!codeInput.match('^[0-9]*$')) {
    message = 'Your safe code must contain only numbers.'
  } else if (codeInput.length !== 4) {
    message = "Your safe code must be exactly four digits and contain only numbers."
  } else {
    message = "Looks good!";
  }
  messageDiv.text(message);
}



// Validate safe codes
$('#safeCode').keyup(() => {
  let safeCode = $('#safeCode').val();
  let messageDiv = $('#safeCodeMessage');
  validateCode(safeCode, messageDiv);
})

// Validate Emergency codes
$('#eCode').keyup(() => {
  let eCode = $('#eCode').val();
  let messageDiv = $('#eCodeMessage');
  validateCode(eCode, messageDiv);
})

// Check to make sure that confirmation codes match
$('#safeCodeConfirm').keyup(() => {
  let message;
  if($('#safeCode').val() !== $('#safeCodeConfirm').val()){
    message = 'Your codes don\'t match!';
  } else {
    message = 'Great! Your codes match!'
  }
  $('#safeConfirmationMsg').text(message)
})
// Check to make sure that safe code adnd emergency codes aren't the same


// disable the submit button until there are no errors