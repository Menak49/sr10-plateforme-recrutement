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
          WHERE AdminBecomeQuery.Message LIKE ?
      
          UNION ALL
      
          SELECT 
            Utilisateur.FirstName AS nom,
            Utilisateur.Email AS email,
            RecruteurBecomeQuery.Message AS message,
            RecruteurBecomeQuery.Id AS id,
            'recruteur' AS type
          FROM RecruteurBecomeQuery
          JOIN Utilisateur ON RecruteurBecomeQuery.Candidat = Utilisateur.Phone
          WHERE RecruteurBecomeQuery.Message LIKE ?
      
          ORDER BY email ASC
          LIMIT ? OFFSET ?
        `;
        try {
          const rows = await db.query(query, [`%${searchTerm}%`, `%${searchTerm}%`, limit, offset]);
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
            WHERE AdminBecomeQuery.Message LIKE ?
      
            UNION ALL
      
            SELECT RecruteurBecomeQuery.Id
            FROM RecruteurBecomeQuery
            JOIN Utilisateur ON RecruteurBecomeQuery.Candidat = Utilisateur.Phone
            WHERE RecruteurBecomeQuery.Message LIKE ?
          ) AS unionTable
        `;
        try {
          const rows = await db.query(query, [`%${searchTerm}%`, `%${searchTerm}%`]);
          return rows;
        } catch (err) {
          console.error('Erreur lors du comptage des demandes avec UNION :', err);
          throw err;
        }
      },
}