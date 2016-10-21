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
  	Creativity:String,
    Scientific: String,
    Thoroughness: String,
    Skill: String,
    SocialImpact: String,
    IndustrialImpact: String,
    improvement:String,
    remarks: String,
    reviewername:String
  }],
  passedBy:[String]
});


var Pdf = mongoose.model('Pdf',PdfSchema);
module.exports = Pdf;