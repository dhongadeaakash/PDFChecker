exports.getIndex=function(req,res){
	if(!req.user){
	res.render('login')
	}
	else
	{
	res.render('main')
	}
}