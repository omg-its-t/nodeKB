// when bringing all these routes over from app.js
// we need to change app.xxxx to router.xxxx

const express = require('express');
const router = express.Router();

//bring in Article model
let Article = require('../models/article');
//bring in user model
let User = require('../models/users');

//add article route
router.get('/add', ensureAuthenticated, function(req, res){
  res.render('add_article',{
    title: 'Add Article'
  });
});

//submit POST route
router.post('/add', function(req, res){
  req.checkBody('title', 'Title is required').notEmpty();
  //no longer need, populating this from logged in user
  //req.checkBody('author', 'Author is required').notEmpty();
  req.checkBody('body', 'Body is required').notEmpty();

  //get errors, and if there are errors,
  //we will send them while rerendering the add adricle template
  let errors = req.validationErrors();
  if(errors){
    res.render('add_article', {
      title:'Add Article',
      errors:errors
    });
    //once input is valiudated we will add to db
  } else{
    //using the model we brought in (line 24)
    let article = new Article();
    article.title = req.body.title;
    //this will put the logged in users id as author
    article.author = req.user._id;
    article.body = req.body.body;

    article.save(function(err){
      if(err){
        console.log(err);
        return;
      }else{
        req.flash('success', 'Article Added');
        res.redirect('/');
      }
    });
  }
});


//get single article
router.get('/:id', function(req, res){
  Article.findById(req.params.id, function(err, article){
    //extra query to find the user id of the author and return the name
    User.findById(article.author, function(err, user){
      res.render('article',{
        article:article,
        //sending the article and author to article.pug
        author:user.name
      });
    });
  });
});

//edit single article
router.get('/edit/:id', ensureAuthenticated, function(req, res){
  Article.findById(req.params.id, function(err, article){
    if(article.author != req.user._id){
      req.flash('danger', "Not Authorized");
      return res.redirect('/');
    }else{
      res.render('edit_article',{
        title:'Edit Article',
        article:article
        });
      };
    });
  });

//update POST route (simular to add article route)
router.post('/edit/:id', function(req, res){
  let article = {};
  article.title = req.body.title;
  //article.author = req.body.author; removing from edit form, does not need to be edited.
  article.body = req.body.body;

  //need to specify what article to update
  let query = {_id:req.params.id}

  //using the model, hence the capital A
  //                    data
  Article.update(query, article, function(err){
    if(err){
      console.log(err);
      return;
    }else{
      req.flash('success', 'Article Updated');
      res.redirect('/');
    }
  });
});

//delete request
router.delete('/:id', function(req, res){
  //checks to make sure user is logged in be checking for an id
  if(!req.user._id){
    res.status(500).send();
  }

  let query = {_id:req.params.id}
  //checks to make sure the user making the request is the user who wrote it
  article.findById(req.params.id, function(err, article){
    if(article.author != req.user.id){
      res.status(500).send();
    } else {
      Article.remove(query, function(err){
        if(err){
          console.log(err);
        }
        res.send("Success");
      });
    }
  });
});

//access control
// we can add this function to any route to protect it
// add as second param after route and before function
function ensureAuthenticated(req, res, next){
  if(req.isAuthenticated()){
    return next();
  }else{
    req.flash('danger', "Please login first");
    res.redirect('/users/login');
  }
};
// so we can access the route from outside
module.exports = router;
