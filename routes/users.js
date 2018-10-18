const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');

//bring in User model
let User = require('../models/users');

//GET to user registration form we don't need to
//say user/register because user is from the file name
router.get('/register', function(req, res){
  res.render('register',{
    title: 'Sign Up'
  });
});

//register process (submitting a post to this route)
router.post('/register', function(req,res){
  const name = req.body.name;
  const email = req.body.email;
  const username = req.body.username;
  const password = req.body.password;
  const password2 = req.body.password2;

  req.checkBody('name', 'Your name is required.').notEmpty();
  req.checkBody('email', 'Your email is required.').notEmpty();
  req.checkBody('email', 'Email must be a valid address.').isEmail();
  req.checkBody('username', 'A username is required.').notEmpty();
  req.checkBody('password', 'A password is required.').notEmpty();
  req.checkBody('password2', 'Passwords do not match!').equals(req.body.password);

  let errors = req.validationErrors();

  //if errors re-render template and pass along erros
  if (errors){
    res.render('register',{
      errors:errors
    });
  }
  //if no errors create user object, hash password and save to DB
  else{
    let newUser = new User({
      name:name,
      email:email,
      username:username,
      password:password,
    });

    bcrypt.genSalt(10, function(err, salt){
      bcrypt.hash(newUser.password, salt, function(err, hash){
        if (err){
          colsole.log(err);
        }
        newUser.password = hash;
        newUser.save(function(err){
          if(err){
            console.log(err);
            return;
          }
          else{
            req.flash('Success', 'You are now registered');
            res.redirect('/users/login');
          }
        });
      });
    });
  }
});

//login route
router.get('/login', function(req, res){
  res.render('login');
});


//login process
router.post('/login', function(req, res, next){
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/users/login',
    failureFlash: true
  })(req, res, next);
});

router.get('/logout', function(req, res){
  req.logout();
  req.flash('success', 'You are logged out');
  res.redirect('/users/login');
});

// so we can access the route from outside
module.exports = router;
