const db = require('./db.js');
module.exports = {

  //READ : lit un utilisateur (par son email)
  read : async function (email) {
    const query = `SELECT * FROM Utilisateur WHERE Email = ?`;
    try {
        const [results] = await db.query(query, [email]);
        return results[0]; // Retourne l'utilisateur correspondant
    } catch (err) {
        console.error('Erreur lors de la lecture de l\'utilisateur :', err);
        throw err;
    }
  },


  //READ ALL : lit tous les utilisateurs
  readall : async function () {
    const query = 'SELECT * FROM Utilisateur';
    try {
      const [results] = await db.query(query);
      return results; // Retourne tous les utilisateurs
    } catch (err) {
      console.error('Erreur lors de la récupération des utilisateurs :', err);
      throw err;
    }
  },


  /* vérifier si les informations d'identification sont valides:
  - results[0].length === 1 : Vérifie qu'un seul utilisateur a été trouvé.
  - results[0][0].Password === password : Vérifie que le mot de passe stocké dans la BD
  correspond au mot de passe fourni en paramètre.
  */
  areValid: async function (email, password) {
    const query = 'SELECT Password FROM Utilisateur WHERE Email = ?';
    try {
      const [results] = await db.query(query, [email]);
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

  // CREATE : Fonction pour créer un utilisateur (candidat)
  create: async function (phone, lastName, firstName, status, password, email) {
    const query = 'INSERT INTO Utilisateur (Phone, LastName, FirstName, Status, Password, Email) VALUES (?, ?, ?, ?, ?, ?)';
    try {
      const result = await db.query(query, [phone, lastName, firstName, status, password, email]);
      return result.insertId;
    } catch (err) {
      console.error('Erreur MySQL : ', err);
      throw err;
    }
  },

    // UPDATE : Fonction pour mettre à jour un utilisateur 
    update : async function (userId, user) {
      const query = 'UPDATE Candidat SET Name = ?, Email = ?, Password = ? WHERE Id = ?';
      try {
        await db.query(query, [user.name, user.email, user.password, userId]);
      } catch (err) {
        console.error('Erreur MySQL : ', err);
        throw err;
      }
    },
  
    // Fonction pour supprimer un utilisateur (candidat)
    deleteUser: async function (email) {
      const query = 'DELETE FROM Utilisateur WHERE Email = ?';
      try {
        await db.query(query, [email]);
      } catch (err) {
        console.error('Erreur MySQL : ', err);
        throw err;
      }
    }

}





