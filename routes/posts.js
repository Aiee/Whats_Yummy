var express = require('express');
var router = express.Router();
var post = require('../models/post');
var middlewareObj = require('../middleware');

router.get('/', function (req, res) {
    res.render("landing");
  })

//Index - show all
router.get('/posts', function (req, res) {
    // console.log(req.user);
    post.find(function(err,allPosts){
        if(err)
            console.log(err);
        else{
            res.render("posts/index", {posts:allPosts, currentUser:req.user});
        }
    })
})

//CREATE - add new post
router.post('/posts', middlewareObj.isLoggedIn, function (req, res){
    var name = req.body.name;
    var url = req.body.image;
    var desc  = req.body.description;
    var tag = req.body.tag;
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    // create new post and save in db
    post.create(
        {name: name, image: url, description: desc, author: author, tags:tag},
        function(err, newlyAdded){
            if(err){
                console.log(err);
            }
            else{
                req.flash("success", "New post added successfully");
                console.log("new post added");
                console.log(newlyAdded);
                res.redirect("/posts");
            }
        }
    )
})

//show form to create new post
router.get('/posts/new', middlewareObj.isLoggedIn, function (req, res){
    res.render("posts/new");
})

//SHOW - show more info about one post
router.get('/posts/:id', function (req, res){
    //find post by id
    post.findById(req.params.id).populate("comments").exec(function(err, foundPost){
        if(err)
            console.log(err);
        else{
            //render show template with the post
            res.render("posts/show", {post: foundPost});
        }
    });
})

// EDIT post route
router.get('/posts/:id/edit', middlewareObj.checkPostingOwnership, function(req, res){
    post.findById(req.params.id, function(err, foundPost){
        if(err){
            console.log(err);
        } else{
            //render show template with the post
            res.render("posts/edit", {post: foundPost});
        }
    });
});

router.put('/posts/:id', middlewareObj.checkPostingOwnership, function (req, res){
    post.findByIdAndUpdate(req.params.id, req.body.post, function(err, updatedPost){
        if(err)
            console.log(err);
        else{
            req.flash("success", "Post has been edited successfully");
            res.redirect("/posts/"+req.params.id);
        }
    })
})

//DELETE post
router.delete('/posts/:id', middlewareObj.checkPostingOwnership, function (req, res){
    post.findByIdAndRemove(req.params.id, function(err){
        if(err)
            console.log(err);
        else{
            req.flash("success", "Post deleted successfully");
            console.log("post deleted");
            res.redirect("/posts");
        }
    })
})

module.exports = router;