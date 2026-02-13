const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const upload = require('../middleware/upload'); 
const taskController = require('../controllers/taskController');

// Routes
router.get('/', auth, taskController.getTasks);
router.post('/', auth, taskController.createTask);
router.delete('/:id', auth, taskController.deleteTask);
router.get('/admin/users-with-tasks', auth, taskController.getUsersWithTasks);
router.post('/tasks', auth, upload.single('attachment'), taskController.createTask);
router.put('/tasks/:id', auth, upload.single('attachment'), taskController.updateTask);

//  Only this one PUT route
router.put('/:id', auth, upload.single('attachment'), taskController.updateTask);

module.exports = router;
