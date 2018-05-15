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


$('#edit-settings').click(() => {
  console.log('you clicked the edit settings button!');
})

$('#logout').click(() => {
  console.log('you clicked logout!');
})


