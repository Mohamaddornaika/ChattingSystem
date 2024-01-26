const db = require('./db.model.js');

function createUser(username, email, password, profilePicture, callback) {
  const query = `INSERT INTO users (username, email, password, profile_picture) VALUES (?, ?, ?, ?)`;
  db.query(query, [username, email, password, profilePicture], callback);
}

// function updateProfilePicture(userId, profilePicture, callback) {
//   const query = `UPDATE users SET profile_picture = ? WHERE user_id = ?`;
//   db.query(query, [profilePicture, userId], callback);
// }
async function getUserByEmail(email) {
  const query =
    'SELECT user_id, username, email, password, profile_picture FROM users WHERE email = ?';
  const [results] = await db.query(query, [email]);
  console.log(email);
  return results[0] || null;
}
async function getUserIdByEmail(email) {
  const query = 'SELECT user_id FROM users WHERE email = ?';
  const [results] = await db.query(query, [email]);
  return results[0] || null;
}

async function comparePasswords(inputPassword, hashedPassword) {
  return inputPassword === hashedPassword;
}

async function getUserByEmailWithoutPassword(email) {
  const query =
    'SELECT user_id, username, email, profile_picture FROM users WHERE email = ?';
  const [results] = await db.query(query, [email]);
  return results[0] || null;
}
async function getUserByUserIdWithoutPassword(user_id) {
  const query =
    'SELECT user_id, username, email, profile_picture FROM users WHERE user_id = ?';
  const [results] = await db.query(query, [user_id]);
  return results[0] || null;
}
module.exports = {
  createUser,
  getUserByUserIdWithoutPassword,
  //   updateProfilePicture,
  getUserByEmail,
  comparePasswords,
  getUserByEmailWithoutPassword,
  getUserIdByEmail,
};
