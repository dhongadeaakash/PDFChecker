var Pdf = require('../models/Pdf');
var User = require('../models/User')
var pdflist=[]
exports.getIndex=function(req,res){
	
	if(!req.user)
	{
	res.render('login')
	}
	else
	{
		
		 Pdf.find({'_id':{ $in: req.user.notseen}},function(err,pdf){
		 res.render('main',{pdfs:pdf})

		 });

					
		 			// Pdf.find({_id:user[0].notseen[i]},function(err,pdf){
		 			// 	for (var i=0;i<user[0].notseen.length;i++)
		 			// 	{
		 			// 		if(user[0].notseen[i]!=null)
		 			// 		{

								
		 			// 		}

		// 			// 	}		

				
					
		// 			// });
		// 		});
	}
}