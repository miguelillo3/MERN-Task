const mongoose = require('mongoose');

const TasksSchema = mongoose.Schema({
    taskname: {
        type: String,
        require: true,
        trim: true
    },
    statusTask: {
        type: Boolean,
        default: false
    },
    createDate: {
        type: Date,
        default: Date.now()
    },
    projectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Projects'
    }
});

module.exports = mongoose.model('Tasks', TasksSchema);