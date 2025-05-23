const db = require('./db.js');
const util = require('util');
const { readAllFiltréPaginé } = require('./recruteurBecomeQuery.js');
// Promisify db.query
db.query = util.promisify(db.query);

module.exports = {


  //READ : lit un utilisateur (par son email) 
  read : async function (email) {
    const query = `SELECT * FROM Utilisateur WHERE Email = ?`;
    try {
        const results = await db.query(query, [email]);
        return results; // Retourne l'utilisateur correspondant
    } catch (err) {
        console.error('Erreur lors de la lecture de l\'utilisateur :', err);
        throw err;
    }
  },


  //READ ALL : lit tous les utilisateurs
  readall : async function () {
    const query = 'SELECT * FROM Utilisateur';
    try {
      const results = await db.query(query);
      return results; // Retourne tous les utilisateurs
    } catch (err) {
      console.error('Erreur lors de la récupération des utilisateurs :', err);
      throw err;
    }
  },


  /* vérifier si les informations d'identification sont valides:
  - results.length === 1 : Vérifie qu'un seul utilisateur a été trouvé.
  - results[0].Password === password : Vérifie que le mot de passe stocké dans la BD
  correspond au mot de passe fourni en paramètre.

  attention : ne marche pas sans le await
  */
  areValid: async function (email, password) {
    const query = 'SELECT Password FROM Utilisateur WHERE Email = ?';
    try {
      const results = await db.query(query, [email]);
      if (results.length === 1 && results[0].Password === password) {
        return true;
      } else {
        return false;
      }
    } catch (err) {
      console.error('Erreur MySQL : ', err);
      throw err;
    }
  },
  

  /* CREATE : Fonction pour insérer un nouvel utilisateur (candidat)
Lorsque la requête réussit, la fonction retourne un objet contenant 
des informations sur l'opération SQL du type : 
{
  fieldCount: 0,
  affectedRows: 1, // Nombre de lignes affectées (1 pour un INSERT réussi)
  insertId: 42,    // ID de l'enregistrement inséré (si la table a une colonne AUTO_INCREMENT)
  serverStatus: 2,
  warningCount: 0,
  message: '',
  protocol41: true,
  changedRows: 0
}
  */
  create: async function (phone, lastName, firstName, status, password, email) {
    const checkQuery = 'SELECT * FROM Utilisateur WHERE Phone = ?';
    try {
      const existingUser = await db.query(checkQuery, [phone]);
      if (existingUser.length > 0) {
        return false; // L'utilisateur existe déjà
      }
      else {
        const query = 'INSERT INTO Utilisateur (Phone, LastName, FirstName, Status, Password, Email) VALUES (?, ?, ?, ?, ?, ?)';
        const result = await db.query(query, [phone, lastName, firstName, status, password, email]);
        return result
      }
    } catch (err) {
      console.error('Erreur MySQL : ', err);
      throw err;
    }
  },



/*     // UPDATE : Fonction pour mettre à jour une donnée d'un utilisateur 
    update: async function (clé, valeur, email) {
      const query = `UPDATE Utilisateur SET ${clé} = ? WHERE Email = ?`;
      try {
          const results = await db.query(query, [valeur, email]);
          return results;
      } catch (err) {
          console.error('Erreur MySQL : ', err);
          throw err;
      }
  }, */
  
    // Fonction pour supprimer un utilisateur (candidat)
    deleteUser: async function (email) {
      const query = 'DELETE FROM Utilisateur WHERE Email = ?';
      try {
        const result = await db.query(query, [email]);
        return result
      } catch (err) {
        console.error('Erreur MySQL : ', err);
        throw err;
      }
    },

    readAllFiltréPaginé: async function(searchTerm, limit, offset) {
      const searchCondition = searchTerm ? 
        `WHERE Utilisateur.LastName LIKE ? OR Utilisateur.FirstName LIKE ? OR Utilisateur.Email LIKE ?` : 
        '';

      const query = `
      SELECT Utilisateur.Phone, Utilisateur.LastName, Utilisateur.FirstName, Utilisateur.Email, Utilisateur.Status,
        CASE 
          WHEN Administrateur.User IS NOT NULL THEN 'Administrateur'
          WHEN Recruteur.User IS NOT NULL THEN 'Recruteur'
          WHEN Utilisateur.Phone IS NOT NULL THEN 'Candidat'
          ELSE 'Utilisateur'
        END AS Role
      FROM Utilisateur
      LEFT JOIN Administrateur ON Utilisateur.Phone = Administrateur.User
      LEFT JOIN Recruteur ON Utilisateur.Phone = Recruteur.User
      ${searchCondition}
      ORDER BY Utilisateur.LastName ASC
      LIMIT ? OFFSET ?
    `;
      
      const queryParams = searchTerm ? 
        [`%${searchTerm}%`, `%${searchTerm}%`, `%${searchTerm}%`, limit, offset] : 
        [limit, offset];

        try {
          const results = await db.query(query, queryParams);
          return results;
      }
      catch (err) {
          console.error('Erreur lors de la récupération des recruteurs(Modèle) :', err);
          throw err;
      }
    },

    count: async function(searchTerm) {
      const searchCondition = searchTerm ? 
      `WHERE Utilisateur.LastName LIKE ? OR Utilisateur.FirstName LIKE ? OR Utilisateur.Email LIKE ?` : 
      '';

      const countQuery = `
        SELECT COUNT(*) as total
        FROM Utilisateur
        ${searchCondition}
      `;
    
      const countParams = searchTerm ? 
        [`%${searchTerm}%`, `%${searchTerm}%`, `%${searchTerm}%`] : 
        [];

      try {
        const results = await db.query(countQuery, countParams);
        return results[0].total;
      } catch (err) {
          console.error('Erreur lors de la récupération du nombre total dutilisateurs (Modèle) :', err);
          throw err;
      }
    }
    ,
    getRoles : async function(userId) {
  try {
    const roles = [];
  // Le select 1 permet de savoir si le user est dans la table
    const adminRows = await db.query('SELECT 1 FROM Administrateur WHERE User = ?', [userId]);
    console.log(adminRows)
    if (adminRows.length > 0) roles.push('admin');

    const recruteurRows = await db.query('SELECT 1 FROM Recruteur WHERE User = ?', [userId]);
    if (recruteurRows.length > 0) roles.push('recruteur');

    roles.push('candidat');

    return roles;
  } catch (err) {
    console.error('Erreur lors de la récupération des rôles :', err);
    throw err;
  }
}

}