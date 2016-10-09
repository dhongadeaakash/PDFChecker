var User = require('../models/User');
var passport=require('passport');

exports.getSignup=function(req,res){
	if(req.user.type=='admin')
	{
	res.render('signup')
	}
	else
	{
		res.redirect('/')
	}
}


exports.postSignUp = function(req,res){
        var user = new User(
          {
            profile:{
              name:req.body.userName,
              picture:"defaultimg.png",
	              }, 
            email:req.body.userEmail,

            password:req.body.userPassword});
            user.save(function(err,done){ 
              res.redirect('/');
            });
	          
        
            
}

exports.postSignIn = function(req,res, next){
    passport.authenticate('local',function(err, user, info) {
      if (err) return next(err);
      if (!user) {
        console.log('errors at post signin ');
        return res.redirect('/');
      }
      req.logIn(user, function(err) {
        if (err) return next(err);
        console.log('Success! You are logged in.');
        res.redirect(req.session.returnTo || '/');
      });
    })(req, res, next);
}

exports.getSignOut = function(req,res, next){
  req.logout();
  res.redirect('/');
}
