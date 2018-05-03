const { Router } = require('express');
const tripRouter = Router();
const { displayTripScreen, displayTripForm, startTrip } = require('../controllers/tripCtrl');

tripRouter.get('/', displayTripScreen);
tripRouter.get('/start', displayTripForm);
tripRouter.post('/start', startTrip);

module.exports = tripRouter;

