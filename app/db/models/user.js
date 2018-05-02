'use strict';
module.exports = (sequelize, DataTypes) => {
  var User = sequelize.define('User', {
    first_name: DataTypes.STRING,
    last_name: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    safe_code: DataTypes.NUMBER,
    emergency_code: DataTypes.NUMBER,
    message_count: DataTypes.NUMBER
  }, {});
  User.associate = function(models) {
    User.hasMany(models.Emergency_Contact, {
      foreignKey: 'user_id'
    });
  };
  return User;
};