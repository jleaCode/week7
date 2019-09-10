const mongoose = require('mongoose');

let taskSchema = mongoose.Schema({
    taskID: mongoose.Schema.Types.ObjectId,
    taskName: String,
    taskAssign: String,
    taskDue: {
        type: Date,
        default: Date.now
    },
    taskStatus: {
        type: String,
        validate: {
            validator: function(newTaskStatus) {
                return newTaskStatus === "In Progress" || newTaskStatus === "Complete";
            },
            message: "Task status should only be either In Progress or Completed"
        }
    },
    taskDesc: String
});


module.exports = mongoose.model('Task', taskSchema);