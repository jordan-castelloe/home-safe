'use strict';

const { Router } = require('express');
const settingsRouter = Router();
const { displaySettings, editSettings } = require('../controllers/settingsCtrl');
const { logout } = require('../controllers/settingsCtrl');


settingsRouter.get('/', displaySettings);
settingsRouter.post('/edit', editSettings);
settingsRouter.get('/edit', displayEditSettingsForm)
settingsRouter.post('/logout', logout)

module.exports = settingsRouter;