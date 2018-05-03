'use strict';

module.exports.displayContacts = (req, res, next) => {
  const { Emergency_Contact } = req.app.get("models");
  Emergency_Contact.findAll({
    raw: true,
    where: {
      user_id: req.user.id
    }
  })
  .then(contactArray => {
    console.log('WHAAAAT are we getting back from contacts?', contactArray);
    res.render('contacts', { contactArray })
  })
  .catch(err => {
    console.log('Err', err); 
  })
}
