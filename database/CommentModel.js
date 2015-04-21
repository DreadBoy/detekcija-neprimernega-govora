var mongoose = require('mongoose'),
    commentSchema = rekuire('database/CommentSchema.js');

module.exports = mongoose.model('Comment', commentSchema, "korpus-comments");