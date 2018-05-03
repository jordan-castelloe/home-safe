const { Router } = require('express');
const tripRouter = Router();
const { displayTripForm } = require('../controllers/tripCtrl');

tripRouter.use('/', displayTripForm);

module.exports = tripRouter;

