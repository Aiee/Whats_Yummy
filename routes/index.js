var express = require('express');
var router = express.Router();
var passport = require('passport');
var User = require('../models/user');

//show register form
router.get("/register", function(req, res){
    res.render('register');
})
// handle sign up logic
router.post("/register", function(req, res){
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            //console.log(err.message);
            req.flash("error", err.message);
            //console.log(err);
            res.redirect("/register");
        }
        passport.authenticate("local")(req, res, function(){
            req.flash("success", "Welcome to What's Yummy!");
            res.redirect("/posts");
        })
    })
})
//show login form
router.get("/login", function(req, res){
    res.render("login", {massage: req.flash("error")});
})
//login logic
router.post("/login", passport.authenticate("local",
{
    successRedirect:"/posts",
    failureRedirect:"/login",
    failureFlash: true,
    successFlash: 'Welcome!' 
}), function(req,res){
})
//log out
router.get("/logout", function(req, res){
    req.logOut();
    req.flash("success", "Logged out successfully")
    console.log("loged out");
    res.redirect("/posts");
})

module.exports = router;