// routes/candidat.js
const express = require('express');
const router = express.Router();
const db = require('../model/db');
const offre = require('../model/offreEmploi.js');
const candidature = require('../model/candidature.js');
const utilisateur = require('../model/utilisateur.js');





router.get('/Accueil', function(req, res, next) {
  var role =  req.session.role ||'candidat';  
  if (!role) {
    //role = 'candidat'
    //return res.redirect('/connexion'); // on verra plus tard
  }

  res.render('WelcomePage', { role: role });
});



router.get('/parcourir', async (req, res) => {
  try {
    let results;
    results = await offre.readall();
    role = req.session.role || 'candidat';
    return res.render('Candidat/ParcourirOffre', {role:role, offres: results });
    }
  catch (err) {
    console.log(err);
    res.status(500).send("Erreur lors de la récupération des offres (Contrôleur)");
  }
});

router.get('/candidatures', async (req, res) => {
  try {
    const userId = req.session.user || 223344556;  
    let results;
    results = await candidature.getCandidaturesByUserId(userId);
    role = req.session.role || 'candidat';
    return res.render('Candidat/Candidatures', {role: req.session.role || 'candidat', candidatures: results});
  }
  catch (err) {
    console.log(err);
    res.status(500).send("Erreur lors de la récupération de vos candidatures (Contrôleur)");
  }
});






router.get('/privileges', (req, res) => {
  // Récupérer l'ID de l'utilisateur depuis la session
  const userId = req.session.user || 223344556;
  
  // Si l'utilisateur n'est pas connecté, rediriger vers la page de connexion
  if (!userId) {
    return res.redirect('/login');
  }
  
  const role = req.session.role || 'candidat';
  
  const pageTitle = 'Élévation de Privilèges';
  
  res.render('Privileges/Privileges', {
    role: role,
    title: pageTitle,
    userId: userId
  });
});

router.get('/devenirRecruteur', (req, res) => {
  const role = req.session.role || 'candidat';

  const query = `
    SELECT Siren, Name 
    FROM Organisation
    ORDER BY Name ASC
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error("Erreur MySQL :", err);
      return res.status(500).send("Erreur serveur");
    }

    res.render('Privileges/DevenirRecruteur', {
      role: role,
      organisations: results
    });
  });
});

router.get('/creerOrganisation', (req, res) => {
  const role = req.session.role || 'candidat';

  

    res.render('Privileges/creerOrga', {
      role: role
    });
  });

module.exports = router;
