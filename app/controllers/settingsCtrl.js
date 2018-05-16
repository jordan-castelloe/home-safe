'use strict';


module.exports.displaySettings = (req, res, next) => {
  const { User } = req.app.get('models');
  User.findById(req.user.id)
    .then(({ dataValues }) => {
      res.status(200).render('settings', dataValues);
    })
    .catch(err => {
      const error = new Error("Could not get the user's account information.");
      err.status = 400;
      next(err);
    });
};

module.exports.displaySettingsForm = (req, res, next) => {
  const { User } = req.app.get('models');
  User.findById(req.user.id)
  .then(({ dataValues }) => {
    res.status(200).render('edit-settings', dataValues);
  })
  .catch(err => {
    const error = new Error("Could not get the user's account information");
    err.status = 400;
    next(err);
  });
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