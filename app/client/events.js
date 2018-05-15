'use strict';

$('.deleteContact').on('click', event => {
  let contactId = $(event.target).attr("id");
  $.ajax({
    url: `/contacts/${contactId}`,
    type: 'DELETE',
  })
  .done(() => {
    location.reload();
  })
  .fail(err => {
    console.log('Something went wrong!', err);
  })
});

$('#logout').click(() => {
  $.ajax({
    url: `/settings/logout`,
    type: 'POST',
  })
  .fail(err => {
    console.log('Something went wrong!', err);
  })
})


