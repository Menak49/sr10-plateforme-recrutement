const db = require('./db.js');
const util = require('util');

db.query = util.promisify(db.query);

module.exports = {

  create: async ({ user, message }) => {
    try {
        const query = 'INSERT INTO AdminBecomeQuery (Message, User) VALUES (?, ?)';
        const result = await db.query(query, [message, user]);
        return result
    } catch (err) {
        console.error('Erreur MySQL : ', err);
        throw err;
    }
}, 

  read : async function (User) {
      const query = `SELECT * FROM Utilisateur WHERE User = ?`;
      try {
          const result = await db.query(query, [User]);
          return result; 
      } catch (err) { 
          console.error('Erreur lors de la lecture de l\'utilisateur :', err);
          throw err;
      }
    },
    readAllFiltrePagine: async function(searchTerm, limit, offset) {
      const query = `
        SELECT 
        Utilisateur.FirstName AS nom,
        Utilisateur.Email AS email,
        AdminBecomeQuery.Message AS message,
        AdminBecomeQuery.Id AS id
      FROM AdminBecomeQuery
      JOIN Utilisateur ON AdminBecomeQuery.User = Utilisateur.Phone
      WHERE AdminBecomeQuery.Message LIKE ?
      ORDER BY Utilisateur.Email ASC
      LIMIT ? OFFSET ?
      `;
      try {
        const rows = await db.query(query, [`%${searchTerm}%`, limit, offset]);
        return rows;
      } catch (err) {
        console.error('Erreur lors de la récupération paginée des demandes admin avec jointure :', err);
        throw err;
      }
    },
    
      count: async function(searchTerm) {
        const query = `
          SELECT COUNT(*) AS total
          FROM AdminBecomeQuery
          WHERE Message LIKE ?
        `;
        try {
          const rows = await db.query(query, [`%${searchTerm}%`]);
          return rows;
        } catch (err) {
          console.error('Erreur lors du comptage des demandes admin :', err);
          throw err;
        }
      },
      readAllFiltrePagineUnion: async function(searchTerm, limit, offset) {
        const query = `
          SELECT 
            Utilisateur.FirstName AS nom,
            Utilisateur.Email AS email,
            AdminBecomeQuery.Message AS message,
            AdminBecomeQuery.Id AS id,
            'admin' AS type
          FROM AdminBecomeQuery
          JOIN Utilisateur ON AdminBecomeQuery.User = Utilisateur.Phone
          WHERE AdminBecomeQuery.Message LIKE ? OR Utilisateur.Email LIKE ? OR Utilisateur.FirstName LIKE ? OR Utilisateur.LastName LIKE ?
      
          UNION ALL
      
          SELECT 
            Utilisateur.FirstName AS nom,
            Utilisateur.Email AS email,
            RecruteurBecomeQuery.Message AS message,
            RecruteurBecomeQuery.Id AS id,
            'recruteur' AS type
          FROM RecruteurBecomeQuery
          JOIN Utilisateur ON RecruteurBecomeQuery.Candidat = Utilisateur.Phone
          WHERE RecruteurBecomeQuery.Message LIKE ? OR Utilisateur.Email LIKE ? OR Utilisateur.FirstName LIKE ? OR Utilisateur.LastName LIKE ?
      
          ORDER BY email ASC
          LIMIT ? OFFSET ?
        `;
        try {
          const rows = await db.query(query, [
            `%${searchTerm}%`, `%${searchTerm}%`, `%${searchTerm}%`, `%${searchTerm}%`,
            `%${searchTerm}%`, `%${searchTerm}%`, `%${searchTerm}%`, `%${searchTerm}%`,
            limit, offset
          ]);
          return rows;
        } catch (err) {
          console.error('Erreur lors de la récupération paginée des demandes avec UNION :', err);
          throw err;
        }
      },
      countUnion: async function(searchTerm) {
        const query = `
          SELECT COUNT(*) AS total FROM (
            SELECT AdminBecomeQuery.Id
            FROM AdminBecomeQuery
            JOIN Utilisateur ON AdminBecomeQuery.User = Utilisateur.Phone
            WHERE AdminBecomeQuery.Message LIKE ? OR Utilisateur.Email LIKE ? OR Utilisateur.FirstName LIKE ? OR Utilisateur.LastName LIKE ?
      
            UNION ALL
      
            SELECT RecruteurBecomeQuery.Id
            FROM RecruteurBecomeQuery
            JOIN Utilisateur ON RecruteurBecomeQuery.Candidat = Utilisateur.Phone
            WHERE RecruteurBecomeQuery.Message LIKE ? OR Utilisateur.Email LIKE ? OR Utilisateur.FirstName LIKE ? OR Utilisateur.LastName LIKE ?
          ) AS unionTable
        `;
        try {
          const rows = await db.query(query, [
            `%${searchTerm}%`, `%${searchTerm}%`, `%${searchTerm}%`, `%${searchTerm}%`,
            `%${searchTerm}%`, `%${searchTerm}%`, `%${searchTerm}%`, `%${searchTerm}%`
          ]);
          return rows; 
        } catch (err) {
          console.error('Erreur lors du comptage des demandes avec UNION :', err);
          throw err;
        }
      },
      accepterDemande: async function(demandeId) {
        try {
            // Récupérer les informations de l'utilisateur à partir de la demande
            const rows = await db.query(
                'SELECT User FROM AdminBecomeQuery WHERE Id = ?', [demandeId]
            );
            if (!rows[0]) throw new Error('Demande non trouvée');
            const userId = rows[0].User;

            // Ajouter dans la table Admin
            await db.query('INSERT INTO Administrateur (User) VALUES (?)', [userId]);

            // Supprimer la demande de la table AdminBecomeQuery
            await db.query('DELETE FROM AdminBecomeQuery WHERE Id = ?', [demandeId]);
        } catch (err) {
            console.error('Erreur lors de l\'acceptation de la demande admin (Modèle) :', err);
            throw err;
        }
    },
    // Fonction pour refuser une demande d'admin
    deleteById: async function(id) {
      const query = `DELETE FROM AdminBecomeQuery WHERE Id = ?`;
      try {
          await db.query(query, [id]);
      } catch (err) {
          console.error('Erreur lors de la suppression de la demande admin (Modèle) :', err);
          throw err;
      }
  },
}