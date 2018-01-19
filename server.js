var express = require('express');
var passport = require('passport');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
var Strategy = require('passport-facebook').Strategy;
var db = require('./database');
var User = db.User;

var url = 'http://localhost:3000';
// var url = 'https://passporttest.herokuapp.com' || process.env.URL;

passport.use(new Strategy({
    clientID: 'FACEBOOK_CLIENT_ID' || process.env.CLIENT_ID,
    clientSecret: 'FACEBOOK_CLIENT_SECRET' || process.env.CLIENT_SECRET,
    callbackURL: url + '/login/facebook/return',
    passReqToCallback: true
  },
    function(req, accessToken, refreshToken, profile, done) {
      db.updateOrCreateUser({ fbId : profile.id, displayName: profile.displayName,  sessionID: req.sessionID }, function (err, user) {
        return done(err, user);
      });
    }
  ));

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id,function(err,user){
    done(err, user);
  });
});


var app = express();
app.use(express.static(__dirname + '/client/dist'));


app.use(require('cookie-parser')());
app.use(require('body-parser').urlencoded({ extended: true }));

app.use(session({
  secret: 'my little secret',
  resave: false,
  saveUninitialized: true,
  store: new MongoStore({mongooseConnection: mongoose.connection})
}));


app.use(passport.initialize());
app.use(passport.session());

app.get('/login/facebook',
  passport.authenticate('facebook'));

app.get('/login/facebook/return',
  passport.authenticate('facebook', { failureRedirect: '/' }),
  function(req, res) {
    res.redirect('/');
  });

app.get('/checkSession', (req, res) => {
  User.findOne({ sessionID: req.sessionID }, (err, user) => {
    if (user) {
      res.send(true);
    } else {
      res.send(false);
    }
  });
});

app.get('/logOut', (req, res) => {
  db.logout(req.sessionID, function() {
    res.send(false);
  });
});

var port = process.env.PORT || 3000;
app.listen(port);
