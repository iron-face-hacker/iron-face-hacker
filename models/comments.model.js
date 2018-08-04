const mongoose = require('mongoose');

const commentsSchema = mongoose.Schema({
    title: {
        type: String,
        required: 'Title is required'
    },
    text: {
        type: String,
        required: 'Text is required'
    },
    user: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    posts: {type: mongoose.Schema.Types.ObjectId, ref: 'Post'}

}, {timestamps: true});

const Comment = mongoose.model('Comment', commentsSchema);

module.exports = Comment;





