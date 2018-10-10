const mongoose = require('mongoose');

//user schema
let userSchema = mongoose.Schema({
  name:{
    type: String,
    required: true
  },
  email:{
    type: String,
    required: true
  },
  username:{
    type: String,
    required: true
  },
  password:{
    type: String,
    required: true
  },
});

//variable = model(name of model, schema)
let User = module.exports = mongoose.model("User", userSchema);
