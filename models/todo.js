const mongoose = require("mongoose");

const todoSchema = new mongoose.Schema({
  tasks: [
    {
      taskId: { type: mongoose.Schema.Types.ObjectId, auto: true },
      description: { type: String, required: true },
      assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      completed: { type: Boolean, default: false },
      createdAt: { type: Date, default: Date.now },
      dueDate: { type: Date },
    },
  ],
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  roomId: { type: mongoose.Schema.Types.ObjectId, ref: "Room" },
});

module.exports = mongoose.model("Todo", todoSchema);
