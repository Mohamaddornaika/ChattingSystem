const chatModel = require('../models/chat.model');
const userModel = require('../models/user.model.js');
async function createConversation(req, res) {
  const { userID, otherEmail } = req.body;

  try {
    const otherUser = await userModel.getUserIdByEmail(otherEmail);
    const conversationId = await chatModel.createConversation(
      userID,
      otherUser.user_id,
    );
    res.status(201).json({ success: true, conversationId });
  } catch (error) {
    console.error('Error creating conversation:', error);
    res
      .status(500)
      .json({ success: false, error: 'Failed to create conversation' });
  }
}
async function getAllConversations(req, res) {
  const userId = req.params.userId;
  try {
    const conversations = await chatModel.getAllConversationsForUser(userId);

    res.status(200).json({ conversations });
  } catch (error) {
    console.error('An error occurred:', error);
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
async function getAllConversationsForUserWithDetails(req, res) {
  const userId = req.params.userId;
  try {
    const conversations = await chatModel.getAllConversationsForUserWithDetails(
      userId,
    );

    res.status(200).json({ conversations });
  } catch (error) {
    console.error('An error occurred:', error);
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
module.exports = {
  getAllConversationsForUserWithDetails,
  createConversation,
  getAllConversations,
};
