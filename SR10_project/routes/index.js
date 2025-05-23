var express = require('express');
var router = express.Router();

var WelcomePagerouter = require('./WelcomePage');
var candidatRouter = require('./candidat');
var adminRouter = require('./admin');
var recruteurRouter = require('./recruteur');

router.use('/Accueil', WelcomePagerouter);
router.use('/candidat', candidatRouter);
router.use('/recruteur', recruteurRouter);
router.use('/admin', adminRouter);


/* GET home page. */
router.get('/', function(req, res, next) {
  //appelle la fonction readall() dans /model/utilisateur.js pour récupérer les utilisateurs
  //puis les affiche dans la vue usersList.ejs


});

router.get('/SignUp', function(req, res, next) {
  res.render('SignUp', { title: 'Accueil', text: 'Bienvenue sur notre site de gestion des offres d\'emploi !' });
});

router.get('/LogIn', function(req, res, next) {
  res.render('LogIn', { title: 'Accueil', text: 'Bienvenue sur notre site de gestion des offres d\'emploi !' });
});

const users = require('../model/utilisateur.js');

router.post('/LogIn', async (req, res) => {
  const { Email, password } = req.body;
  var email = Email
  try {
    const isValid = await users.areValid(Email, password);
    console.log("email", Email, "password", password, "isValid", isValid);
    if (!isValid) {
      return res.status(401).send("Email ou mot de passe incorrect.");
    }

    const userData = await users.read(email);
    if (userData.length === 0) {
      return res.status(404).send("Utilisateur introuvable.");
    }

    const user = userData[0]; // données utilisateur

    // Déterminer le rôle à partir du Status
    let roles = await users.getRoles(user.Phone);
    console.log(roles)
    // Initialiser la session
    req.session.user = {
      phone: user.Phone,
      email: user.Email,
      nom: user.LastName,
      prenom: user.FirstName,
      roles: roles
    };

    // Rediriger vers la page d'accueil du rôle
    res.redirect(`/candidat/Accueil`);

  } catch (err) {
    console.error('Erreur lors de la connexion :', err);
    res.status(500).send("Erreur serveur.");
  }
});

router.get('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      console.error('Erreur lors de la déconnexion :', err);
      return res.status(500).send("Erreur lors de la déconnexion");
    }
    res.redirect('/LogIn'); 
  });
});


module.exports = router;
