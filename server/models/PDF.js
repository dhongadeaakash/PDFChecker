var mongoose = require('mongoose');
//pdf Schema
var PdfSchema = new mongoose.Schema({
  title:String,
  fieldname:String,
  originalname:String,
  encoding:String,
  mimetype:String,
  filename:String,
  path:String,
  desc:String,
  reviews:[{
  	reviewedBy:String,
  	review:String
  }],
  passedBy:[String]
});


var Pdf = mongoose.model('Pdf',PdfSchema);
module.exports = Pdf;