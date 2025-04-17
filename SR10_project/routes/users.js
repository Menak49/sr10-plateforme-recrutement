//importation des modules
var express = require('express'); 
var router = express.Router(); //instance d'un Router
var userModel = require('../model/userModel'); //MODEL, contient manière d'interagir avec DB

/* Get : requête http sur /users for reading data */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});


router.get('/userslist', function (req, res, next) {
  /**
 * Get : requête http sur /users/userslist for reading data
 * la ROUTE users.js appelle la méthode readall du MODELE userModel.js
 * la ROUTE remplit la VUE userlist.ejs avec les données récupérées
*/ 
  userModel.readall(function (err, result) {
    if (err) {
      console.error("Erreur lors de la récupération des utilisateurs :", err);
      return res.status(500).send("Erreur interne du serveur");
    }
    res.render('usersList', { title: 'Liste des utilisateurs', users: result });
  });
});

//exportation du router
//pour l'utiliser dans d'autres fichiers (comme app.js)
module.exports = router;



