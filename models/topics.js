const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const Schema = mongoose.Schema;

let TopicsSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    slug: {
        type: String,
        lowercase: true,
        required: true
    }
});

module.exports = mongoose.model('topics', TopicsSchema);

