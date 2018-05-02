'use strict';
module.exports = (sequelize, DataTypes) => {
  var Emergency_Contact = sequelize.define('Emergency_Contact', {
    name: DataTypes.STRING,
    phone_number: DataTypes.STRING
  }, {});
  Emergency_Contact.associate = function(models) {
    Emergency_Contact.belongsToMany(models.User, {
      foreignKey: 'user_id'
    });
  };
  return Emergency_Contact;
};