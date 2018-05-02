'use strict';

let models = require("./models");

// creates a brand spankin' new databse with empty tables
models.sequelize.sync({ force: true })
  .then(() => {
    process.exit();
  });