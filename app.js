//modules to bring in
const express = require('express');
const path = require('path');

//init app
const app = express();

//load pug view engine
//                      current dir    file name
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');


app.get('/', function(req, res){
  res.render('index', {
    title: "Articles"
  });
});

//add article route
app.get('/articles/add', function(req, res){
  res.render('add_article',{
    title: "Add Article"
  });
});


//server start
app.listen(3000, function(){
  console.log('Server running, ready for take off sir.');
});
