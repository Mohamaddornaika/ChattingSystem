const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chat.controller');
const dataValidation = require('../middleware/postValidation');
const verifyToken = require('../middleware/verifyToken');

module.exports = router;
