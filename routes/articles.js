const express = require('express');
const router = express.router();

// when bringing all these routes over from app.js
// we need to change app.xxxx to router.xxxx


//add article route
router.get('/articles/add', function(req, res){
  res.render('add_article',{
    title: 'Add Article'
  });
});

//submit POST route
router.post('/articles/add', function(req, res){
  req.checkBody('title', 'Title is required').notEmpty();
  req.checkBody('author', 'Author is required').notEmpty();
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
    article.author = req.body.author;
    article.body = req.body.body;

    article.save(function(err){
      if(err){
        res.redirect('/error',{
        });
      }else{
        req.flash('success', 'Article Added');
        res.redirect('/');
      }
    });
  }
});


//get single article
router.get('/article/:id', function(req, res){
  Article.findById(req.params.id, function(err, article){
    res.render('article',{
      article:article
    });
  });
});

//edit single article
router.get('/article/edit/:id', function(req, res){
  Article.findById(req.params.id, function(err, article){
    res.render('edit_article',{
      title:'Edit Article',
      article:article
    });
  });
});

//update POST route (simular to add article route)
router.post('/articles/edit/:id', function(req, res){
  let article = {};
  article.title = req.body.title;
  article.author = req.body.author;
  article.body = req.body.body;

  //need to specify what article to update
  let query = {_id:req.params.id}

  //using the model, hence the capital A
  //                    data
  Article.update(query, article, function(err){
    if(err){
      res.redirect('/error',{
      });
    }else{
      req.flash('success', 'Article Updated');
      res.redirect('/');
    }
  });
});

//delete request
router.delete('/article/:id', function(req, res){
  let query = {_id:req.params.id}

  Article.remove(query, function(err){
    if(err){
      console.log(err);
    }
    res.send("Success");
  });
});
