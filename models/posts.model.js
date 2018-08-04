const mongoose = require('mongoose');

const postsSchema = mongoose.Schema({
    title: {
        type: String,
        // maxlength: 100
    },
    text: {
        type: String,
        required: 'Your post is empty'
    },
    likes: Number,
    author: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User'
    }
}, { timestamps: true });

const Post = mongoose.model('Post', postsSchema);

module.exports = Post;





