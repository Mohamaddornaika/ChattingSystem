const jwt = require('jsonwebtoken');

const secretKey = 'MohamadSecureCode1999';

function verifyToken(req, res, next) {
  const authHeader = req.headers['authorization'];

  if (!authHeader) {
    return res.status(403).json({ error: 'No token provided' });
  }

  const tokenParts = authHeader.split(' ');

  if (tokenParts.length !== 2 || tokenParts[0] !== 'Bearer') {
    return res.status(403).json({ error: 'Invalid token format' });
  }

  const token = tokenParts[1]; // Get the token without the "Bearer" prefix

  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      console.log(err); // Log the error for debugging purposes
      return res.status(401).json({ error: 'Failed to authenticate token' });
    }

    // Store the decoded user information in the request for use in subsequent middleware or routes
    req.user = decoded;
    next();
  });
}

module.exports = verifyToken;
