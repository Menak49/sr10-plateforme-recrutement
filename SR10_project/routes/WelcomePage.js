
var express = require('express');
var router = express.Router();




router.get('/', function(req, res, next) {
  var role =  req.session.role ||'candidat';  
  if (!role) {
    //role = 'candidat'
    //return res.redirect('/connexion'); // on verra plus tard
  }

  // Passer le rôle à la vue
  res.render('WelcomePage', { role: role });
});



module.exports = router;
