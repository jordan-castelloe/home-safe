'use strict';

console.log('front-end.js connected!');

$('.deleteContact').on('click', event => {
  let contactId = $(event.target).attr("id");
  console.log('jquery event target id', $(event.target).attr("id"));
  console.log('should be contact id', contactId);
  $.ajax({
    url: `/contacts/${contactId}`,
    type: 'DELETE',
    success: result => {
      console.log('event.target', event.target);
      $(event.target).remove();
    }
  });
});