const Schema = mongoose.Schema;
const mongoose = require('mongoose');

let CommentSchema = new Schema({
    body: {
        type: String,
        required: treu
    },
    belongs_to: {
        type: Schema.Types.ObjectId,
        required: true
    },
    created_at: {
        type: Number,
        default: new Date().getTime()
    },
    votes: {
        type: Number,
        default: 0
    },
    created_by: {
        type: String,
        required: true,
        default: 'rule1001'
    }
});

module.exports = mongoose.model('comments', CommentSchema);