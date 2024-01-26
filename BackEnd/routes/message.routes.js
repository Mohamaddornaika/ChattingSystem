const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/verifyToken');
const messageController = require('../controllers/message.controller');

// Import Socket.io
const { server, io } = require('../middleware/socket');

// Routes
router.post('/sendMessages', verifyToken, messageController.createMessage);
router.post(
  '/messages/:conversationId',
  verifyToken,
  messageController.getMessagesForConversation,
);

// WebSocket connection
io.on('connection', (socket) => {
  console.log('A user connected');

  // Handle WebSocket events
  socket.on('join', (conversationId) => {
    socket.join(conversationId);
    console.log(`User joined conversation ${conversationId}`);
  });
});

module.exports = router;
