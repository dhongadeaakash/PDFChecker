//Importing the express server module for our use
var express=require('express');	
//body parser is used with req variable
var bodyParser = require('body-parser')
// mangoose is middle ware
var mongoose = require('mongoose');
//passport for verification
var passport=require('passport');
var session=require('express-session');
var MongoStore=require('connect-mongo')(session);

var passportConf = require('./server/config/passport'); 



var homeController = require('./server/controllers/home');
var userController=require('./server/controllers/user')
var pdfController=require('./server/controllers/pdf')



var multer  = require('multer')
var done=false;

var server_port = process.env.OPENSHIFT_NODEJS_PORT || 8080
var server_ip_address = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1'



//Initailize the express server
var app=express();

var multer  = require('multer');
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads')
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
  }
});

var upload = multer({ storage: storage })
var type = upload.single('userPDF')

var db_name='SFITabstracts'

//provide a sensible default for local development
mongodb_connection_string = 'mongodb://127.0.0.1:27017/' + db_name;
//take advantage of openshift env vars when available:
if(process.env.OPENSHIFT_MONGODB_DB_URL){
  mongodb_connection_string = process.env.OPENSHIFT_MONGODB_DB_URL + db_name;
}

app.use(session({
  resave: true,
  saveUninitialized: true,
  secret: 'Any secret to encrypt the session ',
  store: new MongoStore({ url: mongodb_connection_string, autoReconnect: true })
}));






//Mongoose Connection with MongoDB
mongoose.connect(mongodb_connection_string);
console.log('local mongodb opened');
// set the view engine as jade and the Directory where all the files are stored.
app.set('views', __dirname + '/server/views');
app.set('view engine','jade');
//app.use is used to use middlewares
app.use(express.static('public')); //static route handling
app.use(bodyParser.json());// assuming POST: {"name":"foo","color":"red"} <-- JSON encoding
app.use(bodyParser.urlencoded({extended:true}));// assuming POST: name=foo&color=red <-- URL encoding



app.use(passport.initialize());
app.use(passport.session());
app.use(function(req, res, next) {
  res.locals.user = req.user;
  next();
});
// all routes.

app.get('/',homeController.getIndex);
app.get('/signout',userController.getSignOut)
app.get('/signup',userController.getSignup)
app.post('/adduser',userController.postSignUp)	
app.post('/login',userController.postSignIn)
app.post('/submitreview/:id',pdfController.postSubmitReview)
app.post('/uploadpdf', type,pdfController.postUploadPdf)
app.post('/ignore/:id',pdfController.postIgnorePdf)
app.get('/admininit/:pass',userController.getAdminInit)
app.get('/generatereport/:id',pdfController.getGenerateReport)
app.get('/deletepdf/:id',pdfController.getDeleteUser)
app.get('/downloadreport/:id',pdfController.getDownloadReport)
//Starting listening for requests


 
app.listen(server_port, server_ip_address, function () {
  console.log( "Listening on " + server_ip_address + ", port " + server_port )
});



// app.listen(3000);
// console.log("Server started listening at port 3000")