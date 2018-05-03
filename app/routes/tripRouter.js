const { Router } = require('express');
const tripRouter = Router();
const { displayTripScreen } = require('../controllers/tripCtrl');

tripRouter.get('/', displayTripScreen);

module.exports = tripRouter;

