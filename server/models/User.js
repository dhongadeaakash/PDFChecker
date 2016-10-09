var mongoose = require('mongoose');
var bcrypt= require('bcrypt-nodejs');
// var eventSchema=Event.schema;



//User Schema
var userSchema = new mongoose.Schema({
  email: { type: String, unique: true, lowercase: true },
  password: String,
  tokens: Array,
  type:String,
  viewed:[String],
  ignored:[String],
  notseen:[String],
  profile: {  
    name: { type: String, default: '' },
  },

  resetPasswordToken: String,
  resetPasswordExpires: Date
});

/**
 * Password hash middleware.
 */
userSchema.pre('save', function(next) {
  var user = this;
  if (!user.isModified('password')) return next();
  bcrypt.genSalt(10, function(err, salt) {
    if (err) return next(err);
    bcrypt.hash(user.password, salt, null, function(err, hash) {
      if (err) return next(err);
      user.password = hash;
      next();
    });
  });
});

/**
 * Helper method for validating user's password.
 */
userSchema.methods.comparePassword = function(candidatePassword, cb) {

  bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
    if (err) return cb(err);
    cb(null, isMatch);
  });
};

// Compile Schema into a mongoose Model
var User = mongoose.model('User',userSchema);
module.exports = User;