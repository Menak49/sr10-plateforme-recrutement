var express = require('express');
var router = express.Router();
var db = require('../model/db');
const offre = require('../model/offreEmploi.js');
const fiche = require('../model/fichePoste.js');
const statut = require('../model/statutPoste.js');
const metier = require('../model/typeMetier.js');
const organisation = require('../model/organisation.js');
const typeOrganisation = require('../model/typeOrganisation.js');
const pieceDossier = require('../model/typePieceDossier.js');

router.get('/Accueil', function(req, res, next) {
  const userId = req.session.user?.phone ;//|| 223344556
  if (!userId) {
    return res.redirect('/LogIn');
  }

  res.render('WelcomePage', {
      userId: userId,
      role:'recruteur',
      roles:req.session.user?.roles || []  });
});


/*GERE MES OFFRES*/

router.get('/GererOffres', async (req, res) => {
    try {
      const searchTerm = req.query.search || '';
      const page = parseInt(req.query.page) || 1;
      const limit = 9; 
      const offset = (page - 1) * limit;
      const userId = req.session.user?.phone;
      const results = await offre.readOffresFiltrePagineByUserId(userId, searchTerm, limit, offset);
      const countResult = await offre.nbTotalOffresByUserId(userId, searchTerm);
      const totalOffers = countResult[0] ? countResult[0].total : 0;
      const totalPages = Math.ceil(totalOffers / limit); 
  
      res.render('Recruteur/GererOffres', {
        role:"recruteur",
        offres: results,
        searchTerm: searchTerm,
        currentPage: page,
        totalPages: totalPages,
        success: req.query.success
        });
    } catch (err) {
      console.error('Erreur MySQL :', err);
      return res.status(500).send('Erreur lors de la récupération des offres');
    }
 
  });

router.get('/ajouterOffre', async(req, res) => {
  try{
    const fiches = await fiche.readAllBis();
    const pieces = await pieceDossier.readAll();
    res.render('Recruteur/PublierOffre', {
      mode: 'create',
      fiches: fiches,
      role: 'recruteur',
      pieces: pieces,
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

router.post('/ajouterOffre', async (req, res) => {
  try {
        // Récupérer les données du formulaire une par une en utilisant les identificateurs de la vue
        const state = req.body.state;
        const expiryDate = req.body.expiryDate;
        const details = req.body.details;
        const slots = req.body.slots;
        const fichePosteId = req.body.fichePosteId;

        // Créer un objet avec les données du formulaire
        const formData = {
            State: state,
            ExpiryDate: expiryDate,
            Details: details,
            Slots: slots,
            FichePoste: fichePosteId
        };
        console.log('FormData:', formData);

      const result = await offre.create(formData);
      res.redirect('/recruteur/GererOffres?success=1');
  } catch (err) {
      console.error(err);
      console.log('Erreur lors de la création de l\'offre d\'emploi:', formData);
      res.status(500).send('Erreur lors de la création de l\'offre');
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


/*GERER MES FICHES DE POSTE*/


router.get('/gererFicheDePoste', async (req, res) => {
  try {
    const role = req.session?.role || 'recruteur';
    const userId = req.session?.user?.phone ; 
    const page = parseInt(req.query.page) || 1;
    const limit = 6;
    const offset = (page - 1) * limit;

    const search = req.query.search?.trim() || '';

    let fiches, totalCount;

    if (search) {
      fiches = await fiche.searchByUserId(userId, search, limit, offset);
      totalCount = await fiche.countSearchByUserId(userId, search);
    } else {
      fiches = await fiche.getByUserId(userId, limit, offset);
      totalCount = await fiche.countByUserId();
    }

    const totalPages = Math.ceil(totalCount / limit);

    res.render('Recruteur/GererFicheDePoste', {
      fiches,
      currentPage: page,
      totalPages: totalPages,
      role: role,
      search: search, // pour remplir le champ input dans la vue
      success: req.query.success
    });
  } catch (err) {
    console.error('Erreur MySQL:', err);
    res.status(500).send('Erreur lors de la récupération des fiches de poste');
  }
});

router.get('/ajouterFicheDePoste', async (req, res) => {
  try{
    const statuts = await statut.readAll()
    const metiers = await metier.readAll()
    const organisations = await organisation.read(req.session.user.phone)
          
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


router.post('/ajouterFicheDePoste', async (req, res) => {
    try {
        const formData = req.body;
        formData.recruteur = req.session.user.phone;
        console.log('FormData:', formData);
        await fiche.create(formData);
        res.redirect('/recruteur/gererFicheDePoste?success=1');
    } catch (error) {
        console.error(error);
        console.log('Erreur lors de la création de la fiche de poste:', formData);
        res.status(500).send('Erreur lors de la création de la fiche de poste');
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


/*PRIVILEGES*/

  router.get('/privileges', (req, res) => {
    const userId = req.session.user || 111222333;
    
    if (!userId) {
      return res.redirect('/login');
    }
    
    const pageTitle = 'Élévation de Privilèges';
    console.log('Rôle de l\'utilisateur:', req.session.user?.roles );
    res.render('Privileges/Privileges', {
      role: 'recruteur',
      title: pageTitle,
      userId: userId,
      roles: req.session.user?.roles,
      success: req.query.success
    });
  });

  router.get('/creerOrganisation', (req, res) => {
      res.redirect('/candidat/creerOrganisation');
  });

  router.get('/devenirAdmin', async (req, res) => {
    res.redirect('/candidat/devenirAdmin');
  });
  
  

module.exports = router;
