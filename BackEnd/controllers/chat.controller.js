const chatModel = require('../models/chat.model');
const userModel = require('../models/user.model.js');
async function createConversation(req, res) {
  const { user1Id, user2Id } = req.body;
  console.log(user1Id, user2Id);
  try {
    //const otherUser = await userModel.getUserIdByEmail(otherEmail);
    const conversationId = await chatModel.createConversation(user1Id, user2Id);
    console.log('conversationId', conversationId);

    res.status(201).json({ success: true, conversationId });
  } catch (error) {
    console.error('Error creating conversation:', error);
    res
      .status(500)
      .json({ success: false, error: 'Failed to create conversation' });
  }
}
async function getAllConversationsFor2Users(req, res) {
  const user1Id = req.params.user1Id;
  const user2Id = req.params.user2Id;
  console.log(user2Id);
  try {
    const conversations = await chatModel.getAllConversationsFor2Users(
      user1Id,
      user2Id,
    );

    res.status(200).json({ conversations });
  } catch (error) {
    console.error('An error occurred:', error);
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
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
  getAllConversationsFor2Users,
};
