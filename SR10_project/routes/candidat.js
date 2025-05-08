// routes/candidat.js
const express = require('express');
const router = express.Router();
const offre = require('../model/offreEmploi.js');
const candidature = require('../model/candidature.js');
const organisation = require('../model/organisation.js');



router.get('/Accueil', function(req, res, next) {
  var role =  req.session.role ||'candidat';  
  if (!role) {
    //role = 'candidat'
    //return res.redirect('/connexion'); // on verra plus tard
  }

  res.render('WelcomePage', { role: role });
});


router.get('/parcourir', async (req, res) => {
  try {
    const searchTerm = req.query.search || ''; 
    const page = parseInt(req.query.page) || 1;
    const limit = 9;
    const offset = (page - 1) * limit;

    const userId = req.session.user || 223344556;
    const role = req.session.role || 'candidat';

    let offres, total;

    if (role === 'candidat') {
      offres = await offre.readOffresPourCandidat(userId, searchTerm, limit, offset);
      total = await offre.countOffresPourCandidat(userId, searchTerm);
    } else {
      offres = await offre.readOffresFiltrePagine(searchTerm, limit, offset);
      const countResult = await offre.nbTotalOffres(searchTerm);
      total = countResult[0].total;
    }

    const totalPages = Math.ceil(total / limit);

    return res.render('Candidat/ParcourirOffre', {
      role,
      offres,
      currentPage: page,
      totalPages,
      searchTerm,
    });
  } catch (err) {
    console.error("Erreur complète :", err);
  res.status(500).send("Erreur lors de la récupération des offres (Contrôleur)");
  }
});



router.get('/candidatures', async (req, res) => {
  try {
    const userId = req.session.user || 223344556;
    const role = req.session.role || 'candidat';
    
    const currentPage = parseInt(req.query.page) || 1;
    const limit = 5;
    const offset = (currentPage - 1) * limit;
    const searchTerm = req.query.search || '';

    const candidatures = await candidature.getCandidaturesByUserId(userId, searchTerm, limit, offset);
    const total = await candidature.countCandidaturesByUserId(userId, searchTerm);
    const totalPages = Math.ceil(total / limit);

    res.render('Candidat/Candidatures', {
      role,
      candidatures,
      currentPage,
      totalPages,
      searchTerm
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Erreur lors de la récupération de vos candidatures (Contrôleur)");
  }
});




router.get('/privileges', (req, res) => {
  // Récupérer l'ID de l'utilisateur depuis la session
  const userId = req.session.user || 223344556;
  
  // Si l'utilisateur n'est pas connecté, rediriger vers la page de connexion
  if (!userId) {
    return res.redirect('/login');
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



router.get('/creerOrganisation', (req, res) => {
  const role = req.session.role || 'candidat';

    res.render('Privileges/creerOrga', {
      role: role
    });
  });



module.exports = router;
