var Pdf = require('../models/PDF');
var User = require('../models/User')
var PDFDocument = require('pdfkit'); // add pdfkit module to access it
var path=require('path');
var fs=require('fs');

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
    "remarks":req.body.remarks,
    "reviewername":req.user.profile.name
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
exports.getGenerateReport=function(req,res)
{
	Pdf.findById(req.params.id,function(err,pdf){
		// User.find({'_id': { $in: pdf.invites}},function(err,events)
		// for review in pdf.re
		
		res.render('generatereport',{pdf:pdf})
		
	});
}

exports.getDeleteUser=function(req,res)
{
	// console.log(req.params.id)
	if(req.user)
	{
		if(req.user.type=='admin'){

		Pdf.remove({ _id:req.params.id }, function (err) {
            res.redirect('/');
        });
	}
	else
	{
		res.redirect('/')
	}
}

}
exports.getDownloadReport=function(req,res)
{
console.log("In download Report")
var lorem="\n\n\n\n\n\n"
var doc = new PDFDocument();

doc.pipe(res)




Pdf.find({"_id":req.params.id},function(err,pdf){


for(var i=0;i<pdf[0].reviews.length;i++)
{
	lorem=lorem+"Creativity:  "+ pdf[0].reviews[i].Creativity+" \n"+"Scientific:  "+ pdf[0].reviews[i].Scientific+" \n"+"Thoroughness:  "+ pdf[0].reviews[i].Thoroughness+" \n"+"Skill:  "+ pdf[0].reviews[i].Skill+" \n"+"SocialImpact:  "+ pdf[0].reviews[i].SocialImpact+" \n"+"IndustrialImpact:  "+ pdf[0].reviews[i].IndustrialImpact+" \n"+"improvement:  "+ pdf[0].reviews[i].improvement+" \n"+"remarks:  "+ pdf[0].reviews[i].remarks+" \n\n"
}
doc.fontSize(16).text("Pragati Abstract Reviews \n",100,30,{align:'center'}).font('Times-Roman', 30)
doc.fontSize(16).text(pdf[0].title+"\n\n\n\n\n\n",100,50,{align:'center'}).font('Times-Roman', 30)

doc.text('', 100, 30)
   .font('Times-Roman', 13)
   .moveDown()
   .text(lorem,{
     align: 'justify',
     indent: 30,
     ellipsis: true
   });

doc.end();
})





}


 // {$push: {"friends": newUser["_id"]}},