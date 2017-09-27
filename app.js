var express = require('express');

var session = require('express-session');
var FileStore = require('session-file-store')(session);
var passport = require('passport');
var GithubStrategy = require('passport-github').Strategy;

var routes = require('./routes/index');
var auth = require('./routes/auth');

var users = require('./mock/users.json');
var userArray = Object.keys(users).map(function(value){ return users[value]; });

require('dotenv').config();

passport.use(new GithubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: process.env.APP_BASE_URL + "auth/github/return"
}, function(accessToken, refreshToken, profile, done){
    var user = {};
    userArray.forEach(function(item){
       if(item.email === profile.emails[0].value){ 
           user = item;
           return;
       }}); 
    
    done(null,user);
}));

passport.serializeUser(function(user, done){
    done(null, user.id);
});

passport.deserializeUser(function(userId, done){
    //Get user by id
    var user = {};
    userArray.forEach(function(item){
       if(item.id === userId){
           user = item;
           return;
       } 
    });
    done(null, user);
});

var app = express();

var sessionOptions = {
    store: new FileStore({}),
    secret: 'fozzy bear',
    saveUninitialized: true,
    resave: true
};
 
app.use(session(sessionOptions));
app.use(passport.initialize());
app.use(passport.session());

app.set('view engine','jade');
app.set('views',__dirname+'/views');

app.use('/', routes);
app.use('/auth', auth);

app.listen(process.env.PORT,function(){
    console.log("The frontend server is running on port "+process.env.PORT);
});

module.exports = app;