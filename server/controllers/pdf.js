var Pdf = require('../models/PDF');
var User = require('../models/User')
var PDFDocument = require('pdfkit'); // add pdfkit module to access it
var path=require('path');
var fs=require('fs');
var blobStream = require('blob-stream')
var nodemailer=require('nodemailer');
var pdfjs=require('pdfjs')

exports.postUploadPdf=function(req,res,next){
	var pdf= new Pdf({
			fieldname:req.file.fieldname,
			originalname:req.file.originalname,
			encoding:req.file.encoding,
			mimetype:req.file.mimetype,
			filename:req.file.filename,
			path:req.file.path,
			title:req.body.title,
			desc:req.body.desc,
			email:req.body.email
		});
	pdf.save(function(err,done){ 
              res.redirect('/');
            });


User.update({},{$push: {"notseen": pdf._id}}, {multi: true}, function(err) { 
console.log("PDF updated");
});
	

}

exports.postSubmitReview=function(req,res){
	
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
	Pdf.find({"_id":req.params.id},function(err,pdfmain){


 	pdfjs.load('public/ARIALN.ttf', function(err, buf) {
    		if (err) throw err

   			 var fontArial = new pdfjs.TTFFont(buf)
    // ...
  				var doc = new pdfjs.Document({font: fontArial,padding:10})

 				 var tr, td, text
				//Table Header Details
				var header = doc.header()
				table = header.table()
				tr = table.tr()
				tr.td('Pragati Abstract Reviews',{fontSize:16,textAlign:'center'})
				tr = table.tr()
				tr.td(pdfmain[0].title,{fontSize:14,textAlign:'center'})
			

				var footer = doc.footer()
				footer.text("SFIT Ecell Pragati Abstract Reviews",{ textAlign: 'center' }).pageNumber().append('/').pageCount()

				// doc.image(assets.logo, { width: 128 }) // put logo later


				text = doc.text({
				  fontSize: 14, lineSpacing: 1.35
				})

				
				var lorem = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cum id fugiunt, re eadem quae Peripatetici, verba. Tenesne igitur, inquam, Hieronymus Rhodius quid dicat esse summum bonum, quo putet omnia referri oportere? Quia nec honesto quic quam honestius nec turpi turpius.'

// For Loop here

				pdfmain[0].reviews.forEach(function(r){
					

				table = doc.table({
				headerRows: 1, fontSize: 14,
				borderHorizontalWidth: 0.1,
				widths: ['17%', '17%', '17%', '17%', '17%','17%'],
				lineSpacing: 1.35
				})

				tr = table.tr({borderBottomWidth: 1.5 })

				tr.td('Creativity',{textAlign:'center'})
				tr.td('Scientific',{textAlign:'center'})
				tr.td('Thoroughness')
				tr.td('Skill',{textAlign:'center'})
				tr.td('Social Impact',{textAlign:'center'})
				tr.td('Industrial Impact',{textAlign:'center'})
				
				  tr = table.tr()
				  tr.td(r.Creativity,{textAlign:'center'})
					tr.td(r.Creativity,{textAlign:'center'})
					tr.td(r.Scientific,{textAlign:'center'})
					tr.td(r.Thoroughness,{textAlign:'center'})
					tr.td(r.Skill,{textAlign:'center'})
					tr.td(r.SocialImpact,{textAlign:'center'})
					tr.td(r.IndustrialImpact,{textAlign:'center'})
				tr=table.tr()
				tr.td("Improvements \n"+r.improvement,{colspan:7})
				tr=table.tr()
				tr.td("Remarks \n"+r.remarks,{colspan:7})

				doc.text("\n\n\n\n")

				});
				
				var pdf = doc.render()
				res.contentType("application/pdf");
				res.send(pdf.toString());

			        
});



});

}

// mailing configurations starts here

var transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'ecell@sfitengg.org', //new mail id made for the sake of project
        pass: 'Sfitecell@789' // by default emails will be sent from this id
    }
})



exports.getSendReport=function(req,res)
 {

	Pdf.find({"_id":req.params.id},function(err,pdfmain){


 	pdfjs.load('public/ARIALN.ttf', function(err, buf) {
    if (err) throw err

    var fontArial = new pdfjs.TTFFont(buf)
    // ...
  				var doc = new pdfjs.Document({font: fontArial,padding:10})

 				 var tr, td, text
				//Table Header Details
				var header = doc.header()
				table = header.table()
				tr = table.tr()
				tr.td('Pragati Abstract Reviews',{fontSize:16,textAlign:'center'})
				tr = table.tr()
				tr.td(pdfmain[0].title,{fontSize:14,textAlign:'center'})
			

				var footer = doc.footer()
				footer.text("SFIT Ecell Pragati Abstract Reviews",{ textAlign: 'center' }).pageNumber().append('/').pageCount()

				// doc.image(assets.logo, { width: 128 }) // put logo later


				text = doc.text({
				  fontSize: 14, lineSpacing: 1.35
				})

				
				var lorem = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cum id fugiunt, re eadem quae Peripatetici, verba. Tenesne igitur, inquam, Hieronymus Rhodius quid dicat esse summum bonum, quo putet omnia referri oportere? Quia nec honesto quic quam honestius nec turpi turpius.'

// For Loop here

				pdfmain[0].reviews.forEach(function(r){
					

				table = doc.table({
				headerRows: 1, fontSize: 14,
				borderHorizontalWidth: 0.1,
				widths: ['17%', '17%', '17%', '17%', '17%','17%'],
				lineSpacing: 1.35
				})

				tr = table.tr({borderBottomWidth: 1.5 })

				tr.td('Creativity',{textAlign:'center'})
				tr.td('Scientific',{textAlign:'center'})
				tr.td('Thoroughness')
				tr.td('Skill',{textAlign:'center'})
				tr.td('Social Impact',{textAlign:'center'})
				tr.td('Industrial Impact',{textAlign:'center'})
				
				  tr = table.tr()
				  tr.td(r.Creativity,{textAlign:'center'})
					tr.td(r.Creativity,{textAlign:'center'})
					tr.td(r.Scientific,{textAlign:'center'})
					tr.td(r.Thoroughness,{textAlign:'center'})
					tr.td(r.Skill,{textAlign:'center'})
					tr.td(r.SocialImpact,{textAlign:'center'})
					tr.td(r.IndustrialImpact,{textAlign:'center'})
				tr=table.tr()
				tr.td("Improvements \n"+r.improvement,{colspan:7})
				tr=table.tr()
				tr.td("Remarks \n"+r.remarks,{colspan:7})

				doc.text("\n\n\n\n")

				});

			
				





				var pdf = doc.render()

						 
			        	
		
			            var textMailBody = htmlMailBody = 'PFA attached review.';
			            var mailOptions = 
			            {
			                from: 'Team Pragati', // sender address 
			                to: pdfmain[0].email, // list of receivers 
			                subject: 'Pragati Abstract Review ', // Subject line 
			                text: textMailBody, // plaintext body alt for html 
			                html: htmlMailBody,
			                attachments:[
			                {

			                	filename:pdfmain[0].title+" Abstract Review",
			                	path: pdf.toDataURL()


			               	}]	
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
}
);	
}
exports.getRemoveIgnored=function(req,res){
	console.log(req.params.id)

	Pdf.findByIdAndUpdate(req.params.id,{$pull:{"passedBy":req.user._id}},function(err,model){

	User.findByIdAndUpdate(req.user._id,{ $pull:{"ignored":req.params.id},$push:{"notseen":req.params.id}},function(err,model)
		{
			res.redirect('/')
		})

	})



}
