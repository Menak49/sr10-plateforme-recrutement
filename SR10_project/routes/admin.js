var express = require('express');
var router = express.Router();
var db = require('../model/db');

const organisation = require('../model/organisation.js');
const utilisateur = require('../model/utilisateur.js');
const recruteur = require('../model/recruteurBecomeQuery.js');
const typeOrganisation = require('../model/typeOrganisation.js');
const admin = require('../model/adminBecomeQuery.js');

router.get('/Accueil', function(req, res, next) {
    const userId = req.session.user?.phone ;//|| 223344556
  if (!userId) {
    return res.redirect('/LogIn');
  }
  
    res.render('WelcomePage', {
      userId: userId,
      role:'admin',
      roles:req.session.user?.roles || []  });
});



///////////////////////// GESTION DES UTILISATEURS //////////////////////////////////////

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


router.post('/delete-user/:id', async (req, res) => {
  const userId = req.params.id;
  try {
    await organisation.setCreatorNull(userId);
    await utilisateur.deleteUser(userId); 
    res.redirect('/admin/gestionUtilisateurs');
  } catch (err) {
    console.error('Erreur lors de la suppression de l\'utilisateur :', err);
    res.status(500).send('Erreur lors de la suppression de l\'utilisateur');
  }
});



////////////////////////// GESTION DES DEMANDES ////////////////////////////////////


/*
router.get('/GestionDemande', async (req, res) => {
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
});*/


router.get('/GestionDemandes', async (req, res) => {
  try {
    const userId = req.session.user?.phone;
    if (!userId) {
      return res.redirect('/LogIn');
    }
    const page = parseInt(req.query.page) || 1;
    const limit = 9;
    const offset = (page - 1) * limit;
    const searchTerm = req.query.search || '';

    // 1. Demandes pour devenir recruteur
    const recruteurResults = await recruteur.readAllFiltrePagine(searchTerm, limit, offset);
    const recruteurDemandes = recruteurResults.map(demande => ({
      id: demande.Id,
      nom: `${demande.LastName} ${demande.FirstName}`,
      email: demande.Email,
      message: demande.Message,
      date: demande.FormattedDate,
      statut: demande.StatutDemande,
      type: 'recruteur'
    }));

    // 2. Demandes pour devenir admin
    const adminResults = await admin.readAllFiltrePagine(searchTerm, limit, offset);
    const adminDemandes = adminResults.map(demande => ({
      id: demande.Id,
      nom: demande.nom || '',
      email: demande.email || '',
      message: demande.Message,
      date: demande.date || '',
      statut: demande.statut || '',
      type: 'admin'
    }));

    // Fusionner toutes les demandes
    const demandes = [...recruteurDemandes, ...adminDemandes];


    // Pagination et total à ajuster selon la fusion
    const totalOffers = demandes.length;
    const totalPages = Math.ceil(totalOffers / limit);
    const demandesPage = demandes.slice(offset, offset + limit);

    res.render('Admin/GestionDemandeRecruteur', {
      role: "admin",
      demandes: demandesPage,
      searchTerm,
      currentPage: page,
      totalPages
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Erreur lors de la récupération des demandes');
  }
});
      


router.post('/refuserDemandeRecruteur/:id', async (req, res) => {
  const userId = req.params.id;
  try {
    await recruteur.deleteById(userId);
    res.redirect('/admin/GestionDemandeRecruteur');
  } catch (err) {
    console.error('Erreur lors de la suppression de la demande :', err);
    res.status(500).send('Erreur lors de la suppression');
  }
});


router.post('/accepterDemandeRecruteur/:id', async (req, res) => {
  const demandeId = req.params.id;
  try {
    await recruteur.accepterDemande(demandeId); // Utilisation du modèle

    res.redirect('/admin/GestionDemandeRecruteur');
  } catch (err) {
    console.error('Erreur lors de l\'acceptation de la demande :', err);
    res.status(500).send('Erreur lors de l\'acceptation de la demande');
  }
});


////////////////////////// GESTION DES ORGANISATIONS /////////////////////////////////

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

router.post('/ValiderOrganisation/:siren', async (req, res) => {
  const siren = req.params.siren;
  try {
    await organisation.updateStatut(siren, 'Valide');
    res.redirect('/admin/organisations');
  } catch (err) {
    console.error('Erreur lors de la validation de l\'organisation :', err);
    res.status(500).send('Erreur lors de la validation');
  }
});

router.post('/RefuserOrganisation/:siren', async (req, res) => {
  const siren = req.params.siren;
  try {
    await organisation.deleteByID(siren);
    res.redirect('/admin/organisations');
  } catch (err) {
    console.error('Erreur lors du refus de l\'organisation :', err);
    res.status(500).send('Erreur lors du refus');
  }
});


////////////////////////// PRIVILEGES ////////////////////////////////////////

/*Les privilèges sont gérés au niveau de la route /candidat*/

router.get('/privileges', (req, res) => {
  // Récupérer l'ID de l'utilisateur depuis la session
  const userId = req.session.user?.phone ;//|| 223344556
  if (!userId) {
    return res.redirect('/LogIn');
  }
  
  const pageTitle = 'Élévation de Privilèges';
  
  res.render('Privileges/Privileges', {
    role: 'admin',
    title: pageTitle,
    userId: userId,
    roles:req.session.user?.roles || [],
    success: req.query.success
  });
});

router.get('/devenirRecruteur', async (req, res) => {
  res.redirect('/candidat/devenirRecruteur');
});


router.get('/creerOrganisation', (req, res) => {
      res.redirect('/candidat/creerOrganisation');
  });



module.exports = router;
