'use strict';
module.exports = (sequelize, DataTypes) => {
  var User = sequelize.define('User', {
    first_name: DataTypes.STRING,
    last_name: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    safe_code: DataTypes.INTEGER,
    emergency_code: DataTypes.INTEGER,
    message_count: DataTypes.INTEGER
  }, {});
  User.associate = function(models) {
    User.hasMany(models.Emergency_Contact, {
      foreignKey: 'user_id'
    });
  };
  return User;
};