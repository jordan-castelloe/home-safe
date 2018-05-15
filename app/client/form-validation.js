'use strict';

// disable buttons when page loads
$('#submitBtn').prop('disabled', true);

// We'll use this object to keep track of whether or not we have valid inputs. If all the values are true, then the submit button will be enabled.
const validator = {
  safeCode : {
    valid: false,
    matching: false,
  },
  eCode : {
    valid: false,
    matching: false
  },
  duplicates: true
}

// Check to see if we should enable the submit button on registration screen
const checkSubmitBtn = ({safeCode, eCode, duplicates}) => {
  if(safeCode.valid && safeCode.matching && eCode.valid && eCode.matching && !duplicates){
    $('#submitBtn').prop('disabled', false);
  } else {
    $('#submitBtn').prop('disabled', true);
  }
}

// Check to see if we should enable the submit button on registration screen
const checkEditSettings = ({ safeCode, eCode, duplicates }) => {
  $('#submitEdit').prop('disabled', true);
  if (safeCode.valid && eCode.valid && !duplicates) {
    $('#submitEdit').prop('disabled', false);
  } else {
    $('#submitEdit').prop('disabled', true);
  }
}

// Checks to see if the code is four digits and only numbers
const validateCode = (codeInput, messageDiv, codeType) => {
  let message;
  if (codeInput.length !== 4 && !codeInput.match('^[0-9]*$')) {
    message = 'Your safe code must be exactly four digits.';
  } else if (!codeInput.match('^[0-9]*$')) {
    message = 'Your safe code must contain only numbers.';
  } else if (codeInput.length !== 4) {
    message = "Your safe code must be exactly four digits and contain only numbers."
  } else {
    message = "Looks good!";
    validator[codeType].valid = true;
  }
  messageDiv.text(message);
}

// Checks to see if the code matches the confirmation code
const confirmCodes = (safeCode, confirmation, messageDiv, codeType) => {
  let message;
  if (safeCode !== confirmation) {
    message = 'Your codes don\'t match!';
  } else {
    message = 'Great! Your codes match!'
    validator[codeType].matching = true;
  }
  messageDiv.text(message);
  
}

// Check to make sure emergency code and safe codes are different
const checkDuplicates = (eCode, safeCode) => {
  console.log('ecode', eCode, 'safeCode', safeCode);
  if(eCode !== safeCode){
    validator.duplicates = false;
  } else if (eCode === safeCode) {
    validator.duplicates = true;
    $('#eCodeMessage').text("Your emergency code must be different than your safe code.");
  }
}

// Validate safe codes
$('#safeCode').keyup(() => {
  let safeCode = $('#safeCode').val();
  let messageDiv = $('#safeCodeMessage');
  validateCode(safeCode, messageDiv, 'safeCode');
  checkSubmitBtn(validator);
})

// Validate Emergency codes
$('#eCode').keyup(() => {
  let eCode = $('#eCode').val();
  let messageDiv = $('#eCodeMessage');
  validateCode(eCode, messageDiv, 'eCode');
  console.log('safe code val in event listner', $('#safeCode').val())
  checkDuplicates($('#eCode').val(), $('#safeCode').val())
  checkSubmitBtn(validator);
})

// Check to make sure that confirmation codes match
$('#safeCodeConfirm').keyup(() => {
  let safeCode = $('#safeCode').val();
  let confirmation = $('#safeCodeConfirm').val();
  let messageDiv = $('#safeConfirmationMsg');
  confirmCodes(safeCode, confirmation, messageDiv, 'safeCode');
  checkSubmitBtn(validator);
});

// Check to make sure that safe code adnd emergency codes aren't the same
$('#eCodeConfirm').keyup(() => {
  let eCode = $('#eCode').val();
  let confirmation = $('#eCodeConfirm').val();
  let messageDiv = $('#eConfirmationMsg');
  confirmCodes(eCode, confirmation, messageDiv, 'eCode');
});


// EDIT SETTINGS VIEW

// Validate safe codes
$('#editSafeCode').keyup(() => {
  let safeCode = $('#editSafeCode').val();
  let messageDiv = $('#editSafeCodeMsg');
  validateCode(safeCode, messageDiv, 'safeCode');
  checkSubmitBtn(validator);
})

// Validate Emergency codes
$('#editECode').keyup(() => {
  let eCode = $('#editECode').val();
  let messageDiv = $('#editECodeMsg');
  validateCode(eCode, messageDiv, 'eCode');
  checkDuplicates($('#editECode').val(), $('#editSafeCode').val())
  checkEditSettings(validator);
})


