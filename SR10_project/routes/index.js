var express = require('express');
var router = express.Router();

var WelcomePagerouter = require('./WelcomePage');
var candidatRouter = require('./candidat');
var adminRouter = require('./admin');
var recruteurRouter = require('./recruteur');

router.use('/Accueil', WelcomePagerouter);
router.use('/candidat', candidatRouter);
router.use('/recruteur', recruteurRouter);
router.use('/admin', adminRouter);


/* GET home page. */
router.get('/', function(req, res, next) {
  //appelle la fonction readall() dans /model/utilisateur.js pour récupérer les utilisateurs
  //puis les affiche dans la vue usersList.ejs


});

router.get('/SignUp', function(req, res, next) {
  res.render('SignUp', { title: 'Accueil', text: 'Bienvenue sur notre site de gestion des offres d\'emploi !' });
});

router.get('/LogIn', function(req, res, next) {
  res.render('LogIn', { title: 'Accueil', text: 'Bienvenue sur notre site de gestion des offres d\'emploi !' });
});


module.exports = router;
