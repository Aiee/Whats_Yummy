var express = require('express');
var router = express.Router();
var passport = require('passport');
var User = require('../models/user');
var post = require('../models/post');
var middlewareObj = require('../middleware');


router.get("/feeling_lucky", function(req, res){
    res.render('feeling_lucky/index');
})

router.post("/feeling_lucky", function(req, res){
    post.find(function (err, found) 
    {
        if(err)
            console.log(err);
        else{
            var size = found.length;
            var random = Math.floor(Math.random() * size);
            // console.log(random);
            var link = found[random]._id;
            res.redirect("/posts/"+ link);
        }
    });


    // console.log(post.size());
    // res.render('feeling_lucky/index');
})

module.exports = router;