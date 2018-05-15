'use strict';
let message;

const validateCode = (codeInput, messageDiv) => {
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
