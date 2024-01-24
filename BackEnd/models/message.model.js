const db = require('./db.model.js');

async function createMessage(conversationId, senderId, content) {
  const query = `
    INSERT INTO messages (conversation_id, sender_id, content)
    VALUES (?, ?, ?)
  `;
  const [results] = await db.query(query, [conversationId, senderId, content]);
  return results.insertId;
}

async function getMessagesForConversation(conversationId) {
  const query = `
    SELECT * FROM messages
    WHERE conversation_id = ?
    ORDER BY sent_at ASC
  `;
  const [results] = await db.query(query, [conversationId]);
  return results;
}

module.exports = {
  createMessage,
  getMessagesForConversation,
};
