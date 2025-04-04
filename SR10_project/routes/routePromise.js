var express = require('express');
var router = express.Router();

//envoie vers le model pour récupérer les données

router.get('/userslist', function (req, res, next){ 
  /***result=userModel.readall(function(result){   //userModel est le nom du fichier correspondant dans M
    res.render('usersList', { title: 'List des utilisateurs', users: 
result });
}); **/

  /*Lien avec le model pour récupérer les données :
  userModel est le nom du fichier correspondant dans Model
  readall est la méthode qui permet de lire toutes les données
  result est le nom de la variable qui va contenir le résultat de la requête
  res.render est la méthode qui permet d'afficher le résultat dans la vue
  usersList est le nom du fichier ejs qui va afficher le résultat
  title est le titre de la page
  users est le nom de la variable qui va contenir le résultat de la requête, ici result
   */
  userModel.readall().then(function(result){   //userModel est le nom du fichier correspondant dans Model
    res.render('usersList', { title: 'List des utilisateurs', users: result });
  }).catch(function(err){
    console.log(err);
    res.status(500).send('Error retrieving users');
  });
}); 

module.exports = router;
