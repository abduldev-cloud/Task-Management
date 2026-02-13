const db = require('../models/db');
const multer = require('multer');
const path = require('path');
const nodemailer = require("nodemailer");


const storage = multer.diskStorage({
  destination: './uploads/attachments/',
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});


const upload = multer({ storage });

// Create a task
exports.createTask = async (req, res) => {
  const { title, description, assigned_to, status, due_date } = req.body;
  const created_by = req.user.id;
  const attachment = req.file ? req.file.filename : null;

  try {
    // Insert the task
    const [result] = await db.query(
      'INSERT INTO tasks (title, description, assigned_to, due_date, status, attachment, created_by) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [title, description, assigned_to, due_date, status, attachment, created_by]
    );

    const taskId = result.insertId;

    // Add notification
    await db.query(
      'INSERT INTO notifications (user_id, message, task_id) VALUES (?, ?, ?)',
      [assigned_to, `You have been assigned a new task: ${title}`, taskId]
    );

    // Send email notification
    const [user] = await db.query('SELECT email FROM users WHERE id = ?', [assigned_to]);
    if (user.length > 0) {
      const email = user[0].email;
      await sendEmail(
        email,
        'New Task Assigned',
        `
          <h3>Hello,</h3>
          <p>You have been assigned a new task: <strong>${title}</strong>.</p>
          <p><b>Due Date:</b> ${due_date}</p>
          <p>Please log in to the Task Manager to view more details.</p>
        `
      );
    }

    //  Success response
    res.json({ message: 'Task created and notification sent successfully' });
  } catch (err) {
    console.error('[CreateTask ERROR]', err);
    res.status(500).json({ message: 'Error creating task' });
  }
};



//  Get all tasks (with optional filters: status, assigned_to)
exports.getTasks = async (req, res) => {
  const userId = req.user.id;
  const userRole = req.user.role; // Assumes you have `role` in JWT
  const { status } = req.query;

  let sql = `
    SELECT t.*, 
           creator.name AS created_by_name, 
           assignee.name AS assigned_to_name
    FROM tasks t
    LEFT JOIN users AS creator ON t.created_by = creator.id
    LEFT JOIN users AS assignee ON t.assigned_to = assignee.id
    WHERE 1 = 1
  `;

  const params = [];

   //  If not admin, filter to only show tasks assigned to the user
  if (userRole !== 'admin') {
  sql += ' AND t.assigned_to = ?';
  params.push(userId);
}
  if (status) {
    sql += ' AND t.status = ?';
    params.push(status);
  }

  sql += ' ORDER BY t.created_at DESC';

  try {
    const [tasks] = await db.query(sql, params);
    res.json({ tasks });
  } catch (err) {
    console.error('[GetTasks ERROR]', err);
    res.status(500).json({ message: 'Error fetching tasks' });
  }
};



exports.updateTask = (req, res) => {
  const taskId = req.params.id;
  let { title, description, assigned_to, status, due_date } = req.body;

  if (due_date) {
    due_date = new Date(due_date).toISOString().slice(0, 10); // Format as 'YYYY-MM-DD'
  }

  // Auto-set completed date if status is "completed"
  const completed_date = status === 'completed' ? new Date() : null;

  // Check if file uploaded
  const attachment = req.file ? req.file.filename : null;

  // Build SQL update query dynamically
  let sql = `
    UPDATE tasks
    SET title = ?, description = ?, assigned_to = ?, status = ?, due_date = ?, completed_date = ?
  `;
  const params = [title, description, assigned_to, status, due_date, completed_date];

  if (attachment) {
    sql += `, attachment = ?`;
    params.push(attachment);
  }

  sql += ` WHERE id = ?`;
  params.push(taskId);

  db.query(sql, params, (err, result) => {
    if (err) {
      console.error('[Update Task ERROR]', err);
      return res.status(500).json({ message: 'Error updating task' });
    }
    res.json({ message: 'Task updated successfully' });
  });
};





//  Delete a task (only by the admin)
exports.deleteTask = (req, res) => {
  const taskId = req.params.id;
  const userId = req.user.id;

  const checkSql = 'SELECT created_by FROM tasks WHERE id = ?';
  db.query(checkSql, [taskId], (err, results) => {
    if (err || results.length === 0) {
      return res.status(404).json({ message: 'Task not found' });
    }

    if (results[0].created_by !== userId) {
      return res.status(403).json({ message: 'You are not authorized to delete this task' });
    }

    db.query('DELETE FROM tasks WHERE id = ?', [taskId], (err) => {
      if (err) {
        console.error('[DeleteTask ERROR]', err);
        return res.status(500).json({ message: 'Error deleting task' });
      }
      res.json({ message: 'Task deleted successfully' });
    });
  });
};





exports.getUsersWithTasks = async (req, res) => {
  try {
    const [usersResult] = await db.query('SELECT id, name, email FROM users WHERE role != "admin"');
    const [tasksResult] = await db.query('SELECT * FROM tasks');

    const users = usersResult;
    const tasks = tasksResult;

    const usersWithTasks = users.map(user => {
      const userTasks = tasks.filter(task => task.assigned_to === user.id);
      return { ...user, tasks: userTasks };
    });

    res.json(usersWithTasks);
  } catch (error) {
    console.error('Error fetching users with tasks:', error);
    res.status(500).json({ message: 'Server error' });
  }
};


// GET a task by ID
exports.getTaskById = (req, res) => {
  const taskId = req.params.id;

  const sql = 'SELECT * FROM tasks WHERE id = ?';
  db.query(sql, [taskId], (err, results) => {
    if (err) {
      console.error('[Get Task ERROR]', err);
      return res.status(500).json({ message: 'Error retrieving task' });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.json(results[0]);
  });
};


// Nodemailer setup function
async function sendEmail(to, subject, html) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "ah303130@gmail.com",
      pass: "btsv ekcm jult plrl", 
    },
  });

  await transporter.sendMail({
    from: '"Task Manager" <ah303130@gmail.com>',
    to,
    subject,
    html,
  });
}