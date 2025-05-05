const db = require('./db.js');
const util = require('util');

db.query = util.promisify(db.query);

module.exports = {

    readAll: async function () {
        const query = `
        SELECT Siren, Name 
        FROM Organisation
        ORDER BY Name ASC
        `;
        try {
            const results = await db.query(query);
            return results;
        } catch (err) {
            console.error('Erreur lors de la récupération des organisations (Modèle) :', err);
            throw err;
        }
    },

    /* getOrganisations: async function(searchTerm, limit, offset) {

        const searchCondition = searchTerm ?
          `WHERE o.Name LIKE ? OR o.Headquarters LIKE ? OR o.Type LIKE ? OR o.Status LIKE ?` :
          '';
      
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
      
        const queryParams = searchTerm ?
          [`%${searchTerm}%`, `%${searchTerm}%`, `%${searchTerm}%`, `%${searchTerm}%`, limit, offset] :
          [limit, offset];
      
        const results = await db.query(query, queryParams);
        return results;
      },
      
      getTotalOrganisations: async function (searchTerm) {
        const searchCondition = searchTerm ?
          `WHERE o.Name LIKE ? OR o.Headquarters LIKE ? OR o.Type LIKE ? OR o.Status LIKE ?` :
          '';
      
        const countQuery = `
          SELECT COUNT(*) AS total
          FROM Organisation o
          ${searchCondition}
        `;
      
        const countParams = searchTerm ?
          [`%${searchTerm}%`, `%${searchTerm}%`, `%${searchTerm}%`, `%${searchTerm}%`] :
          [];
      
        const countResults = await db.query(countQuery, countParams);
        return countResults
      } */
      


}