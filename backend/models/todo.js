const mongoose = require('mongoose');

const todoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },

  description: {
    type: String,
    trim: true
  },

  startDate: {
    type: Date,
    required: true
  },

  dueDate: {
    type: Date,
    required: true
  },

  status: {
    type: String,
    enum: ["pending", "open", "overdue", "complete"],
    default: "pending"
  },

  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  createdAt: {
    type: Date,
    default: Date.now
  },

  updatedAt: {
    type: Date,
    default: Date.now
  }

});

module.exports = mongoose.model('Todo', todoSchema);