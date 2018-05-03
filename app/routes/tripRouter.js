const { Router } = require('express');
const tripRouter = Router();
const { displayTripScreen, displayTripForm } = require('../controllers/tripCtrl');

tripRouter.get('/', displayTripScreen);
tripRouter.get('/start', displayTripForm);

module.exports = tripRouter;

