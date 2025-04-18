var express = require('express');
var router = express.Router();
var db = require('../model/db');


router.get('/Accueil', function(req, res, next) {
    var role =  req.session.role ||'admin';  
    if (!role) {
      //role = 'candidat'
      //return res.redirect('/connexion'); // on verra plus tard
    }
  
    res.render('WelcomePage', { role: role });
  });

  router.get('/devenirRecruteur', (req, res) => {
    const role = req.session.role || 'admin';
  
    const query = `
      SELECT Siren, Name 
      FROM Organisation
      ORDER BY Name ASC
    `;
  
    db.query(query, (err, results) => {
      if (err) {
        console.error("Erreur MySQL :", err);
        return res.status(500).send("Erreur serveur");
      }
  
      res.render('Privileges/DevenirRecruteur', {
        role: role,
        organisations: results
      });
    });
  });

router.get('/privileges', (req, res) => {
    // Récupérer l'ID de l'utilisateur depuis la session
    const userId = req.session.user || 1234567890;
    
    // Si l'utilisateur n'est pas connecté, rediriger vers la page de connexion
    if (!userId) {
      return res.redirect('/login');
    }
    
    const role = req.session.role || 'admin';
    
    const pageTitle = 'Élévation de Privilèges';
    
    res.render('Privileges', {
      role: role,
      title: pageTitle,
      userId: userId
    });
  });


  router.get('/creerOrganisation', (req, res) => {
    const role = req.session.role || 'recruteur';
  
    
  
      res.render('Privileges/creerOrga', {
        role: role
      });
    });


    router.get('/gestionUtilisateurs', (req, res) => {
      const role = req.session.role || 'admin';
      const page = parseInt(req.query.page) || 1;
      const limit = 9; // Nombre d'utilisateurs par page
      const offset = (page - 1) * limit;
      
      // Récupération du terme de recherche
      const searchTerm = req.query.search || '';
      const searchCondition = searchTerm ? 
        `WHERE Utilisateur.LastName LIKE ? OR Utilisateur.FirstName LIKE ? OR Utilisateur.Email LIKE ?` : 
        '';
      
      // Requête pour récupérer les utilisateurs avec pagination
      const query = `
        SELECT Utilisateur.Phone, Utilisateur.LastName, Utilisateur.FirstName, Utilisateur.Email, Utilisateur.Status,
        CASE 
          WHEN Administrateur.User IS NOT NULL THEN 'Administrateur'
          WHEN Recruteur.User IS NOT NULL THEN 'Recruteur'
          WHEN Candidat.User IS NOT NULL THEN 'Candidat'
          ELSE 'Utilisateur'
        END AS Role
        FROM Utilisateur
        LEFT JOIN Administrateur ON Utilisateur.Phone = Administrateur.User
        LEFT JOIN Recruteur ON Utilisateur.Phone = Recruteur.User
        LEFT JOIN Candidat ON Utilisateur.Phone = Candidat.User
        ${searchCondition}
        ORDER BY Utilisateur.LastName ASC
        LIMIT ? OFFSET ?
      `;
      
      // Paramètres pour la requête
      const queryParams = searchTerm ? 
        [`%${searchTerm}%`, `%${searchTerm}%`, `%${searchTerm}%`, limit, offset] : 
        [limit, offset];
      
      // Requête pour compter le nombre total d'utilisateurs (pour la pagination)
      const countQuery = `
        SELECT COUNT(*) as total
        FROM Utilisateur
        ${searchCondition}
      `;
    
      // Paramètres pour la requête de comptage
      const countParams = searchTerm ? 
        [`%${searchTerm}%`, `%${searchTerm}%`, `%${searchTerm}%`] : 
        [];
    
      // Exécution des requêtes
      db.query(query, queryParams, (err, results) => {
        if (err) {
          console.error("Erreur MySQL (utilisateurs) :", err);
          return res.status(500).send("Erreur serveur");
        }
        
        // Transformer les données pour correspondre à la vue
        const utilisateurs = results.map(user => {
          return {
            id: user.Phone,
            nom: `${user.LastName} ${user.FirstName}`,
            email: user.Email,
            status: user.Status,
            role: user.Role
          };
        });
        
        db.query(countQuery, countParams, (countErr, countResults) => {
          if (countErr) {
            console.error("Erreur MySQL (comptage) :", countErr);
            return res.status(500).send("Erreur serveur");
          }
          
          const totalUtilisateurs = countResults[0].total;
          const totalPages = Math.ceil(totalUtilisateurs / limit);
          
          res.render('admin/gestionUtilisateurs', {
            role: role,
            utilisateurs: utilisateurs,
            currentPage: page,
            totalPages: totalPages,
            searchTerm: searchTerm
          });
        });
      });
    });

module.exports = router;
