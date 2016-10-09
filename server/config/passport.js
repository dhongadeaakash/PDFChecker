var User = require('../models/User');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

// var googleapis = require('googleapis');  




//When passport is created, this says what as to be stored with regards to the user
passport.serializeUser(function(user, done) {
  done(null, user.id);
});

//Invoked by passport.session
passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

/**
 * Sign in using Email and Password.
 */
passport.use(new LocalStrategy({usernameField:'email'},function(email, password, done) {
  email = email.toLowerCase();
  User.findOne({ email: email }, function(err, user) {
    if (!user) return done(null, false, { message: 'Email ' + email + ' not found'});
    user.comparePassword(password, function(err, isMatch) {
      if (isMatch) {
        return done(null, user);
      } else {
        return done(null, false, { message: 'Invalid email or password.' });
      
      }
    });
  });
}));


exports.isAuthenticated = function(req, res, next) {
if(req.isAuthenticated()) return next();
  res.redirect('/');
}
