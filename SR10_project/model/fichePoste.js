const db = require('./db.js');
const util = require('util');

db.query = util.promisify(db.query);

module.exports = {

  create: async (data) => {
    try {
        const sql = `
        INSERT INTO FichePoste 
        (Title, Supervisor, Location, WorkSchedule, MinSalary, MaxSalary, Description, Organisation, StatutPoste, Recruteur, Type)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const params = [
        data.title,
        data.supervisor,
        data.location,
        data.workSchedule,
        data.minSalary,
        data.maxSalary,
        data.description,
        data.organisation,
        data.statutPoste,
        data.recruteur,
        data.type
    ];
    return db.query(sql, params);
    } catch (error) {
        throw error;
    }
},  

  delete: async function(ficheId) {
    const query = 'DELETE FROM FichePoste WHERE Id = ?';
    try {
      await db.query(query, [ficheId]);
    } catch (err) {
      console.error('Erreur lors de la suppression de la fiche de poste (Modèle) :', err);
      throw err;
    }
  },
  
    
  read: async function (ficheId){
        const query = 'SELECT * FROM FichePoste WHERE Id = ?'
        try{
            const result = await db.query(query,[ficheId])
            return result[0];
        }
        catch(err){
            console.error('Erreur lors de la récupération de la fiche de poste (Modèle) :', err);
            throw err;
        }
    },
    
    readAll: async function(){
        const query = `
        SELECT 
            fp.Id AS id,
            fp.Title AS titre,
            fp.Location AS localisation,
            fp.MinSalary AS minSalaire,
            fp.MaxSalary AS maxSalaire,
            fp.WorkSchedule AS horaire,
            fp.Description AS description,
            org.Name AS organisation,
            sp.Name AS statut,
            tm.Name AS typeMetier
        FROM FichePoste fp
        LEFT JOIN Organisation org ON fp.Organisation = org.Siren
        LEFT JOIN StatutPoste sp ON fp.StatutPoste = sp.Name
        LEFT JOIN TypeMetier tm ON fp.Type = tm.Name
        `;
        try {
            const results = await db.query(query);
            return results;
        } catch (err) {
            console.error('Erreur lors de la récupération des fiches de poste (Modèle) :', err);
            throw err;
        }
    
    },

    readAllBis: async function(recruteurId) {
    const orgQuery = `SELECT Organization FROM Recruteur WHERE User = ?`;
    try {
        const orgRows = await db.query(orgQuery, [recruteurId]);
        if (!orgRows[0] || !orgRows[0].Organization) return [];
        const organisation = orgRows[0].Organization;
        console.log('Organisation récupérée :', orgRows);
        const query = `
            SELECT 
                fp.Id,
                fp.Title, 
                org.Name AS organisation
            FROM FichePoste fp
            JOIN Organisation org ON fp.Organisation = org.Siren
            WHERE fp.Organisation = ?
        `;
        const results = await db.query(query, organisation);
        return results;
    } catch (err) {
        console.error('Erreur lors de la récupération des fiches de poste (Modèle) :', err);
        throw err;
    }
},
    readPage: async function(limit, offset) {
        const query = `
          SELECT 
            fp.Id AS id,
            fp.Title AS titre,
            fp.Location AS localisation,
            fp.MinSalary AS minSalaire,
            fp.MaxSalary AS maxSalaire,
            sp.Name AS statut,
            org.Name AS organisation
          FROM FichePoste fp
          LEFT JOIN Organisation org ON fp.Organisation = org.Siren
          LEFT JOIN StatutPoste sp ON fp.StatutPoste = sp.Name
          LIMIT ? OFFSET ?
        `;
        try {
          const results = await db.query(query, [limit, offset]);
          return results;
        } catch (err) {
          console.error('Erreur lors de la pagination des fiches de poste (Modèle) :', err);
          throw err;
        }
      },
      
      countAll: async function() {
        const query = `SELECT COUNT(*) AS count FROM FichePoste`;
        try {
          const rows = await db.query(query);
          return rows[0].count;
        } catch (err) {
          console.error('Erreur lors du comptage des fiches de poste (Modèle) :', err);
          throw err;
        }
      },
      searchPage: async function(search, limit, offset) {
        const like = `%${search}%`;
        const query = `
          SELECT 
            fp.Id AS id,
            fp.Title AS titre,
            fp.Location AS localisation,
            fp.MinSalary AS minSalaire,
            fp.MaxSalary AS maxSalaire,
            sp.Name AS statut,
            org.Name AS organisation
          FROM FichePoste fp
          LEFT JOIN Organisation org ON fp.Organisation = org.Siren
          LEFT JOIN StatutPoste sp ON fp.StatutPoste = sp.Name
          WHERE fp.Title LIKE ? OR org.Name LIKE ? OR sp.Name LIKE ?
          LIMIT ? OFFSET ?
        `;
        try {
          const results = await db.query(query, [like, like, like, limit, offset]);
          return results;
        } catch (err) {
          console.error('Erreur lors de la recherche paginée (Modèle) :', err);
          throw err;
        }
      },
      
      countSearch: async function(search) {
        const like = `%${search}%`;
        const query = `
          SELECT COUNT(*) AS count
          FROM FichePoste fp
          LEFT JOIN Organisation org ON fp.Organisation = org.Siren
          LEFT JOIN StatutPoste sp ON fp.StatutPoste = sp.Name
          WHERE fp.Title LIKE ? OR org.Name LIKE ? OR sp.Name LIKE ?
        `;
        try {
          const rows = await db.query(query, [like, like, like]);
          return rows[0].count;
        } catch (err) {
          console.error('Erreur lors du comptage pour la recherche (Modèle) :', err);
          throw err;
        }
      },
      getByUserId: async function(userId, limit, offset) {
  const query = `
    SELECT 
      fp.Id AS id,
      fp.Title AS titre,
      fp.Location AS localisation,
      fp.MinSalary AS minSalaire,
      fp.MaxSalary AS maxSalaire,
      sp.Name AS statut,
      org.Name AS organisation
    FROM FichePoste fp
    LEFT JOIN Organisation org ON fp.Organisation = org.Siren
    LEFT JOIN StatutPoste sp ON fp.StatutPoste = sp.Name
    WHERE fp.Recruteur = ?
    LIMIT ? OFFSET ?
  `;
  try {
    const results = await db.query(query, [userId, limit, offset]);
    return results;
  } catch (err) {
    console.error('Erreur lors de la récupération des fiches de poste par userId (Modèle) :', err);
    throw err;
  }
},countByUserId: async function(userId) {
  const query = `
    SELECT COUNT(*) AS count
    FROM FichePoste
    WHERE Recruteur = ?
  `;
  try {
    const rows = await db.query(query, [userId]);
    return rows[0].count;
  } catch (err) {
    console.error('Erreur lors du comptage des fiches de poste par userId (Modèle) :', err);
    throw err;
  }
},
searchByUserId: async function(userId, search, limit, offset) {
  const like = `%${search}%`;
  const query = `
    SELECT 
      fp.Id AS id,
      fp.Title AS titre,
      fp.Location AS localisation,
      fp.MinSalary AS minSalaire,
      fp.MaxSalary AS maxSalaire,
      sp.Name AS statut,
      org.Name AS organisation
    FROM FichePoste fp
    LEFT JOIN Organisation org ON fp.Organisation = org.Siren
    LEFT JOIN StatutPoste sp ON fp.StatutPoste = sp.Name
    WHERE fp.Recruteur = ?
      AND (fp.Title LIKE ? OR org.Name LIKE ? OR sp.Name LIKE ?)
    LIMIT ? OFFSET ?
  `;
  try {
    const results = await db.query(query, [userId, like, like, like, limit, offset]);
    return results;
  } catch (err) {
    console.error('Erreur lors de la recherche paginée par userId (Modèle) :', err);
    throw err;
  }
},

countSearchByUserId: async function(userId, search) {
  const like = `%${search}%`;
  const query = `
    SELECT COUNT(*) AS count
    FROM FichePoste fp
    LEFT JOIN Organisation org ON fp.Organisation = org.Siren
    LEFT JOIN StatutPoste sp ON fp.StatutPoste = sp.Name
    WHERE fp.Recruteur = ?
      AND (fp.Title LIKE ? OR org.Name LIKE ? OR sp.Name LIKE ?)
  `;
  try {
    const rows = await db.query(query, [userId, like, like, like]);
    return rows[0].count;
  } catch (err) {
    console.error('Erreur lors du comptage pour la recherche par userId (Modèle) :', err);
    throw err;
  }
}
      
    
      

}