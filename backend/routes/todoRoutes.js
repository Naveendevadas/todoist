const express = require('express');
const router = express.Router();
const todoController = require('../controllers/todoController');
const verifyToken = require('../middleware/authmiddleware');

router.post('/', verifyToken, todoController.createTodos);
router.get('/', verifyToken, todoController.getAllTodos);
router.get('/:id', verifyToken, todoController.getSingleTodo);
router.put('/:id', verifyToken, todoController.editTodo);
router.delete('/:id', verifyToken, todoController.deleteTodo);
router.put('/complete/:id', verifyToken, todoController.completeTodo);

module.exports = router;