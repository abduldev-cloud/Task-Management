const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const db = require('../models/db');
const { uploadProfilePicture } = require('../controllers/authController');
const multer = require('multer');
const path = require('path');

// Get all users
router.get('/', auth, async (req, res) => {
  try {
    const [users] = await db.query('SELECT id, name FROM users');
    res.json({ users });
  } catch (err) {
    console.error('[GetUsers ERROR]', err);
    res.status(500).json({ message: 'Error fetching users' });
  }
});


// Storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/profile_pictures/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

// Upload route
router.post('/:id/profile-picture', upload.single('profile_picture'), uploadProfilePicture);


module.exports = router;
