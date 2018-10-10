const express = require('express');
const router = express.Router();

//bring in User model
let User = require('../models/users');

//GET to user registration form we don't need to
//say user/register because user is from the file name
router.get('/register', function(req, res){
  res.render('register',{
    title: 'Sign Up'
  });
});

// so we can access the route from outside
module.exports = router;
