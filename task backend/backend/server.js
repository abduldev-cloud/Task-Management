const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const authRoutes = require('./routes/auth');
const taskRoutes = require('./routes/tasks');

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);  
app.use('/api/tasks', require('./routes/tasks'));
app.use('/api/users', require('./routes/users'));
// app.use('/uploads/attachments', express.static('uploads/attachments'));
// app.use('/uploads', express.static('uploads'));
app.use('/uploads', express.static(path.join(__dirname, 'uploads/profile_pictures')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use("/api/notifications", require("./routes/notificationRoutes"));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
