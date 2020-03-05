var mongoose = require('mongoose'),
passportLocalMongoose = require('passport-local-mongoose');

//mongo schema
var UserSchema = new mongoose.Schema({
    username: String,
    password: String,
    posts: {
        id:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Post"
        },
    },
});

UserSchema.plugin(passportLocalMongoose);
//mongo collection
module.exports = mongoose.model("User", UserSchema);