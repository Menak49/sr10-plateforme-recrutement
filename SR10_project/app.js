

//importation des modules
require('dotenv').config();
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session'); 

// importation des routes
var indexRouter = require('./routes/index');


//création de l'application Express
var app = express();




//configuration de la session
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,// ne pas forcer l'enregistrement
  cookie: { secure: false, httpOnly: true, maxAge: 1000*60*15 //durée de vie max de 15 min
   }, // true si HTTPS, false sinon
  name: 'sessionId', // nom du cookie de session
  saveUninitialized: true
}));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//ajoute de middleware layers (layers ajoutées à l'Express middleware stack)
//Each app.use(middleware) is called every time a request is sent to the server.
//pas de route spécifiée, ces layers seront exécutés pour chaque requête, quelque soit la route
app.use(logger('dev')); //enregistre les requêtes HTTP dans la console
app.use(express.json());//analyse le corps de la requête HTTP au format JSON
app.use(express.urlencoded({ extended: true })); //pour requêtes post
app.use(cookieParser()); //analyse les cookies dans la requête HTTP
app.use(express.static(path.join(__dirname, 'public'))); 

//middleware de gestion des routes
//Ces middleware sont exécutés ssi la requête correspond à la route spécifiée
app.use('/', indexRouter);

app.use('/uploads', express.static('uploads'));
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


//exportation de l'application Express
//pour lutiliser dans d'autres fichiers (comme www)
module.exports = app;
