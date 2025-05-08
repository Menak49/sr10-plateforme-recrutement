const db = require('./db.js');
const util = require('util');

db.query = util.promisify(db.query);

module.exports = {

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

    readAllBis: async function(){
        const query = `
        SELECT 
            fp.Id,
            fp.Title, 
            org.Name AS organisation
        FROM FichePoste fp
        JOIN Organisation org ON fp.Organisation = org.Siren
        `;
        try{
            const results = await db.query(query);
            return results;
        }
        catch(err){
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
      }
      
      
    
      

}