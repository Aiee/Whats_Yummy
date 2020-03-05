var express = require('express'),
    app = express(),
    request = require('request'),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    post = require('./models/post'),
    comment = require('./models/comment'),
    seedDB = require('./seed'),
    passport = require('passport'),
    LocalStrategy = require('passport-local'),
    methodOverride = require('method-override'),
    User = require('./models/user'),
    flash = require('connect-flash');

var commentRouters = require('./routes/comments'),
    postRouters = require('./routes/posts'),
    indexRouters = require('./routes/index'),
    feeling_luckyRouters =require('./routes/feeling_lucky');

mongoose.set('useUnifiedTopology', true);
mongoose.set('useFindAndModify', false);
mongoose.connect("mongodb://localhost/whats_yummy", {useNewUrlParser: true});

// seedDB();
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

// import css
app.use(express.static(__dirname + '/public'));

//flash msg
app.use(flash());

app.locals.moment = require('moment');

//Authentication config
app.use(require("express-session")({
    secret: "secret info",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//middleware auth
app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");

    next();
})

//Override method
app.use(methodOverride('_method'));

//import routers
app.use(postRouters);
app.use(commentRouters);
app.use(indexRouters);
app.use(feeling_luckyRouters);



app.listen(3000, function(){
    console.log("server started");
})