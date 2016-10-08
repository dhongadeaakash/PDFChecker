//Importing the express server module for our use
var express=require('express');	
//body parser is used with req variable
var bodyParser = require('body-parser')
//Initailize the express server





var app=express();

// set the view engine as jade and the Directory where all the files are stored.
app.set('views', __dirname + '/server/views');
app.set('view engine','jade');
//app.use is used to use middlewares
app.use(express.static('public')); //static route handling
app.use(bodyParser.json());// assuming POST: {"name":"foo","color":"red"} <-- JSON encoding
app.use(bodyParser.urlencoded({extended:true}));// assuming POST: name=foo&color=red <-- URL encoding

//Starting listening for requests
app.listen(8080);
console.log("Server started listening at port 8080")