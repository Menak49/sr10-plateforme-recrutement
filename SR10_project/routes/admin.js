var express = require('express');
var router = express.Router();
var db = require('../model/db');

const organisation = require('../model/organisation.js');
const utilisateur = require('../model/utilisateur.js');
const recruteur = require('../model/recruteurBecomeQuery.js')


router.get('/Accueil', function(req, res, next) {
    const userId = req.session.user?.phone ;//|| 223344556
  if (!userId) {
    return res.redirect('/LogIn');
  }
  
    res.render('WelcomePage', { role: 'admin', });
  });


router.get('/devenirRecruteur', async (req, res) => {
  try {
    const userId = req.session.user?.phone ;//|| 223344556
  if (!userId) {
    return res.redirect('/LogIn');
  }
    let results;
    results = await organisation.readAll();
    role = req.session.role || 'candidat';
    return res.render('Privileges/DevenirRecruteur', 
      {role: 'admin',
         organisations: results});
  }
  catch (err) {
    console.log(err);
    res.status(500).send("Erreur lors de la récupération des organisations (Contrôleur)");
  }
});


router.get('/privileges', (req, res) => {
  // Récupérer l'ID de l'utilisateur depuis la session
  const userId = req.session.user?.phone ;//|| 223344556
  if (!userId) {
    return res.redirect('/LogIn');
  }
  
  const role = req.session.role || 'admin';
  const pageTitle = 'Élévation de Privilèges';
  
  res.render('Privileges/Privileges', {
    role: 'admin',
    title: pageTitle,
    userId: userId
  });
});


router.get('/creerOrganisation', (req, res) => {
  const userId = req.session.user?.phone ;//|| 223344556
  if (!userId) {
    return res.redirect('/LogIn');
  }
  res.render('Privileges/creerOrga', {
    role: 'admin',
  });
});



router.get('/gestionUtilisateurs', async(req, res) => {
  try{
    const userId = req.session.user?.phone ;//|| 223344556
  if (!userId) {
    return res.redirect('/LogIn');
  }
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
        role: 'admin',
      };
    });
      
    const totalPages = Math.ceil(countResults / limit);
    
    res.render('Admin/gestionUtilisateurs', {
      role: 'admin',
      utilisateurs: utilisateurs,
      currentPage: page,
      totalPages: totalPages,
      searchTerm: searchTerm,
      
    });
  }
  catch (err) {
    console.log(err);
    res.status(500).send("Erreur lors de la récupération des utilisateurs (Contrôleur)");
  }
});



router.get('/GestionDemandeRecruteur', async (req, res) => {
  try{
const userId = req.session.user?.phone ;//|| 223344556
  if (!userId) {
    return res.redirect('/LogIn');
  }    const page = parseInt(req.query.page) || 1;
    const limit = 9; 
    const offset = (page - 1) * limit;
    const searchTerm = req.query.search || '';
          
    let results; 
    results = await recruteur.readAllFiltrePagine(searchTerm, limit, offset);
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
      role: 'admin',
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




router.get('/organisations', async(req, res) => {
  try{
    const userId = req.session.user?.phone ;//|| 223344556
  if (!userId) {
    return res.redirect('/LogIn');
  }
    const page = parseInt(req.query.page) || 1;
    const limit = 9;
    const offset = (page - 1) * limit;
    const searchTerm = req.query.search || '';
  
    let results;
    results = await organisation.readAllFiltréPaginé(searchTerm, limit, offset);
    let countResults;
    countResults = await organisation.count(searchTerm);
  
    const organisations = results.map(org => ({
      siren: org.Siren,
      nom: org.Nom,
      statut: org.Statut,
      localisation: org.Localisation,
      type: org.Type || 'Non spécifié'
    }));
  
    const totalPages = Math.ceil(countResults / limit);
  
    res.render('Admin/GestionOrganisation', {
      role: 'admin',
      organisations: organisations,
      currentPage: page,
      totalPages: totalPages,
      searchTerm: searchTerm
    });
  }
  catch (err) {
    console.log(err);
    res.status(500).send("Erreur lors de la récupération des organisations (Contrôleur)");
  }
  
});


module.exports = router;
