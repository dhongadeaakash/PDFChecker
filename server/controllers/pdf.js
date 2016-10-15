var Pdf = require('../models/Pdf');
var User = require('../models/User')

exports.postUploadPdf=function(req,res,next){
	var pdf= new Pdf({
			fieldname:req.file.fieldname,
			originalname:req.file.originalname,
			encoding:req.file.encoding,
			mimetype:req.file.mimetype,
			filename:req.file.filename,
			path:req.file.path,
			title:req.body.title,
			desc:req.body.desc
		});
	pdf.save(function(err,done){ 
              res.redirect('/');
            });


User.update({},{$push: {"notseen": pdf._id}}, {multi: true}, function(err) { 
console.log("PDF updated");
});
	

}

exports.postSubmitReview=function(req,res){
	console.log(req.params.id)
	console.log(req.body)

	Pdf.findByIdAndUpdate(req.params.id,{ $push:{
	"reviews":{
	"reviewedBy":req.user._id,
  	"Creativity":req.body.Creativity,
    "Scientific": req.body.Scientific,
    "Thoroughness":req.body.Thoroughness,
    "Skill":req.body.Skill ,
    "SocialImpact":req.body.SocialImpact,
    "IndustrialImpact":req.body.IndustrialImpact, 
    "improvement":req.body.improvement,
    "remarks":req.body.remarks

	}
	}
	},function(err,model){
		
		User.findByIdAndUpdate(req.user._id,{ $push:{"viewed":req.params.id},$pull:{"notseen":req.params.id}},function(err,model)
		{
			res.redirect('/')
		})


	})
}


exports.postIgnorePdf=function(req,res)
{
	Pdf.findByIdAndUpdate(req.params.id,{$push:{"passedBy":req.user._id}},function(err,model){

	User.findByIdAndUpdate(req.user._id,{ $push:{"ignored":req.params.id},$pull:{"notseen":req.params.id}},function(err,model)
		{
			res.redirect('/')
		})

	})
}