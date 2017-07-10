const mongoose = require('mongoose');

const usersSchema = new mongoose.Schema({
    name: { type: String, required: true },
    password: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    activities: [{
        activityName: { type: String, required: true },
        stats: [{
            date: { type: String, required: true },
            statAmount: { type: String, required: true }
        }]
    }]
});
 
const users = mongoose.model('Users', usersSchema);

module.exports = users;