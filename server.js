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
var morgan  = require('morgan');

var passportConf = require('./server/config/passport'); 



var homeController = require('./server/controllers/home');
var userController=require('./server/controllers/user')
var pdfController=require('./server/controllers/pdf')



var multer  = require('multer')
var done=false;



//Initailize the express server
var app=express();
app.use(morgan('combined'))

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



 mongoURL="mongodb://localhost:27017/SFITAbstracts"

//Mongoose Connection with MongoDB
mongoose.connect(mongoURL);
console.log('local mongodb opened');
// set the view engine as jade and the Directory where all the files are stored.

console.log(mongoURL)

app.use(session({
  resave: true,
  saveUninitialized: true,
  secret: 'Any secret to encrypt the session ',
  store: new MongoStore({ url: mongoURL, autoReconnect: true })
}));




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

app.use(function(err, req, res, next){
  console.error(err.stack);
  res.status(500).send('Something bad happened!');
});

 
app.listen(3000);
console.log('Server running on 3000');




// app.listen(3000);
// console.log("Server started listening at port 3000")