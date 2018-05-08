'use strict';

$('.deleteContact').on('click', event => {
  let contactId = $(event.target).attr("id");
  $.ajax({
    url: `/contacts/${contactId}`,
    type: 'DELETE',
    success: result => {
      console.log('event.target', event.target);
      $(event.target).remove();
    }
  });
});