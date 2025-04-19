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
    
    res.render('Privileges/Privileges', {
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
      const limit = 9;
      const offset = (page - 1) * limit;
      
      const searchTerm = req.query.search || '';
      const searchCondition = searchTerm ? 
        `WHERE Utilisateur.LastName LIKE ? OR Utilisateur.FirstName LIKE ? OR Utilisateur.Email LIKE ?` : 
        '';
      
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
      
      const queryParams = searchTerm ? 
        [`%${searchTerm}%`, `%${searchTerm}%`, `%${searchTerm}%`, limit, offset] : 
        [limit, offset];
      
      const countQuery = `
        SELECT COUNT(*) as total
        FROM Utilisateur
        ${searchCondition}
      `;
    
      const countParams = searchTerm ? 
        [`%${searchTerm}%`, `%${searchTerm}%`, `%${searchTerm}%`] : 
        [];
    
      db.query(query, queryParams, (err, results) => {
        if (err) {
          console.error("Erreur MySQL (utilisateurs) :", err);
          return res.status(500).send("Erreur serveur");
        }
        
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




    router.get('/GestionDemandeRecruteur', (req, res) => {
      const role = req.session.role || 'admin';
      const page = parseInt(req.query.page) || 1;
      const limit = 9; 
      const offset = (page - 1) * limit;
      
      const searchTerm = req.query.search || '';
      const searchCondition = searchTerm ? 
        `WHERE u.LastName LIKE ? OR u.FirstName LIKE ? OR u.Email LIKE ? OR q.Message LIKE ?` : 
        '';
      
      const query = `
  SELECT
    q.Id,
    q.Message,
    u.Phone as UserId,
    u.LastName,
    u.FirstName,
    u.Email,
    u.Status as UserStatus,
    'Non disponible' as FormattedDate,
    CASE
      WHEN r.User IS NOT NULL THEN 'Validé'
      ELSE 'En attente'
    END as StatutDemande
  FROM RecruteurBecomeQuery q
  JOIN Utilisateur u ON q.Candidat = u.Phone
  LEFT JOIN Recruteur r ON u.Phone = r.User
  ${searchCondition}
  ORDER BY q.Id DESC
  LIMIT ? OFFSET ?
`;
      
      const queryParams = searchTerm ? 
        [`%${searchTerm}%`, `%${searchTerm}%`, `%${searchTerm}%`, `%${searchTerm}%`, limit, offset] : 
        [limit, offset];
      
      const countQuery = `
        SELECT COUNT(*) as total
        FROM RecruteurBecomeQuery q
        JOIN Utilisateur u ON q.Candidat = u.Phone
        ${searchCondition}
      `;
    
      const countParams = searchTerm ? 
        [`%${searchTerm}%`, `%${searchTerm}%`, `%${searchTerm}%`, `%${searchTerm}%`] : 
        [];
        console.log("Query params:", queryParams);
console.log("Count params:", countParams);
    
      db.query(query, queryParams, (err, results) => {
        if (err) {
          console.error("Erreur MySQL (demandes) :", err);
          return res.status(500).send("Erreur serveur f");
        }
        
        const demandes = results.map(demande => {
          return {
            id: demande.Id,
            nom: `${demande.LastName} ${demande.FirstName}`,
            email: demande.Email,
            message: demande.Message,
            date: demande.FormattedDate,
            statut: demande.StatutDemande
          };
        });
        
        db.query(countQuery, countParams, (countErr, countResults) => {
          if (countErr) {
            console.error("Erreur MySQL (comptage) :", countErr);
            return res.status(500).send("Erreur serveur");
          }
          
          const totalDemandes = countResults[0].total;
          const totalPages = Math.ceil(totalDemandes / limit);
          
          res.render('admin/GestionDemandeRecruteur', {
            role: role,
            demandes: demandes,
            currentPage: page,
            totalPages: totalPages,
            searchTerm: searchTerm
          });
        });
      });
    });




    router.get('/organisations', (req, res) => {
      const role = req.session.role || 'admin';
      const page = parseInt(req.query.page) || 1;
      const limit = 9;
      const offset = (page - 1) * limit;
    
      const searchTerm = req.query.search || '';
      const searchCondition = searchTerm
        ? `WHERE o.Name LIKE ? OR o.Headquarters LIKE ? OR o.Type LIKE ? OR o.Status LIKE ?`
        : '';
    
      const query = `
        SELECT
          o.Siren,
          o.Name AS Nom,
          o.Status AS Statut,
          o.Headquarters AS Localisation,
          o.Type
        FROM Organisation o
        ${searchCondition}
        ORDER BY o.Siren DESC
        LIMIT ? OFFSET ?
      `;
    
      const queryParams = searchTerm
        ? [`%${searchTerm}%`, `%${searchTerm}%`, `%${searchTerm}%`, `%${searchTerm}%`, limit, offset]
        : [limit, offset];
    
      const countQuery = `
        SELECT COUNT(*) AS total
        FROM Organisation o
        ${searchCondition}
      `;
    
      const countParams = searchTerm
        ? [`%${searchTerm}%`, `%${searchTerm}%`, `%${searchTerm}%`, `%${searchTerm}%`]
        : [];
    
      db.query(query, queryParams, (err, results) => {
        if (err) {
          console.error("Erreur MySQL (organisations) :", err);
          return res.status(500).send("Erreur serveur");
        }
    
        const organisations = results.map(org => ({
          siren: org.Siren,
          nom: org.Nom,
          statut: org.Statut,
          localisation: org.Localisation,
          type: org.Type || 'Non spécifié'
        }));
    
        db.query(countQuery, countParams, (countErr, countResults) => {
          if (countErr) {
            console.error("Erreur MySQL (comptage) :", countErr);
            return res.status(500).send("Erreur serveur");
          }
    
          const totalOrganisations = countResults[0].total;
          const totalPages = Math.ceil(totalOrganisations / limit);
    
          res.render('admin/GestionOrganisation', {
            role: role,
            organisations: organisations,
            currentPage: page,
            totalPages: totalPages,
            searchTerm: searchTerm
          });
        });
      });
    });
    




module.exports = router;
