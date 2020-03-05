var express = require('express');
var router = express.Router();
var middlewareObj = require('../middleware');
var post = require('../models/post'),
    comment = require('../models/comment');

//NEW - crearte the form to submit new comments
router.get('/posts/:id/comments/new', middlewareObj.isLoggedIn, function (req, res){
    //find post by id
    post.findById(req.params.id, function(err, foundPost){
        if(err)
            console.log(err);
        else{
            //render show template with the post
            res.render("comments/new", {post: foundPost});
        }
    });
})

//CREATE - create new comment and link to post
router.post('/posts/:id/comments', middlewareObj.isLoggedIn, function (req, res){
    //find post by id
    post.findById(req.params.id, function(err, foundPost){
        if(err)
            console.log(err);
        else{
            comment.create(req.body.comment, function(err, newcomment){
                if(err)
                    console.log(err);
                else{
                    // add username and id to comment
                    console.log(req.user);
                    newcomment.author.id = req.user._id;
                    newcomment.author.username = req.user.username;
                    newcomment.save();
                    foundPost.comments.push(newcomment);
                    foundPost.save();
                    req.flash("success", "New comment added successfully");
                    res.redirect("/posts/" + foundPost._id);
                }
            })
        }
    });
})

//EDIT
router.get('/posts/:id/comments/:comment_id/edit', middlewareObj.checkCommentOwnership, function (req, res){
    comment.findById(req.params.comment_id, function(err, foundComment){
        if(err){
            console.log(err);
        }
        else{
            req.flash("success", "New comment added successfully");
            res.render("comments/edit",{post_id: req.params.id, comment: foundComment});
            // res.send("success");
        }
    });
});

// UPDATE
router.put('/posts/:id/comments/:comment_id', middlewareObj.checkCommentOwnership, function(req, res){
    comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, upadatedComment){
        if(err){
            console.log(err);
        }else{
            req.flash("success", "Comment has been edited successfully");
            res.redirect("/posts/"+req.params.id);
        }
    })
})

//DELETE
router.delete('/posts/:id/comments/:comment_id', middlewareObj.checkCommentOwnership, function (req, res){
    comment.findByIdAndRemove(req.params.comment_id, function(err){
        if(err)
            console.log(err);
        else{
            req.flash("success", "Comment has been deleted successfully");
            console.log("comment deleted");
            res.redirect("/posts/"+req.params.id);
        }
    })
})

module.exports = router;