var express = require('express');
var router = express.Router();
var db = require('../model/db');

router.get('/Accueil', function(req, res, next) {
  var role =  req.session.role ||'recruteur';  
  if (!role) {
    //role = 'candidat'
    //return res.redirect('/connexion'); // on verra plus tard
  }

  res.render('WelcomePage', { role: role });
});


router.get('/ajouterFicheDePoste', function(req, res, next) {
    res.render('Recruteur/PublierFichePoste', {role:'recruteur', title: 'Accueil', text: 'Bienvenue sur notre site de gestion des offres d\'emploi !' });
  });


  router.get('/gererFicheDePoste', (req, res) => {
    const query = `
      SELECT 
        fp.Id AS id,
        fp.Title AS titre,
        fp.Location AS localisation,
        fp.MinSalary AS minSalaire,
        fp.MaxSalary AS maxSalaire,
        fp.WorkSchedule AS horaire,
        fp.Description AS description,
        org.Name AS organisation,
        sp.Name AS statut,
        tm.Name AS typeMetier
      FROM FichePoste fp
      LEFT JOIN Organisation org ON fp.Organisation = org.Siren
      LEFT JOIN StatutPoste sp ON fp.StatutPoste = sp.Name
      LEFT JOIN TypeMetier tm ON fp.Type = tm.Name
    `;
  
    db.query(query, (err, results) => {
      if (err) {
        console.error('Erreur MySQL :', err);
        return res.status(500).send('Erreur lors de la récupération des fiches de poste');
      }
  
      const role = req.session?.role || 'candidat';
  
      res.render('Recruteur/GererFicheDePoste', {
        fiches: results,
        role: role
      });
    });
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
