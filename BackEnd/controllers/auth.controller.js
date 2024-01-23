const db = require('../models/user.model');
const jwt = require('jsonwebtoken');

const secretKey = 'MohamadSecureCode1999';

async function createUser(req, res) {
  const { username, email, password } = req.body;
  const profilePicture = req.file.buffer; // Assuming you're using multer or similar middleware for file uploads

  try {
    // Try to create the user
    await db.createUser(username, email, password, profilePicture);

    // If successful, generate a JWT token
    const user = { email: email };
    const token = jwt.sign(user, secretKey);

    // Respond with success
    res.status(201).json({ success: true, token });
  } catch (error) {
    console.error('Error creating user:', error);

    // Respond with error
    res
      .status(500)
      .json({ success: false, error: 'Failed to create a new user' });
  }
}

module.exports = {
  createUser,
};
