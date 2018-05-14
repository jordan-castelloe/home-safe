'use strict';

$('.deleteContact').on('click', event => {
  let contactId = $(event.target).attr("id");
  $.ajax({
    url: `/contacts/${contactId}`,
    type: 'DELETE',
  })
  .done(() => {
    $(event.target).parents('.card').remove();
  })
  .fail(err => {
    console.log('Something went wrong!', err);
  })
});

