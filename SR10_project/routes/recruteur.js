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


router.get('/ajouterOffre', (req, res) => {
  const query = `
    SELECT 
      fp.Id,
      fp.Title,
      org.Name AS organisation
    FROM FichePoste fp
    LEFT JOIN Organisation org ON fp.Organisation = org.Siren
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error('Erreur MySQL :', err);
      return res.status(500).send("Erreur lors de la récupération des fiches de poste");
    }

    res.render('Recruteur/PublierOffre', {
      fiches: results,
      role : 'recruteur'
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
  
      const role = req.session?.role || 'recruteur';
  
      res.render('Recruteur/GererFicheDePoste', {
        fiches: results,
        role: role
      });
    });
  });


  router.get('/gererOffres', (req, res) => {
    const searchTerm = req.query.search || '';
    const page = parseInt(req.query.page) || 1;
    const limit = 9; 
    const offset = (page - 1) * limit;
  

    const query = `
      SELECT 
        o.Id AS id,
        o.State AS etat,
        o.ExpiryDate AS dateExpiration,
        o.Details AS details,
        o.Slots AS nombrePostes,
        fp.Title AS titre,
        fp.Supervisor AS superviseur,
        fp.Location AS localisation,
        fp.WorkSchedule AS horaire,
        fp.MinSalary AS minSalaire,
        fp.MaxSalary AS maxSalaire,
        fp.Description AS description,
        org.Name AS organisation,
        sp.Name AS statut,
        tm.Name AS typeMetier
      FROM OffreEmploi o
      LEFT JOIN FichePoste fp ON o.FichePoste = fp.Id
      LEFT JOIN Organisation org ON fp.Organisation = org.Siren
      LEFT JOIN StatutPoste sp ON fp.StatutPoste = sp.Name
      LEFT JOIN TypeMetier tm ON fp.Type = tm.Name
      WHERE fp.Title LIKE ? OR org.Name LIKE ?
      LIMIT ? OFFSET ?;
    `;
  
    db.query(query, [`%${searchTerm}%`, `%${searchTerm}%`, limit, offset], (err, results) => {
      if (err) {
        console.error('Erreur MySQL :', err);
        return res.status(500).send('Erreur lors de la récupération des offres');
      }
  
      const countQuery = `
        SELECT COUNT(*) AS total
        FROM OffreEmploi o
        LEFT JOIN FichePoste fp ON o.FichePoste = fp.Id
        LEFT JOIN Organisation org ON fp.Organisation = org.Siren
        WHERE fp.Title LIKE ? OR org.Name LIKE ?;
      `;
  

      db.query(countQuery, [`%${searchTerm}%`, `%${searchTerm}%`], (err, countResult) => {
        if (err) {
          console.error('Erreur MySQL :', err);
          return res.status(500).send('Erreur lors de la récupération du nombre total d\'offres');
        }
  
        const totalOffers = countResult[0] ? countResult[0].total : 0;
        const totalPages = Math.ceil(totalOffers / limit); 
  
        res.render('Recruteur/GererOffres', {
          role:"recruteur",
          offres: results,
          searchTerm: searchTerm,
          currentPage: page,
          totalPages: totalPages
        });
      });
    });
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
