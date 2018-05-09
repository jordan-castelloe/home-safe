const { Router } = require('express');
const tripRouter = Router();
const { displayTripScreen, displayTripForm, startTrip, sendTexts, getUserCodes } = require('../controllers/tripCtrl');

tripRouter.get('/', displayTripScreen);
tripRouter.get('/start', displayTripForm);
tripRouter.post('/start', startTrip);
tripRouter.post('/send-texts', sendTexts)
tripRouter.get('/user-codes', getUserCodes)

module.exports = tripRouter;

