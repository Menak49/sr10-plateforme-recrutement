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
    
    res.render('Admin/GestionUtilisateurs', {
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




router.get('/GestionDemandes', async (req, res) => {
  try {
    const userId = req.session.user?.phone;
    if (!userId) {
      return res.redirect('/LogIn');
    }

    const page = parseInt(req.query.page, 10) || 1;
    const limit = 9;
    const offset = (page - 1) * limit;
    const searchTerm = req.query.search || '';



    // Appeler la fonction avec UNION pour récupérer les demandes paginées
    const demandes = await admin.readAllFiltrePagineUnion(searchTerm, limit, offset);

    // Calculer le nombre total de pages
    const totalResults = await admin.countUnion(searchTerm);
    const totalPages = Math.ceil(totalResults[0].total / limit);


    res.render('Admin/GestionDemandeRecruteur', {
      role: "admin",
      demandes,
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


router.post('/refuserDemandeAdmin/:id', async (req, res) => {
  const demandeId = req.params.id;
  try {
    await admin.deleteById(demandeId); // Supprime la demande d'admin
    res.redirect('/admin/GestionDemandes');
  } catch (err) {
    console.error('Erreur lors de la suppression de la demande admin :', err);
    res.status(500).send('Erreur lors de la suppression de la demande admin');
  }
});

router.post('/accepterDemandeAdmin/:id', async (req, res) => {
  const demandeId = req.params.id;
  try {
    await admin.accepterDemande(demandeId); // Accepte la demande d'admin
    res.redirect('/admin/GestionDemandes');
  } catch (err) {
    console.error('Erreur lors de l\'acceptation de la demande admin :', err);
    res.status(500).send('Erreur lors de l\'acceptation de la demande admin');
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
