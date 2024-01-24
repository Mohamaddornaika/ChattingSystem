const db = require('./db.model.js');
const userModel = require('./user.model.js');
async function createConversation(user1Id, user2Id) {
  if (!user1Id || !user2Id) {
    throw new Error('User not found');
  }

  const query = `
    INSERT INTO conversations (user1_id, user2_id)
    VALUES (?, ?)
  `;
  const [results] = await db.query(query, [user1Id, user2Id]);
  return results.insertId;
}
async function getAllConversationsForUser(userId) {
  const query = `
    SELECT * FROM conversations
    WHERE user1_id = ? OR user2_id = ?
  `;
  const [results] = await db.query(query, [userId, userId]);
  return results;
}

module.exports = {
  getAllConversationsForUser,
};
module.exports = {
  createConversation,
  getAllConversationsForUser,
};
