'use strict';

$('.deleteContact').on('click', event => {
  let contactId = $(event.target).attr("id");
  $.ajax({
    url: `/contacts/${contactId}`,
    type: 'DELETE',
  })
  .done(() => {
    console.log('event.target', event.target);
    $(event.target).remove();
  })
  .fail(err => {
    console.log('Something went wrong!', err);
  })
});

