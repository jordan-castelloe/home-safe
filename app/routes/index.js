const { Router } = require('express');
const router = Router();

// Mount all of the authentication-related routes
router.use(require('./authRouter'));

module.exports = router;