// routes/candidat.js
const express = require('express');
const router = express.Router();
const offre = require('../model/offreEmploi.js');
const candidature = require('../model/candidature.js');
const organisation = require('../model/organisation.js');
const typeOrganisation = require('../model/typeOrganisation.js');
const recruteurBecomeQuery = require('../model/recruteurBecomeQuery.js');
const fichePoste = require('../model/fichePoste.js');
const pieceDossier = require('../model/typePieceDossier.js');




router.get('/Accueil', function(req, res, next) {
  const userId = req.session.user?.phone ;//|| 223344556
  if (!userId) {
    return res.redirect('/LogIn');
  }
  res.render('WelcomePage', { role: 'candidat',
      userId: userId,
      role:'candidat',
      roles:req.session.user?.roles || []  });
});


/*VOIR LES OFFRES*/

router.get('/parcourir', async (req, res) => {
  try {
    const userId = req.session.user?.phone ;//|| 223344556
    if (!userId) {
      return res.redirect('/LogIn');
    }
    const searchTerm = req.query.search || ''; 
    const page = parseInt(req.query.page) || 1;
    const limit = 9;
    const offset = (page - 1) * limit;


    let offres, total;


    offres = await offre.readOffresPourCandidat(userId, searchTerm, limit, offset);
    total = await offre.countOffresPourCandidat(userId, searchTerm);
    

    const totalPages = Math.ceil(total / limit);

    return res.render('Candidat/ParcourirOffre', {
      role: 'candidat',
      offres,
      currentPage: page,
      totalPages,
      searchTerm,
      userId: userId,
    });
  } catch (err) {
    console.error("Erreur complète :", err);
  res.status(500).send("Erreur lors de la récupération des offres (Contrôleur)");
  }
});




// Afficher le formulaire de candidature
router.get('/candidater/:offreId', async (req, res) => {
  try {
    const userId = req.session.user?.phone;
    if (!userId) return res.redirect('/LogIn');

    const offreId = req.params.offreId;
    const offreData = await offre.read(offreId);
    const fichePosteData = await fichePoste.read(offreData.FichePoste);

    const pieces = await pieceDossier.readAll(); // Toutes les pièces disponibles

    res.render('Candidat/candidater', {
      role: 'candidat',
      offre: {
        Id: offreData.Id,
        TitreOffre: fichePosteData.Title,
      },
      pieces: pieces,
      defaultValues: {
        date: new Date().toISOString().split('T')[0]
      }
    });
  } catch (err) {
    console.error('Erreur lors de l\'affichage du formulaire de candidature :', err);
    res.status(500).send('Erreur lors de l\'affichage du formulaire de candidature');
  }
});




/*MES CANDIDATURES*/

router.get('/candidatures', async (req, res) => {
  console.log("session");
  try {
    const userId = req.session.user?.phone;//|| 223344556
    if (!userId) {
      return res.redirect('/LogIn');
    }
    const currentPage = parseInt(req.query.page) || 1;
    const limit = 5;
    const offset = (currentPage - 1) * limit;
    const searchTerm = req.query.search || '';

    const candidatures = await candidature.getCandidaturesByUserId(userId, searchTerm, limit, offset);
    const total = await candidature.countCandidaturesByUserId(userId, searchTerm);
    const totalPages = Math.ceil(total / limit);

    res.render('Candidat/Candidatures', {
      role : 'candidat',
      candidatures,
      currentPage,
      totalPages,
      searchTerm,
      userId: userId,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Erreur lors de la récupération de vos candidatures (Contrôleur)");
  }
});

router.post('/delete-candidature/:id', async (req, res) => {
  const candidatureId = req.params.id;
  try {
    await candidature.deleteById(candidatureId);
    res.redirect('/candidat/candidatures');
  } catch (err) {
    console.error('Erreur lors de la suppression de la candidature :', err);
    res.status(500).send('Erreur lors de la suppression de la candidature');
  }
});

router.get('/modifierCandidature/:id', async (req, res) => {
  const candidatureId = req.params.id;
  try {
    const candidature = await candidature.findById(candidatureId); 
    res.render('Candidat/modifierCandidature', { candidature });
  } catch (err) {
    console.error('Erreur lors de la récupération de la candidature :', err);
    res.status(500).send('Erreur lors de la récupération de la candidature');
  }
});

router.post('/modifierCandidature/:id', async (req, res) => {
  const candidatureId = req.params.id;
  const { titre, localisation, contrat, ...autresChamps } = req.body;
  try {
    await candidature.updateById(candidatureId, {
      titre,
      localisation,
      contrat,
      ...autresChamps
    });
    res.redirect('/candidat/candidatures');
  } catch (err) {
    console.error('Erreur lors de la modification de la candidature :', err);
    res.status(500).send('Erreur lors de la modification de la candidature');
  }
});



/*PRIVILEGES*/

router.get('/privileges', (req, res) => {
  // Récupérer l'ID de l'utilisateur depuis la session
  const userId = req.session.user?.phone ;//|| 223344556
    if (!userId) {
      return res.redirect('/LogIn');
    }
  
  const role = req.session.role || 'candidat';
  
  const pageTitle = 'Élévation de Privilèges';
  
  res.render('Privileges/Privileges', {
    role: role,
    title: pageTitle,
    userId: userId,
    roles: req.session.user?.roles,
    success: req.query.success
  });
});



router.get('/devenirRecruteur', async (req, res) => {
  try {
    const userId = req.session.user?.phone ;//|| 223344556
    if (!userId) {
      return res.redirect('/LogIn');
    }
    let results;
    results = await organisation.readAll();
    return res.render('Privileges/DevenirRecruteur', 
      {role: 'candidat',
       organisations: results,
      userId: userId,});
  }
  catch (err) {
    console.log(err);
    res.status(500).send("Erreur lors de la récupération des organisations (Contrôleur)");
  }
});

router.post('/EnvoyerDemandeRecruteur', async (req, res) => {
  try {
    const userId = req.session.user?.phone;
    const organisation = req.body.organisation;
    const responsabilite = req.body.responsabilite;
    console.log("userId", userId, "organisation", organisation, "responsabilite", responsabilite);
    if (!userId || !organisation) {
      return res.status(400).send('Informations manquantes');
    }

    await recruteurBecomeQuery.create({
      candidat: userId,
      organisation: organisation,
      responsabilite: responsabilite,
    });

    res.redirect('/candidat/Accueil');
  } catch (err) {
    console.error('Erreur lors de l\'envoi de la demande recruteur :', err);
    res.status(500).send('Erreur lors de l\'envoi de la demande');
  }
});



router.get('/creerOrganisation', async (req, res) => {
  const userId = req.session.user?.phone ;//|| 223344556
    if (!userId) {
      return res.redirect('/LogIn');
    }
    let types
    types = await typeOrganisation.readAll(); // récupère tous les types
    return res.render('Privileges/creerOrga', {
      role: 'candidat',
      userId: userId,
      types: types
    });
  });


  router.post('/creerOrganisation', async (req, res) => {
  try {
    const userId = req.session.user?.phone;
    if (!userId) {
      return res.redirect('/LogIn');
    }
    console.log(req.body);
    const { siren, name, headquarters, type } = req.body;
    await organisation.create(siren, name, headquarters, type, userId);
    return res.redirect('/candidat/privileges?success=1');
  } catch (err) {
    console.error('CONTROLEUR : Erreur lors de la création de l\'organisation :', err);
    return res.status(500).send("CONTROLEUR : Erreur lors de la création de l'organisation");
  }
});



module.exports = router;
