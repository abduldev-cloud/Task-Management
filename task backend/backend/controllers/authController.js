const db = require('../models/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.getProfile = (req, res) => {
  const userId = req.user.id;

   db.query('SELECT id, name, email, role,profile_picture FROM users WHERE id = ?', [userId], (err, results) => {
    if (err) return res.status(500).json({ message: 'Database error', err });

    if (results.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const user = results[0];
    res.json(user); // 👈 Must include role
  });
};


exports.uploadProfilePicture = async (req, res) => {
  try {
    const userId = req.params.id;
    const profilePicPath = `${req.file.filename}`;

    await db.query('UPDATE users SET profile_picture = ? WHERE id = ?', [profilePicPath, userId]);

    res.json({ message: 'Profile picture updated', profile_picture: profilePicPath });
  } catch (err) {
    res.status(500).json({ error: 'Failed to upload profile picture' });
  }
};



exports.registerUser = async (req, res) => {
  const { name, email, password } = req.body;
  const hash = bcrypt.hashSync(password, 10);

  try 
  {
      const sql = 'INSERT INTO users (name, email, password) VALUES (?, ?, ?)';
      await db.query(sql, [name, email, hash]);
      res.json({ message: 'User registered successfully' });
  } 
  catch (err) 
  {
      if (err.code === 'ER_DUP_ENTRY') {
        return res.status(400).json({ message: 'Email already registered' });
      }
      console.error('[Register ERROR]', err);
      res.status(500).json({ message: 'Error registering user' });
  }
};




exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try 
  {
      const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);

    if (rows.length === 0) 
    {
        return res.status(401).json({ message: 'Invalid email or password' });
    }

    const user = rows[0];
    const match = bcrypt.compareSync(password, user.password);

    if (!match) 
    {
        return res.status(401).json({ message: 'Invalid email or password' });
    }


    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.json({ token });
  } 
  catch (err) 
    {
        console.error('[Login ERROR]', err);
        res.status(500).json({ message: 'Error logging in' });

    if (err.code === 'ER_DUP_ENTRY') 
      {
      return res.status(400).json({ message: 'Email already exists' });
    }
  }
  
  
};
