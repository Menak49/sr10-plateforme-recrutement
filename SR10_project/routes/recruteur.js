var express = require('express');
var router = express.Router();
var db = require('../model/db');
const offre = require('../model/offreEmploi.js');
const fiche = require('../model/fichePoste.js');
const statut = require('../model/statutPoste.js');
const metier = require('../model/typeMetier.js');
const organisation = require('../model/organisation.js');

router.get('/Accueil', function(req, res, next) {
  var role =  req.session.role ||'recruteur';  
  if (!role) {
    //role = 'candidat'
    //return res.redirect('/connexion'); // on verra plus tard
  }

  res.render('WelcomePage', { role: role });
});



router.get('/ajouterOffre', async(req, res) => {
  try{
    const fiches = await fiche.readAllBis();
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
  }
  catch (err) {
    console.error('Erreur lors de la récupération des données:', err);
    return res.status(500).send('Erreur serveur');
  }
  
});


router.get('/modifierOffre/:id', async(req, res) => {
  try {
    const offreId = req.params.id;
    const offreToRender = await offre.read(offreId);
    const fiches = await fiche.readAllBis();
  
    res.render('Recruteur/PublierOffre', {
      mode: 'edit',
      offre: {
        id: offreToRender.Id,
        FichePoste: offreToRender.FichePoste,
        State: offreToRender.State,
        ExpiryDate: offreToRender.ExpiryDateFormatted,
        Details: offreToRender.Details,
        Slots: offreToRender.Slots
      },
      fiches: fiches,
      role: 'recruteur'
    });
  }
  catch (err) {
    console.error('Erreur lors de la récupération des données:', err);
    return res.status(500).send('Erreur serveur');
  }
  
});




router.get('/ajouterFicheDePoste', async (req, res) => {
  try{
    const statuts = await statut.readAll()
    const metiers = await metier.readAll()
    const organisations = await organisation.readAll()
          
    res.render('Recruteur/PublierFichePoste', {
      mode: 'create',
      fiche: {}, 
      statuts: statuts,
      metiers: metiers,
      organisations: organisations,
      role: 'recruteur',
      title: 'Créer une fiche de poste'
    });
  }
  catch (err) {
    console.error('Erreur lors de la récupération des données :', err);
    return res.status(500).send('Erreur serveur');
  }
});



router.get('/modifierFicheDePoste/:id', async (req, res) => {
  try {
    const ficheId = req.params.id;
  
    const fiches = await fiche.read(ficheId)
    if (fiches.length === 0) {
      return res.status(404).send('Fiche de poste non trouvée');
    }
    
    const statuts = await statut.readAll()
    const metiers = await metier.readAll()
    const organisations = await organisation.readAll()
    
    res.render('Recruteur/PublierFichePoste', {
      mode: 'edit',
      fiche: fiches,
      statuts: statuts,
      metiers: metiers,
      organisations: organisations,
      role: 'recruteur',
      title: 'Modifier une fiche de poste'
    });
  }
  catch (err) {
    console.error('Erreur lors de la récupération de la fiche de poste :', err);
    return res.status(500).send('Erreur serveur');
  }
});



router.get('/gererFicheDePoste', async (req, res) => {
  try {
    const role = req.session?.role || 'recruteur';

    const page = parseInt(req.query.page) || 1;
    const limit = 6;
    const offset = (page - 1) * limit;

    const search = req.query.search?.trim() || '';

    let fiches, totalCount;

    if (search) {
      fiches = await fiche.searchPage(search, limit, offset);
      totalCount = await fiche.countSearch(search);
    } else {
      fiches = await fiche.readPage(limit, offset);
      totalCount = await fiche.countAll();
    }

    const totalPages = Math.ceil(totalCount / limit);

    res.render('Recruteur/GererFicheDePoste', {
      fiches,
      currentPage: page,
      totalPages: totalPages,
      role: role,
      search: search // pour remplir le champ input dans la vue
    });
  } catch (err) {
    console.error('Erreur MySQL:', err);
    res.status(500).send('Erreur lors de la récupération des fiches de poste');
  }
});



  router.get('/GererOffres', async (req, res) => {
    try {
      const searchTerm = req.query.search || '';
      const page = parseInt(req.query.page) || 1;
      const limit = 9; 
      const offset = (page - 1) * limit;
  
      const results = await offre.readOffresFiltrePagine(searchTerm, limit, offset);
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
