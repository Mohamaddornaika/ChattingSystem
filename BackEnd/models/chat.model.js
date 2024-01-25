const db = require('./db.model.js');
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
async function getAllConversationsForUserWithDetails(userId) {
  const query = `
    SELECT
      c.conversation_id,
      c.user1_id,
      c.user2_id,
      u1.username AS user1_username,
      u1.profile_picture AS user1_profile_picture,
      u2.username AS user2_username,
      u2.profile_picture AS user2_profile_picture,
      m.message_id,
      m.sender_id,
      m.content,
      m.sent_at
    FROM
      conversations c
    JOIN
      users u1 ON c.user1_id = u1.user_id
    JOIN
      users u2 ON c.user2_id = u2.user_id
    LEFT JOIN (
      SELECT
        conversation_id,
        MAX(sent_at) AS max_sent_at
      FROM
        messages
      GROUP BY
        conversation_id
    ) AS recent_messages ON c.conversation_id = recent_messages.conversation_id
    LEFT JOIN
      messages m ON c.conversation_id = m.conversation_id AND recent_messages.max_sent_at = m.sent_at
    WHERE
      (c.user1_id = ? OR c.user2_id = ?)
    ORDER BY
      recent_messages.max_sent_at DESC;
  `;

  const [results] = await db.query(query, [userId, userId]);
  return results;
}
module.exports = {
  createConversation,
  getAllConversationsForUser,
  getAllConversationsForUserWithDetails,
};
