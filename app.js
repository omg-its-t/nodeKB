//modules to bring in
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const session = require('express-session');
const flash = require('connect-flash');
const expressValidator = require('express-validator');



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
app.use(expressValidator());

//bring in models
let Article = require('./models/article');

//load pug view engine
//                      current dir    file name
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
//body-parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
//set public folder
app.use(express.static(path.join(__dirname, 'public')));
// parse application/json
app.use(bodyParser.json());


//express session middleware
app.use(session({
  secret: 'super secret squirrel',
  resave: true,
  saveUninitialized: true,
}));

//express messages middleware
app.use(require('connect-flash')());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

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

//server start
app.listen(3000, function(){
  console.log('Server running, ready for take off sir.');
});
