'use strict';

const { Router } = require('express');
const settingsRouter = Router();
const { displaySettings, editSettings, displaySettingsForm } = require('../controllers/settingsCtrl');
const { logout } = require('../controllers/authCtrl');


settingsRouter.get('/', displaySettings);
settingsRouter.post('/edit', editSettings);
settingsRouter.get('/edit', displaySettingsForm);
settingsRouter.post('/logout', logout)

module.exports = settingsRouter;