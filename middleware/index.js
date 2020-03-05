var post = require('../models/post'),
    comment = require('../models/comment');
var middlewareObj = {};

middlewareObj.checkPostingOwnership = function(req, res, next){
    // is user logged in
    if(req.isAuthenticated()){
        post.findById(req.params.id, function(err, foundPost){
            if(err || !foundPost){
                req.flash("error", "Post not found");
                res.redirect("back");
                console.log(err);
            } else{
                //does user own the post
                if(foundPost.author.id.equals(req.user._id)){
                    next();
                }else{
                    req.flash("error", "Permission denied");
                    res.redirect("back");
                }
            }
        });
    } else{
        req.flash("error", "Please log in");
        res.redirect("back");
    }
}

middlewareObj.checkCommentOwnership = function(req, res, next){
    // is user logged in
    if(req.isAuthenticated()){
        comment.findById(req.params.comment_id, function(err, foundComment){
            if(err || !foundComment){
                req.flash("error", "Comment not found");
                res.redirect("back");
            } else{
                //does user own the post
                if(foundComment.author.id.equals(req.user._id)){
                    next();
                }else{
                    req.flash("error", "Permission denied");
                    res.redirect("back");
                }
            }
        });
    } else{
        req.flash("error", "Please log in");
        res.redirect("back");
    }
}

//check if a user logged in
middlewareObj.isLoggedIn = function (req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "Please log in");
    res.redirect("/login");
}

module.exports = middlewareObj;