const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const postSchema = new Schema({
    content: { type: Schema.Types.String, required: true, },
    tourId: { type: Schema.Types.String, required: true, },
    createdBy: { type: Schema.Types.String, required: true, },
    createdOn: { type: Schema.Types.Date, default: Date.now, },
});

const Post = mongoose.model('Post', postSchema);
module.exports = Post;