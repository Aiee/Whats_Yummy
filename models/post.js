
var mongoose = require('mongoose');

//mongo schema
var postSchema = new mongoose.Schema({
    name: String,
    image: String,
    tags: String,
    description: String,
    createdAt: { type: Date, default: Date.now },
    author: {
        id:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    },
    comments:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        }
    ]
});

//mongo collection
module.exports = mongoose.model("Post", postSchema);