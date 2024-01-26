const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chat.controller');
const dataValidation = require('../middleware/postValidation');
const verifyToken = require('../middleware/verifyToken');

// Create Conversation route
router.post('/createConversation', chatController.createConversation);
router.post(
  '/conversationsList/:userId',
  verifyToken,
  chatController.getAllConversations,
);
router.post(
  '/getAllConversationsForUserWithDetails/:userId',
  verifyToken,
  chatController.getAllConversationsForUserWithDetails,
);
router.post(
  '/getAllConversationsFor2Users/:user1Id/:user2Id',
  verifyToken,
  chatController.getAllConversationsFor2Users,
);
module.exports = router;
