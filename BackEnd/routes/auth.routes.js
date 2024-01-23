const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const dataValidation = require('../middleware/postValidation');
const verifyToken = require('../middleware/verifyToken');
const multer = require('multer');

const storage = multer.memoryStorage(); // Store file in memory as a Buffer
const upload = multer({ storage: storage });
router.post(
  '/register',
  verifyToken,
  upload.single('profile_picture'),
  authController.createUser,
);

module.exports = router;
