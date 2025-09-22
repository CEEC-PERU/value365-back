const express = require('express');
const router = express.Router();
const userController = require('./users.controller');
const verifyToken = require('../auth/jwt.middleware');


router.get('/me',verifyToken, userController.getProfile);

module.exports = router;
