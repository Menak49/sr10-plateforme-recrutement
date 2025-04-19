// routes/candidat.js
const express = require('express');
const router = express.Router();
const db = require('../model/db');





router.get('/Accueil', function(req, res, next) {
  var role =  req.session.role ||'candidat';  
  if (!role) {
    //role = 'candidat'
    //return res.redirect('/connexion'); // on verra plus tard
  }

  res.render('WelcomePage', { role: role });
});


router.get('/parcourir', (req, res) => {
    const query = `
  SELECT 
    o.Id AS offre_id,
    f.Title AS titre,
    org.Name AS organisation,
    f.Location AS localisation,
    sp.Name AS contrat -- on suppose que StatutPoste = type de contrat
  FROM OffreEmploi o
  JOIN FichePoste f ON o.FichePoste = f.Id
  JOIN Organisation org ON f.Organisation = org.Siren
  LEFT JOIN StatutPoste sp ON f.StatutPoste = sp.Name
  WHERE o.State = 'Published'
`;
    db.query(query, (err, results) => {
      if (err) {
        console.error('Erreur MySQL : ', err);
        return res.status(500).send("Erreur lors de la récupération des offres");
      }
      role = req.session.role || 'candidat';
  
      res.render('Candidat/ParcourirOffre', {role:role, offres: results });
    });
  });


  router.get('/candidatures', (req, res) => {
    const userId = req.session.user || 223344556;
  
    const query = `
    SELECT 
      c.Id AS candidature_id,
      DATE_FORMAT(c.Date, '%d/%m/%Y') AS date_candidature,
      f.Title AS titre,
      org.Name AS organisation,
      f.Location AS localisation,
      sp.Name AS contrat,
      GROUP_CONCAT(pd.Name, '::', pd.Chemin SEPARATOR '||') AS pieces
    FROM Candidature c
    JOIN OffreEmploi o ON c.OffreEmploi = o.Id
    JOIN FichePoste f ON o.FichePoste = f.Id
    JOIN Organisation org ON f.Organisation = org.Siren
    LEFT JOIN StatutPoste sp ON f.StatutPoste = sp.Name
    LEFT JOIN CandidaturePieceDossier cpd ON c.Id = cpd.Candidature
    LEFT JOIN PieceDossier pd ON cpd.PieceDossier = pd.Id
    WHERE c.Candidat = ?
    GROUP BY c.Id, f.Title, org.Name, f.Location, sp.Name, c.Date
    ORDER BY c.Date DESC
  `;
  
    db.query(query, [userId], (err, results) => {
      if (err) {
        console.error("Erreur MySQL :", err);
        return res.status(500).send("Erreur serveur");
      }
      
  
      res.render('Candidat/Candidatures', {
        role: req.session.role || 'candidat',
        candidatures: results
      });
    });
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
