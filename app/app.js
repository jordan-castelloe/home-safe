
'use strict';
const express = require('express');
const app = express();
let routes = require('./routes');

// pull in modularized routes
app.use(routes);

// TODO: add error handling here
const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`listening on port ${port}`);
});