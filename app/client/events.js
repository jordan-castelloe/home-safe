'use strict';

console.log('front-end.js hooked up!');

$('.deleteContact').on('click', event => {
  console.log('button clicked!');
  let contactId = $(event.target).attr("id");
  console.log(contactId);
  console.log(event.target);
  $.ajax({
    url: `/contacts/${contactId}`,
    type: 'DELETE',
  })
  .done(() => {
    console.log('event.target', event.target);
    $(event.target).parents('.card').remove();
    console.log($(event.target).parents('.card'));
  })
  .fail(err => {
    console.log('Something went wrong!', err);
  })
});

