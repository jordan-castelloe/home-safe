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


// $('#edit-settings').click(() => {
//   $.ajax({
//     url: ``,
//     type: 'GET',
//   })
//   .done(() => {
//     console.log('in the done!');
//   })
//   .fail(err => {
//     console.log('Something went wrong!', err);
//   })
// })

$('#logout').click(() => {
  $.ajax({
    url: `/settings/logout`,
    type: 'POST',
  })
  .done(() => {
    console.log('in the done!');
  })
  .fail(err => {
    console.log('Something went wrong!', err);
  })
})


