
'use strict';
const express = require('express');
const app = express();
let routes = require('./routes');
const path = require('path');
const passport = require('passport')
const session = require('express-session');
const bodyParser = require('body-parser');
const flash = require('express-flash');
require('dotenv').config()


app.set('models', require('./db/models')); 

app.use(express.static(__dirname + '/static')); 
app.set('views', __dirname + '/views');
app.set('view engine', 'pug');

// Inject session persistence into middleware stack
app.use(session({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true
})); 

//Execute passport strategies file
require('./db/config/passport-strat.js');

// Sets persistent login sessions
app.use(passport.initialize());
app.use(passport.session());
app.use((req, res, next) => {
  res.locals.session = req.session;
  next();
});
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(flash());


// Modularized routing
app.use(routes);

// TODO: add error handling here
app.use((err, req, res, next) => {
  err = err || new Error("Internal Server Error");
  res.status(err.status || 500);
  res.send({ error: err.message });
});

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`listening on port ${port}`);
});