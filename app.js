//modules to bring in
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');

//using useNewUrlParser to avoid deprecation warning
mongoose.connect('mongodb://localhost/nodekb', { useNewUrlParser: true });
let db = mongoose.connection;

//check connection
db.once('open', function(){
  console.log('Connected to the DB');
});

//check for db errors
db.on('error', function(err){
  console.log(err);
});

//init app
const app = express();

//bring in models
let Article = require('./models/article');

//load pug view engine
//                      current dir    file name
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

//home route
app.get('/', function(req, res){
  //db query to get all articles
  Article.find({}, function(err, articles){
    if(err){
      console.log(err);
    }else{
      res.render('index', {
        title: 'Articles',
        //then passing query results to the view
        articles: articles
      });
    }
  });
});

//add article route
app.get('/articles/add', function(req, res){
  res.render('add_article',{
    title: 'Add Article'
  });
});


//server start
app.listen(3000, function(){
  console.log('Server running, ready for take off sir.');
});
