var express = require('express');
var router = express.Router();
var db = require('../model/db');
const offre = require('../model/offreEmploi.js');
const fiche = require('../model/fichePoste.js');

router.get('/Accueil', function(req, res, next) {
  var role =  req.session.role ||'recruteur';  
  if (!role) {
    //role = 'candidat'
    //return res.redirect('/connexion'); // on verra plus tard
  }

  res.render('WelcomePage', { role: role });
});

router.get('/ajouterOffre', (req, res) => {

  const getFichesQuery = `
    SELECT 
      fp.Id,
      fp.Title,
      org.Name AS organisation
    FROM FichePoste fp
    JOIN Organisation org ON fp.Organisation = org.Siren
  `;

  db.query(getFichesQuery, (err, fiches) => {
    if (err) {
      console.error('Erreur MySQL:', err);
      return res.status(500).send("Erreur lors de la récupération des fiches");
    }


    res.render('Recruteur/PublierOffre', {
      mode: 'create',
      fiches: fiches,
      role: 'recruteur',
      defaultValues: {
        state: 'NotPublished',
        expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
                    .toISOString()
                    .split('T')[0]
      }
    });
  });
});

router.get('/modifierOffre/:id', (req, res) => {
  const offreId = req.params.id;

  const getOffreQuery = `
    SELECT 
      Id,
      FichePoste,
      State,
      DATE_FORMAT(ExpiryDate, '%Y-%m-%d') AS ExpiryDateFormatted,
      Details,
      Slots
    FROM OffreEmploi 
    WHERE Id = ?
  `;

  db.query(getOffreQuery, [offreId], (err, offreResults) => {
    if (err || offreResults.length === 0) {
      console.error('Erreur ou offre non trouvée:', err);
      return res.status(404).send("Offre non trouvée");
    }

    const offre = offreResults[0];

    const getFichesQuery = `
      SELECT 
        fp.Id,
        fp.Title, 
        org.Name AS organisation
      FROM FichePoste fp
      JOIN Organisation org ON fp.Organisation = org.Siren
    `;

    db.query(getFichesQuery, (err, fiches) => {
      if (err) {
        console.error('Erreur MySQL (fiches):', err);
        return res.status(500).send("Erreur lors de la récupération des fiches");
      }

      res.render('Recruteur/PublierOffre', {
        mode: 'edit',
        offre: {
          id: offre.Id,
          FichePoste: offre.FichePoste,
          State: offre.State,
          ExpiryDate: offre.ExpiryDateFormatted,
          Details: offre.Details,
          Slots: offre.Slots
        },
        fiches: fiches,
        role: 'recruteur'
      });
    });
  });
});


router.get('/ajouterFicheDePoste', function(req, res, next) {
  db.query('SELECT * FROM StatutPoste', (err, statuts) => {
    if (err) {
      console.error('Erreur lors de la récupération des statuts :', err);
      return res.status(500).send('Erreur serveur');
    }
    
    db.query('SELECT * FROM TypeMetier', (err, metiers) => {
      if (err) {
        console.error('Erreur lors de la récupération des métiers :', err);
        return res.status(500).send('Erreur serveur');
      }
      
      db.query('SELECT Siren, Name FROM Organisation', (err, organisations) => {
        if (err) {
          console.error('Erreur lors de la récupération des organisations :', err);
          return res.status(500).send('Erreur serveur');
        }
        
        res.render('Recruteur/PublierFichePoste', {
          mode: 'create',
          fiche: {}, 
          statuts: statuts,
          metiers: metiers,
          organisations: organisations,
          role: 'recruteur',
          title: 'Créer une fiche de poste'
        });
      });
    });
  });
});


router.get('/modifierFicheDePoste/:id', function(req, res, next) {
  const ficheId = req.params.id;
  
  db.query('SELECT * FROM FichePoste WHERE Id = ?', [ficheId], (err, fiches) => {
    if (err) {
      console.error('Erreur lors de la récupération de la fiche :', err);
      return res.status(500).send('Erreur serveur');
    }
    
    if (fiches.length === 0) {
      return res.status(404).send('Fiche de poste non trouvée');
    }
    
    const fiche = fiches[0];
    
    db.query('SELECT * FROM StatutPoste', (err, statuts) => {
      if (err) {
        console.error('Erreur lors de la récupération des statuts :', err);
        return res.status(500).send('Erreur serveur');
      }
      
      db.query('SELECT * FROM TypeMetier', (err, metiers) => {
        if (err) {
          console.error('Erreur lors de la récupération des métiers :', err);
          return res.status(500).send('Erreur serveur');
        }
        
        db.query('SELECT Siren, Name FROM Organisation', (err, organisations) => {
          if (err) {
            console.error('Erreur lors de la récupération des organisations :', err);
            return res.status(500).send('Erreur serveur');
          }
          
          res.render('Recruteur/PublierFichePoste', {
            mode: 'edit',
            fiche: fiche,
            statuts: statuts,
            metiers: metiers,
            organisations: organisations,
            role: 'recruteur',
            title: 'Modifier une fiche de poste'
          });
        });
      });
    });
  });
});

  router.get('/gererFicheDePoste', async (req, res) => {
      try { 
        const results = await fiche.readAll();
        const role = req.session?.role || 'recruteur';
    
        res.render('Recruteur/GererFicheDePoste', {
          fiches: results,
          role: role
        });
      }
      catch (err) {
        console.error('Erreur MySQL:', err);
        return res.status(500).send('Erreur lors de la récupération des fiches de poste');
      }
  });


  router.get('/gererOffres', async (req, res) => {
    try {
      const searchTerm = req.query.search || '';
      const page = parseInt(req.query.page) || 1;
      const limit = 9; 
      const offset = (page - 1) * limit;
  
      const results = await offre.readOffresFiltréPaginé(searchTerm, limit, offset);
      const countResult = await offre.nbTotalOffres(searchTerm);  
      const totalOffers = countResult[0] ? countResult[0].total : 0;
      const totalPages = Math.ceil(totalOffers / limit); 
  
      res.render('Recruteur/GererOffres', {
        role:"recruteur",
        offres: results,
        searchTerm: searchTerm,
        currentPage: page,
        totalPages: totalPages
        });
    } catch (err) {
      console.error('Erreur MySQL :', err);
      return res.status(500).send('Erreur lors de la récupération des offres');
    }
 
  });
  
  
  


  router.get('/privileges', (req, res) => {
    const userId = req.session.user || 111222333;
    
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
