const mongoose = require('mongoose');

let developerSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: {
        firstName: {
            type: String,
            required: true
        },
        lastName: String,
    },
    level: {
        type: String,
        required: true,
        uppercase: true,
        validate: {
            validator: function(newLevel){
                return newLevel === "BEGINNER" || newLevel === "EXPERT";
            },
            message: "Developer level should only be either Beginner or Expert"
        }
    },
    address: {
        state: String,
        suburb: String,
        street: String,
        unit: Number,
    }
});

module.exports = mongoose.model('Developer', developerSchema);