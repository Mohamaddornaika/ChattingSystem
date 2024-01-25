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
  upload.single('profile_picture'),
  authController.createUser,
);

router.post('/login', authController.loginUser);
router.get('/getUserFromEmail', verifyToken, authController.getUserFromEmail);

module.exports = router;
