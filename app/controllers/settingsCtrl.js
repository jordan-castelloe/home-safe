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
      res.status(200).render('settings', dataValues);
    })
    .catch(err => res.status(404));
};

module.exports.displaySettingsForm = (req, res, next) => {
  console.log('!!!!!!!!!!!!!!!!!!!!!! DISPLAY SETTINGS FORM CALLED');
  const { User } = req.app.get('models');
  User.findById(req.user.id)
  .then(({ dataValues }) => {
    console.log('!!!!!!! DATA VALUES!!', dataValues);
    res.status(200).render('edit-settings', dataValues);
  })
  .catch(err => res.status(404));
}

module.exports.editSettings = (req, res, next) => {
  const { User } = req.app.get('models');
  const newData = {
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    email: req.body.email,
    safe_code: req.body.safe_code,
    emergency_code: req.body.emergency_code
  }
  User.update(newData, { where: { id: req.user.id } })
  .then(updatedUser => {
    module.exports.displaySettings(req, res, next);
  })
  .catch(err => {
    module.exports.renderEditForm(req, res, next);
  })
}