const { Router } = require('express');
const router = Router();
const checkAuth = require('./checkAuth');
const { displayTripScreen } = require('../controllers/tripCtrl')
// Mount all of the authentication-related routes
router.use(require('./authRouter'));

//All routes after this checkpoint require authentication
router.use(checkAuth);

// Mount all trip-related routes
router.use('/trip', require('./tripRouter'));
router.use('/contacts', require('./contactsRouter'));
router.use('/settings', require('./settingsRouter'));
router.use('/', displayTripScreen);

module.exports = router;