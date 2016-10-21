var Pdf = require('../models/Pdf');
var User = require('../models/User')
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

		 	// all.concat(notseenpdfs);
		 	// all.concat(reviewed);
		 	// all.concat(ignored);
		 
			res.render('main',{pdfs:notseenpdfs,reviewed:reviewed,ignored:ignored})

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