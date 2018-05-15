'use strict';

// disable button when page loads
$('#submitBtn').prop('disabled', true);

// We'll use this object to keep track of whether or not we have valid inputs. If all the values are true, then the submit button will be enabled.
const validatorObj = {
  safeCode : {
    valid: false,
    matching: false,
  },
  eCode : {
    valid: false,
    matching: false
  }
}


// Check to see if we should enable the submit button
const checkSubmitBtn = ({safeCode, eCode}) => {
  if(safeCode.valid && safeCode.matching && eCode.valid && eCode.matching){
    console.log('you can submit!');
    $('#submitBtn').prop('disabled', false);
  }
}

const validateCode = (codeInput, messageDiv, codeType) => {
  let message;
  if (codeInput.length !== 4 && !codeInput.match('^[0-9]*$')) {
    message = 'Your safe code must be exactly four digits!';
  } else if (!codeInput.match('^[0-9]*$')) {
    message = 'Your safe code must contain only numbers.';
  } else if (codeInput.length !== 4) {
    message = "Your safe code must be exactly four digits and contain only numbers."
  } else {
    message = "Looks good!";
    validatorObj[codeType].valid = true;
  }
  messageDiv.text(message);
  console.log(validatorObj);
  checkSubmitBtn(validatorObj);
}

const confirmCodes = (safeCode, confirmation, messageDiv, codeType) => {
  let message;
  if (safeCode !== confirmation) {
    message = 'Your codes don\'t match!';
  } else {
    message = 'Great! Your codes match!'
    validatorObj[codeType].matching = true;
  }
  messageDiv.text(message);
  console.log(validatorObj);
  checkSubmitBtn(validatorObj);
}


// Validate safe codes
$('#safeCode').keyup(() => {
  let safeCode = $('#safeCode').val();
  let messageDiv = $('#safeCodeMessage');
  validateCode(safeCode, messageDiv, 'safeCode');
})

// Validate Emergency codes
$('#eCode').keyup(() => {
  let eCode = $('#eCode').val();
  let messageDiv = $('#eCodeMessage');
  validateCode(eCode, messageDiv, 'eCode');
})

// Check to make sure that confirmation codes match
$('#safeCodeConfirm').keyup(() => {
  let safeCode = $('#safeCode').val();
  let confirmation = $('#safeCodeConfirm').val();
  let messageDiv = $('#safeConfirmationMsg');
  confirmCodes(safeCode, confirmation, messageDiv, 'safeCode');

});

// Check to make sure that safe code adnd emergency codes aren't the same
$('#eCodeConfirm').keyup(() => {
  let eCode = $('#eCode').val();
  let confirmation = $('#eCodeConfirm').val();
  let messageDiv = $('#eConfirmationMsg');
  confirmCodes(eCode, confirmation, messageDiv, 'eCode');
});

