var User = require('../models/User');
var Pdf = require('../models/PDF');
var passport=require('passport');
var bcrypt= require('bcrypt-nodejs');

exports.getSignup=function(req,res){
if(req.user){
	if(req.user.type!='admin')
	{
	res.render('signup')
	}
	else
	{
		res.redirect('/')
	}
}
else
{
  res.redirect('/')
  // res.render('signup')
}
}


exports.postSignUp = function(req,res){
        
var allpdfs=[]
  Pdf.find({},function(err,pdfs){

            

      var user = new User(
          {
            profile:{
              name:req.body.userName,
              picture:"defaultimg.png",
                },
                type:req.body.type,
            email:req.body.userEmail,
            password:req.body.userPassword});
            
            
          pdfs.forEach(function(pdf)
          {
            user.notseen.push(pdf._id)
          });

            user.save(function(err,done){ 
            res.redirect('/')

            });
        





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
exports.getAdminInit=function(req,res)
{

if(req.params.pass="qwertyuiop@1234567890"){
  console.log("Admin Initization.")
         var user = new User(
                {
                  profile:{
                    name:'admin',
                    picture:"defaultimg.png",
                      },
                  email:'aakashdhongade@sfitengg.org',
                  type:'admin',
                  password:'admin'});
                  // console.log(allpdfs)
                  user.save(function(err,done){ 
                  res.redirect('/')

                  });

}
else
{
console.log("password wrong cannot init.")
}
   
}

exports.getChangePassword=function(req,res)
{
res.render('changepassword')
}
exports.postChangePassword=function(req,res)
{


 bcrypt.compare(req.body.oldPassword,req.user.password,function(err, isMatch) {
    if (err) return cb(err);
  if(isMatch)
  {
    console.log("password is correct")

    bcrypt.genSalt(10, function(err, salt) {
    if (err) return next(err);
    bcrypt.hash(req.body.newPassword, salt, null, function(err, hash) {

      if (err) return next(err);
       User.findOneAndUpdate({"email":req.user.email},{"password":hash},function(err,user){
          res.redirect('/')

       });
        });
        });







  }
  else
  {
    console.log("password is False")
  }

  });




  
}