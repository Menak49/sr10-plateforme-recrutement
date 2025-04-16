// routes/candidat.js
const express = require('express');
const router = express.Router();
const db = require('../model/db');

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
  
      res.render('ParcourirOffre', { offres: results });
    });
  });



module.exports = router;
