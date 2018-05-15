'use strict';


  // find user by current user id
  // pass theri information into pug template
  // make pug template
  // AT THAT POINT settings form should display
  // there should be an edit button and a logout button
  // logout should take you back to login
  // edit should take you to a form with all your default information
  // name, password


  // FORM VALIDATION
  
  // ERROR HANDLING



module.exports.displaySettings = (req, res, next) => {
  const { User } = req.app.get('models');
  User.findById(req.user.id)
    .then(({ dataValues }) => {
      console.log('!!!!!!!!!!!!!!!!! DATA VALUES', dataValues);
      res.render('settings', dataValues);
    })
    .catch(err => res.status(404));
};

module.exports.displayEditSettingsForm = (req, res, next) => {
  const { User } = req.app.get('models');
  User.findById(req.user.id)
    .then(({ dataValues }) => {
      res.render('edit-settings', dataValues);
    })
    .catch(err => res.status(404));
}

// module.exports.editUserSettings = (req, res, next) => {
//   const { User } = req.app.get('models');
//   const newData = {
//     first_name: req.body.first_name,
//     last_name: req.body.last_name,
//     street_address: req.body.street_address,
//     city: req.body.city,
//     state: req.body.state,
//     postal_code: req.body.postal_code,
//     phone_number: req.body.phone_number,
//   }
//   User.update(newData, { where: { id: req.user.id } })
//     .then(updatedUser => {
//       module.exports.displayUsersSettings(req, res, next);
//     })
//     .catch(err => {
//       module.exports.renderEditForm(req, res, next);
//     })
// }