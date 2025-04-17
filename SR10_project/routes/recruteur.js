var express = require('express');
var router = express.Router();



router.get('/Accueil', function(req, res, next) {
  var role =  req.session.role ||'recruteur';  
  if (!role) {
    //role = 'candidat'
    //return res.redirect('/connexion'); // on verra plus tard
  }

  res.render('WelcomePage', { role: role });
});




router.get('/PublierFichePoste', function(req, res, next) {
    res.render('Recruteur/PublierFichePoste', {role:'recruteur', title: 'Accueil', text: 'Bienvenue sur notre site de gestion des offres d\'emploi !' });
  });



  router.get('/privileges', (req, res) => {
    // Récupérer l'ID de l'utilisateur depuis la session
    const userId = req.session.user || 111222333;
    
    // Si l'utilisateur n'est pas connecté, rediriger vers la page de connexion
    if (!userId) {
      return res.redirect('/login');
    }
    
    const role = req.session.role || 'recruteur';
    
    const pageTitle = 'Élévation de Privilèges';
    
    res.render('Privileges', {
      role: role,
      title: pageTitle,
      userId: userId
    });
  });

module.exports = router;
