const express = require('express');
const router = express.Router();
const { registerUser, loginUser } = require('../controllers/authController');
const auth = require('../middleware/authMiddleware');
const db = require('../models/db');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const authMiddleware = require('../middleware/authMiddleware');

const uploadDir = 'uploads/profile';


router.post('/register', registerUser);
router.post('/login', loginUser);


if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const name = `${Date.now()}-${Math.round(Math.random() * 1E9)}${ext}`;
    cb(null, name);
  }
});
const upload = multer({ storage });

// Upload profile route
router.put('/upload-profile-picture', authMiddleware, upload.single('profilePicture'), async (req, res) => {
  const filename = req.file.filename;
  const userId = req.user.id;

    console.log('Uploading profile for user:', userId);
  console.log('Saved as filename:', filename);

  try {
    // Save filename to DB
    await db.query('UPDATE users SET profile_picture = ? WHERE id = ?', [filename, userId]);
    res.json({ message: 'Profile picture uploaded', filename });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});





router.get('/me', auth, async (req, res) => {

  
  try {
    const [rows] = await db.query('SELECT id, name, email,role,profile_picture FROM users WHERE id = ?', [req.user.id]);

    if (rows.length === 0) return res.status(404).json({ message: 'User not found' });

    res.json(rows[0]);
  } catch (err) {
    console.error('[GET /me ERROR]', err);
    res.status(500).json({ message: 'Error fetching user' });
  }
});

module.exports = router;

