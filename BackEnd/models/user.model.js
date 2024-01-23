const db = require('./db.model.js');

function createUser(username, email, password, profilePicture, callback) {
  const query = `INSERT INTO users (username, email, password, profile_picture) VALUES (?, ?, ?, ?)`;
  db.query(query, [username, email, password, profilePicture], callback);
}

function updateProfilePicture(userId, profilePicture, callback) {
  const query = `UPDATE users SET profile_picture = ? WHERE user_id = ?`;
  db.query(query, [profilePicture, userId], callback);
}

module.exports = {
  createUser,
  updateProfilePicture,
};
