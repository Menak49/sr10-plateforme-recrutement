var express = require('express');
var router = express.Router();
var userModel = require('../model/userModel');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});


router.get('/userslist', function (req, res, next) {
  userModel.readall(function (err, result) {
    if (err) {
      console.error("Erreur lors de la récupération des utilisateurs :", err);
      return res.status(500).send("Erreur interne du serveur");
    }
    res.render('usersList', { title: 'Liste des utilisateurs', users: result });
  });
});

module.exports = router;



