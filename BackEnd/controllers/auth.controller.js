const db = require('../models/user.model');
const jwt = require('jsonwebtoken');

const secretKey = 'MohamadSecureCode1999';

async function createUser(req, res) {
  const { username, email, password } = req.body;

  try {
    let profilePicture;
    if (req.file) {
      // If req.file is defined, use its buffer
      profilePicture = req.file.buffer;
    } else {
      // Handle the case where req.file is undefined
      console.log('No file uploaded');
      profilePicture = null; // or set a default value
    }

    // Try to create the user
    const userId = await db.createUser(
      username,
      email,
      password,
      profilePicture,
    );

    // If successful, generate a JWT token
    const user = { email: email };
    const profilePictureBuffer = user.profile_picture;
    const profilePictureBase64 = profilePictureBuffer.toString('base64');

    const token = jwt.sign(
      {
        userId: user.user_id,
        username: user.username,
        email: user.email,
        profilePicture: profilePictureBase64,
        // Add more user details as needed
      },
      secretKey,
    );
    // Respond with success
    res.status(201).json({ success: true, token });
  } catch (error) {
    console.error('Error creating user:', error);
    res
      .status(500)
      .json({ success: false, error: 'Failed to create a new user' });
  }
}

async function loginUser(req, res) {
  const { email, password } = req.body;
  console.log(req.body);
  try {
    // Step 2: Query the database to check if the user exists
    const user = await db.getUserByEmail(email);
    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    // Step 3: Check if the provided password matches the stored hashed password
    const passwordMatch = await db.comparePasswords(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    // Passwords match, generate a token and send a successful response

    // Retrieve the profile picture buffer from the request
    const profilePictureBuffer = user.profile_picture;
    const profilePictureBase64 = profilePictureBuffer.toString('base64');

    const token = jwt.sign(
      {
        userId: user.user_id,
        username: user.username,
        email: user.email,
        profilePicture: profilePictureBase64,
        // Add more user details as needed
      },
      secretKey,
    );
    console.log('logged In');
    res.status(200).json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

async function getUserFromEmail(req, res) {
  const { email } = req.body;

  try {
    // Step 2: Query the database to check if the user exists
    const user = await db.getUserByEmailWithoutPassword(email);

    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    // Retrieve the profile picture buffer from the request
    const profilePictureBuffer = user.profile_picture;

    const token = {
      userId: user.user_id,
      username: user.username,
      email: user.email,
      profilePicture: profilePictureBuffer,
      // Add more user details as needed
    };

    console.log('User Found!');
    res.status(200).json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
}
module.exports = {
  createUser,
  loginUser,
  getUserFromEmail,
};

/*
// Example on the client side to decode the token
const token = localStorage.getItem('token'); // Assuming you stored the token in local storage
const decodedToken = jwt_decode(token);
console.log(decodedToken.userId); // Access user details*/
