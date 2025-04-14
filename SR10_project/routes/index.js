var express = require('express');
var router = express.Router();



router.get('/Accueil', function(req, res, next) {
  var role = req.session.role;  
  if (!role) {
    role = 'admin'
    //return res.redirect('/connexion'); // Redirige vers la page de connexion si l'utilisateur n'est pas connecté
  }

  // Passer le rôle à la vue
  res.render('WelcomePage', { role: role });
});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Accueil', text: 'Bienvenue sur notre site de gestion des offres d\'emploi !' });
});

module.exports = router;
