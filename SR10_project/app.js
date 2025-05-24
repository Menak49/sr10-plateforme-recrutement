

//importation des modules 
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session'); 

// importation des routes
var indexRouter = require('./routes/index');

const rateLimit = require('express-rate-limit');

// Limite à 5 tentatives par heure par IP sur la route /LogIn
const loginLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // h minutes
  max: 5, // 5 tentatives max
  handler: (req, res) => {
    // Redirige vers la page de connexion avec un message d’erreur
    res.redirect('/LogIn?error=Trop%20de%20tentatives%20de%20connexion%2C%20réessayez%20plus%20tard.');
  },
  message: "Trop de tentatives de connexion, réessayez plus tard.",
  standardHeaders: true,
  legacyHeaders: false,
});



//création de l'application Express
var app = express();


app.post('/LogIn', loginLimiter);

//configuration de la session
app.use(session({
  secret: 'une string complexe qui sera utilise pour signé',   
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
app.use(express.urlencoded({ extended: false })); //pour requêtes post
app.use(cookieParser()); //analyse les cookies dans la requête HTTP
app.use(express.static(path.join(__dirname, 'public'))); 

//middleware de gestion des routes
//Ces middleware sont exécutés ssi la requête correspond à la route spécifiée
app.use('/', indexRouter);

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
