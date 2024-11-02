const mongoose = require('mongoose');
const User = require("./user.js");

const Schema = mongoose.Schema;
const aiSchema = new Schema({
  diagnosis: {
    type: String,
  },
  age: {
    type: Number,
  },
 gender: {
    type: String,
  },
  occupation: {
    type: String,
  },
  education:{
    type:String,
  },
  marit:{
    type:String,
  },
  author:{
    type: Schema.Types.ObjectId,
    ref:"User"
  }
});

const Aiuser = mongoose.model('Aiuser',  aiSchema);

module.exports = Aiuser;
