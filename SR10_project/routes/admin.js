var express = require('express');
var router = express.Router();
var db = require('../model/db');

const organisation = require('../model/organisation.js');
const utilisateur = require('../model/utilisateur.js');
const recruteur = require('../model/recruteurBecomeQuery.js')


router.get('/Accueil', function(req, res, next) {
    var role =  req.session.role ||'admin';  
    if (!role) {
      //role = 'candidat'
      //return res.redirect('/connexion'); // on verra plus tard
    }
  
    res.render('WelcomePage', { role: role });
  });


router.get('/devenirRecruteur', async (req, res) => {
  try {
    let results;
    results = await organisation.readAll();
    role = req.session.role || 'candidat';
    return res.render('Privileges/DevenirRecruteur', {role: role, organisations: results});
  }
  catch (err) {
    console.log(err);
    res.status(500).send("Erreur lors de la récupération des organisations (Contrôleur)");
  }
});


router.get('/privileges', (req, res) => {
  // Récupérer l'ID de l'utilisateur depuis la session
  const userId = req.session.user || 1234567890;
  
  if (!userId) {
    return res.redirect('/login');
  }
  
  const role = req.session.role || 'admin';
  const pageTitle = 'Élévation de Privilèges';
  
  res.render('Privileges/Privileges', {
    role: role,
    title: pageTitle,
    userId: userId
  });
});


router.get('/creerOrganisation', (req, res) => {
  const role = req.session.role || 'recruteur';
  res.render('Privileges/creerOrga', {
    role: role
  });
});


router.get('/gestionUtilisateurs', async(req, res) => {
  try{
    const role = req.session.role || 'admin';
    const page = parseInt(req.query.page) || 1;
    const limit = 9;
    const offset = (page - 1) * limit;
    const searchTerm = req.query.search || '';
  
    let results;
    results = await utilisateur.readAllFiltréPaginé(searchTerm, limit, offset);
    let countResults;
    countResults = await utilisateur.count(searchTerm);
      
    const utilisateurs = results.map(user => {
      return {
        id: user.Phone,
        nom: `${user.LastName} ${user.FirstName}`,
        email: user.Email,
        status: user.Status,
        role: user.Role
      };
    });
      
    const totalPages = Math.ceil(countResults / limit);
    
    res.render('Admin/gestionUtilisateurs', {
      role: role,
      utilisateurs: utilisateurs,
      currentPage: page,
      totalPages: totalPages,
      searchTerm: searchTerm
    });
  }
  catch (err) {
    console.log(err);
    res.status(500).send("Erreur lors de la récupération des utilisateurs (Contrôleur)");
  }
});



router.get('/GestionDemandeRecruteur', async (req, res) => {
  try{
    const role = req.session.role || 'admin';
    const page = parseInt(req.query.page) || 1;
    const limit = 9; 
    const offset = (page - 1) * limit;
    const searchTerm = req.query.search || '';
          
    let results; 
    results = await recruteur.readAllFiltréPaginé(searchTerm, limit, offset);
    let countResults;
    countResults = await recruteur.count(searchTerm);

    const demandes = results.map(demande => {
      return {
        id: demande.Id,
        nom: `${demande.LastName} ${demande.FirstName}`,
        email: demande.Email,
        message: demande.Message,
        date: demande.FormattedDate,
        statut: demande.StatutDemande
      };
    });
      
    const totalPages = Math.ceil(countResults / limit);
    
    res.render('Admin/GestionDemandeRecruteur', {
      role: role,
      demandes: demandes,
      currentPage: page,
      totalPages: totalPages,
      searchTerm: searchTerm
    });
  }
  catch (err) {
    console.log(err);
    res.status(500).send("Erreur lors de la récupération des demandes de recruteur (Contrôleur)");
  }
  
});




router.get('/organisations', (req, res) => {
  const role = req.session.role || 'admin';
  const page = parseInt(req.query.page) || 1;
  const limit = 9;
  const offset = (page - 1) * limit;

  const searchTerm = req.query.search || '';
  const searchCondition = searchTerm
    ? `WHERE o.Name LIKE ? OR o.Headquarters LIKE ? OR o.Type LIKE ? OR o.Status LIKE ?`
    : '';

  const query = `
    SELECT
      o.Siren,
      o.Name AS Nom,
      o.Status AS Statut,
      o.Headquarters AS Localisation,
      o.Type
    FROM Organisation o
    ${searchCondition}
    ORDER BY o.Siren DESC
  `;

  const queryParams = searchTerm
    ? [`%${searchTerm}%`, `%${searchTerm}%`, `%${searchTerm}%`, `%${searchTerm}%`, limit, offset]
    : [limit, offset];

  const countQuery = `
    SELECT COUNT(*) AS total
    FROM Organisation o
    ${searchCondition}
  `;

  const countParams = searchTerm
    ? [`%${searchTerm}%`, `%${searchTerm}%`, `%${searchTerm}%`, `%${searchTerm}%`]
    : [];

  db.query(query, queryParams, (err, results) => {
    if (err) {
      console.error("Erreur MySQL (organisations) :", err);
      return res.status(500).send("Erreur serveur");
    }

    const organisations = results.map(org => ({
      siren: org.Siren,
      nom: org.Nom,
      statut: org.Statut,
      localisation: org.Localisation,
      type: org.Type || 'Non spécifié'
    }));

    db.query(countQuery, countParams, (countErr, countResults) => {
      if (countErr) {
        console.error("Erreur MySQL (comptage) :", countErr);
        return res.status(500).send("Erreur serveur");
      }

      const totalOrganisations = countResults[0].total;
      const totalPages = Math.ceil(totalOrganisations / limit);

      res.render('Admin/GestionOrganisation', {
        role: role,
        organisations: organisations,
        currentPage: page,
        totalPages: totalPages,
        searchTerm: searchTerm
      });
    });
  });
});
    




module.exports = router;
