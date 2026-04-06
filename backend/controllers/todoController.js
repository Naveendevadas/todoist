const Todo = require('../models/todo');

const updateStatus = (todo) => {
    const now = new Date();
    
    if (todo.status === "complete") return todo; 
    if (now < todo.startDate) {
        todo.status = "pending";
    } else if (now >= todo.startDate && now <= todo.dueDate) {
        todo.status = "open";
    } else if (now > todo.dueDate) {
        todo.status = "overdue";
    }
    return todo;
};

exports.createTodos = async (req, res) => {
    try {
        const { title, description, startDate, dueDate } = req.body;

        const newTodo = new Todo({
            title,
            description,
            startDate,
            dueDate,
            user: req.user.id
        });

        await newTodo.save();
        res.status(201).json({ message: "Todo created successfully", newTodo });

    } catch (error) {
        console.log("Error creating todo", error.message);
        res.status(500).json({ error: error.message });
    }
};

exports.getAllTodos = async (req, res) => {
    try {
        const { status } = req.query;

        let filter = { user: req.user.id };

        if (status && ["pending","open","overdue","complete"].includes(status)) {
            filter.status = status;
        }

        let todos = await Todo.find(filter).sort({ createdAt: -1 });
        
        todos = await Promise.all(
            todos.map(async (todo) => {
                const updatedTodo = updateStatus(todo);
                await updatedTodo.save();
                return updatedTodo;
            })
        );

        res.status(200).json(todos);

    } catch (error) {
        console.log("Error getting todos", error.message);
        res.status(500).json({ message: error.message });
    }
};

exports.getSingleTodo = async (req, res) => {
    try {
        const todo = await Todo.findOne({ _id: req.params.id, user: req.user.id });

        if (!todo) {
            return res.status(404).json({ message: "Todo not found" });
        }

        updateStatus(todo);
        await todo.save();

        res.status(200).json({ message: "Todo retrieved successfully", todo });

    } catch (error) {
        console.log("Error getting todo", error.message);
        res.status(500).json({ message: error.message });
    }
};

exports.editTodo = async (req, res) => {
    try {
        const todo = await Todo.findOneAndUpdate(
            { _id: req.params.id, user: req.user.id },
            req.body,
            { new: true }
        );

        if (!todo) {
            return res.status(404).json({ message: "Todo not found" });
        }

        updateStatus(todo);
        await todo.save();

        res.status(200).json({ message: "Todo updated successfully", todo });

    } catch (error) {
        console.log("Error editing todo", error.message);
        res.status(500).json({ message: error.message });
    }
};

exports.deleteTodo = async (req, res) => {
    try {
        const todo = await Todo.findOneAndDelete({ _id: req.params.id, user: req.user.id });

        if (!todo) {
            return res.status(404).json({ message: "Todo not found" });
        }

        res.status(200).json({ message: "Todo deleted successfully", todo });

    } catch (error) {
        console.log("Error deleting todo", error.message);
        res.status(500).json({ message: error.message });
    }
};

exports.completeTodo = async (req, res) => {
    try {
        const todo = await Todo.findOne({ _id: req.params.id, user: req.user.id });

        if (!todo) {
            return res.status(404).json({ message: "Todo not found" });
        }

        todo.status = "complete";
        await todo.save();

        res.status(200).json({ message: "Todo marked as complete", todo });

    } catch (error) {
        console.log("Error completing todo", error.message);
        res.status(500).json({ message: error.message });
    }
};