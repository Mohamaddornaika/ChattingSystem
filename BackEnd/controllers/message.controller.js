const messageModel = require('../models/message.model');
const { io } = require('../middleware/socket');

async function createMessage(req, res) {
  const { conversationId, content } = req.body;
  const senderId = req.userId; // Get sender ID from the token

  try {
    const messageId = await messageModel.createMessage(
      conversationId,
      senderId,
      content,
    );

    // Emit the new message to the conversation's WebSocket room
    io.to(conversationId).emit('newMessage', { messageId, senderId, content });

    res.status(201).json({ messageId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

async function getMessagesForConversation(req, res) {
  const { conversationId } = req.params;

  try {
    const messages = await messageModel.getMessagesForConversation(
      conversationId,
    );

    // Sort messages by timestamp
    messages.sort((a, b) => a.sent_at - b.sent_at);

    res.status(200).json({ messages });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

module.exports = {
  createMessage,
  getMessagesForConversation,
};
