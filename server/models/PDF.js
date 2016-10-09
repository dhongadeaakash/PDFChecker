var mongoose = require('mongoose');
//pdf Schema
var PdfSchema = new mongoose.Schema({
  name:String,
  location:String,
  reviewedBy:[String],
  passedBy:[String]
});


var Pdf = mongoose.model('Pdf',PdfSchema);
module.exports = Pdf;