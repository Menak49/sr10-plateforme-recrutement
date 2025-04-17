var express = require('express');
var router = express.Router();
var db = require('../model/db');


router.get('/Accueil', function(req, res, next) {
    var role =  req.session.role ||'admin';  
    if (!role) {
      //role = 'candidat'
      //return res.redirect('/connexion'); // on verra plus tard
    }
  
    res.render('WelcomePage', { role: role });
  });

router.get('/privileges', (req, res) => {
    // Récupérer l'ID de l'utilisateur depuis la session
    const userId = req.session.user || 1234567890;
    
    // Si l'utilisateur n'est pas connecté, rediriger vers la page de connexion
    if (!userId) {
      return res.redirect('/login');
    }
    
    const role = req.session.role || 'admin';
    
    const pageTitle = 'Élévation de Privilèges';
    
    res.render('Privileges', {
      role: role,
      title: pageTitle,
      userId: userId
    });
  });


module.exports = router;
