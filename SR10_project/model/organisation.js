const db = require('./db.js');
const util = require('util');

db.query = util.promisify(db.query);

module.exports = {

  create: async function(siren, name, headquarters, type, creator) {
  const query = `
    INSERT INTO Organisation (Siren, Name, Headquarters, Status, Type, Creator)
    VALUES (?, ?, ?, 'StandBy', ?, ?)
  `;
  try {
    const result = await db.query(query, [siren, name, headquarters, type, creator]);
    return result;
  } catch (err) {
    console.error('MODELE : Erreur lors de la création de l\'organisation :', err);
    throw err;
  }
},
  
  
  read: async function (recruteurPhone) {
      /*permet de récupérer l'organisation à laquelle appartient un recruteur*/
    const query = `
        SELECT o.*
        FROM Organisation o
        JOIN Recruteur r ON o.Siren = r.Organization
        WHERE r.User = ?
    `;
    try{
      const result = await db.query(query, [recruteurPhone]);
      return result;
    } catch (err) {
      console.error('Erreur lors de la récupération de l organisation associée au recruteur :', err);
      throw err;
    }
    
    },

    readAll: async function () {
        const query = `
        SELECT Siren, Name 
        FROM Organisation
        WHERE Status = 'Valide'
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

    readAllFiltréPaginé: async function(searchTerm, limit, offset) {
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
      `;
      
      const queryParams = searchTerm
      ? [`%${searchTerm}%`, `%${searchTerm}%`, `%${searchTerm}%`, `%${searchTerm}%`, limit, offset]
      : [limit, offset];
      
      try {
        const results = await db.query(query, queryParams);
        return results;
      }
      catch (err) {
          console.error('Erreur lors de la récupération des recruteurs(Modèle) :', err);
          throw err;
      }
    },
      
    count: async function (searchTerm) {
      const searchCondition = searchTerm ?
        `WHERE o.Name LIKE ? OR o.Headquarters LIKE ? OR o.Type LIKE ? OR o.Status LIKE ?` :
        '';
    
      const countQuery = `
      SELECT COUNT(*) AS total
      FROM Organisation o
      ${searchCondition}
      `;
      
      const countParams = searchTerm
        ? [`%${searchTerm}%`, `%${searchTerm}%`, `%${searchTerm}%`, `%${searchTerm}%`]
        : [];
      
      try {
        const results = await db.query(countQuery, countParams);
        return results[0].total;
      } catch (err) {
        console.error('Erreur lors de la récupération du nombre total de recruteurs (Modèle) :', err);
        throw err;
      }
    },
    updateStatut: async function(siren, statut) {
  const query = `UPDATE Organisation SET Status = ? WHERE Siren = ?`;
  try {
    await db.query(query, [statut, siren]);
  } catch (err) {
    throw err;
  }
},

deleteByID: async function(siren) {
  const query = `DELETE FROM Organisation WHERE Siren = ?`;
  try {
    await db.query(query, [siren]);
  } catch (err) {
    throw err;
  }
},
setCreatorNull: async function(idUser) {
  const query = `UPDATE Organisation SET Creator = NULL WHERE Creator = ?`;
  try {
    await db.query(query, [idUser]);
  } catch (err) {
    throw err;
  }
}
      


}