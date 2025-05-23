// routes/candidat.js
const express = require('express');
const router = express.Router();
const offre = require('../model/offreEmploi.js');
const candidature = require('../model/candidature.js');
const organisation = require('../model/organisation.js');




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
    userId: userId
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



router.get('/creerOrganisation', (req, res) => {
  const userId = req.session.user?.phone ;//|| 223344556
    if (!userId) {
      return res.redirect('/LogIn');
    }

    res.render('Privileges/creerOrga', {
      role: 'candidat',
      userId: userId,
    });
  });



module.exports = router;
