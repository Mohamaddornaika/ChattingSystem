const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chat.controller');
const dataValidation = require('../middleware/postValidation');
const verifyToken = require('../middleware/verifyToken');

// Create Conversation route
router.post('/createConversation', chatController.createConversation);
router.get(
  '/conversationsList/:userId',
  verifyToken,
  chatController.getAllConversations,
);
module.exports = router;
