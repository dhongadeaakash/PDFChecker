var Pdf = require('../models/PDF');
var User = require('../models/User')
var nodemailer=require('nodemailer');
var bcrypt= require('bcrypt-nodejs');
var pdflist=[]
exports.getIndex=function(req,res){
	
	if(!req.user)
	{
	res.render('login')
	}
	else
	{   	var notseenpdfs=[]
		 	var reviewed=[]
		 	var ignored=[]
		 	var all=[]
		// sending only not seen
		 
		 

		 Pdf.find({},function(err,allpdfs){
		 	

		 	allpdfs.forEach(function(pdf){
		 		// console.log(typeof req.user.viewed)
		 		var index=req.user.viewed.indexOf(pdf._id)
		 		
		 		if(index!=-1)
		 		{	
		 			reviewed.push(pdf)
		 		}

		 		var index=req.user.notseen.indexOf(pdf._id)
		 		
		 		if(index!=-1)
		 		{	
		 			notseenpdfs.push(pdf)
		 		}

		 		var index=req.user.ignored.indexOf(pdf._id)
		 		if(index!=-1)
		 		{	
		 			ignored.push(pdf)
		 		}


		 	});
		 
			res.render('main',{pdfs:notseenpdfs,reviewed:reviewed,ignored:ignored})

		 });
	}
}

var transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'ecell@sfitengg.org', //new mail id made for the sake of project
        pass: 'Sfitecell@789' // by default emails will be sent from this id
    }
})


exports.postForgotPass=function(req,res)
{

bcrypt.genSalt(10, function(err, salt) {
    if (err) return next(err);
    bcrypt.hash("Pragati@123", salt, null, function(err, hash) {
      if (err) return next(err);


						User.findOneAndUpdate({"email":req.body.email},{"password":hash},function(err,user){
							var textMailBody = htmlMailBody = 'Your Password has been set to Pragati@123';
				            var mailOptions = 
				            {
				                from: 'Team Pragati', // sender address 
				                to: 'ecell@sfitengg.org', // list of receivers 
				                subject: 'Pragati Abstract Review ', // Subject line 
				                text: textMailBody, // plaintext body alt for html 
				                html: htmlMailBody
				            };

				            // send mail with defined transport object 
				            transporter.sendMail(mailOptions, function(error, info){
				                if(error){
				                    return console.log(error);
				                }
				                console.log('Message sent: ' + info.response);
				                // fs.unlinkSync(req.params.id+'.pdf')
				            });
				            	res.redirect('/')
			            

});
 });
});

}
