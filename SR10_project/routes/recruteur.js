var express = require('express');
var router = express.Router();


router.get('/PublierFichePoste', function(req, res, next) {
    res.render('Recruteur/PublierFichePoste', {role:'recruteur', title: 'Accueil', text: 'Bienvenue sur notre site de gestion des offres d\'emploi !' });
  });

module.exports = router;
