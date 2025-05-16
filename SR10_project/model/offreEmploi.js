const db = require('./db.js');
const util = require('util');

db.query = util.promisify(db.query);

module.exports = {

  create: async (data) => {
    try {
        const { State, ExpiryDate, Details, Slots, FichePoste } = data;
        const query = 'INSERT INTO OffreEmploi (State, ExpiryDate, Details, Slots, FichePoste) VALUES (?, ?, ?, ?, ?)';
        const results = await db.query(query, [State, ExpiryDate, Details, Slots, FichePoste]);
        console.log('Offre d\'emploi créée avec succès:', results);
    } catch (error) {
        throw error;
    }
},


    read: async function (id) {
       const query = `
        SELECT 
            Id,
            FichePoste,
            State,
            DATE_FORMAT(ExpiryDate, '%Y-%m-%d') AS ExpiryDateFormatted,
            Details,
            Slots
        FROM OffreEmploi 
        WHERE Id = ?
        `;
        try {
            const result= await db.query(query, [id]);
            return result[0];
        } catch (err) {
            console.error('Erreur lors de la récupération de l\'offre d\'emploi (modèle):', err);
            throw err;
        }
    },
    
    readAll: async function(){
        const query = `
        SELECT 
            o.Id AS offre_id,
            f.Title AS titre,
            org.Name AS organisation,
            f.Location AS localisation,
            sp.Name AS contrat -- on suppose que StatutPoste = type de contrat
        FROM OffreEmploi o
        JOIN FichePoste f ON o.FichePoste = f.Id
        JOIN Organisation org ON f.Organisation = org.Siren
        LEFT JOIN StatutPoste sp ON f.StatutPoste = sp.Name
        WHERE o.State = 'Published'`;
        try {
            const results = await db.query(query);
            return results;
        } catch (err) {
            console.error('Erreur lors de la récupération des offres demploi (Modèle) :', err);
            throw err;
        }
    },

    readOffresFiltrePagine : async function (searchTerm, limit, offset){
        const query = `
        SELECT 
          o.Id AS id,
          o.State AS etat,
          o.ExpiryDate AS dateExpiration,
          o.Details AS details,
          o.Slots AS nombrePostes,
          fp.Title AS titre,
          fp.Supervisor AS superviseur,
          fp.Location AS localisation,
          fp.WorkSchedule AS horaire,
          fp.MinSalary AS minSalaire,
          fp.MaxSalary AS maxSalaire,
          fp.Description AS description,
          org.Name AS organisation,
          sp.Name AS statut,
          tm.Name AS typeMetier
        FROM OffreEmploi o
        LEFT JOIN FichePoste fp ON o.FichePoste = fp.Id
        LEFT JOIN Organisation org ON fp.Organisation = org.Siren
        LEFT JOIN StatutPoste sp ON fp.StatutPoste = sp.Name
        LEFT JOIN TypeMetier tm ON fp.Type = tm.Name
        WHERE fp.Title LIKE ? OR org.Name LIKE ?
        LIMIT ? OFFSET ?;
      `;
        try {
            const results = await db.query(query, [`%${searchTerm}%`, `%${searchTerm}%`, limit, offset]);
            return results;
        }
        catch (err) {
            console.error('Erreur lors de la récupération des offres demploi (Modèle) :', err);
            throw err;
        }
    },

    nbTotalOffres: async function (searchTerm){
        const countQuery = `
        SELECT COUNT(*) AS total
        FROM OffreEmploi o
        LEFT JOIN FichePoste fp ON o.FichePoste = fp.Id
        LEFT JOIN Organisation org ON fp.Organisation = org.Siren
        WHERE fp.Title LIKE ? OR org.Name LIKE ?;
        `;
        try {
            const countResult = await db.query(countQuery, [`%${searchTerm}%`, `%${searchTerm}%`]);
            return countResult; // Retourne le nombre total d'offres
        }
        catch (err) {
            console.error('Erreur lors de la récupération du nombre total d\'offres (Modèle) :', err);
            throw err;
        }
    },
    readOffresPourCandidat : async function (candidatId, searchTerm, limit, offset) {
        const query = `
          SELECT 
            o.Id AS id,
            o.State AS etat,
            o.ExpiryDate AS dateExpiration,
            o.Details AS details,
            o.Slots AS nombrePostes,
            fp.Title AS titre,
            fp.Supervisor AS superviseur,
            fp.Location AS localisation,
            fp.WorkSchedule AS horaire,
            fp.MinSalary AS minSalaire,
            fp.MaxSalary AS maxSalaire,
            fp.Description AS description,
            org.Name AS organisation,
            sp.Name AS statut,
            tm.Name AS typeMetier
          FROM OffreEmploi o
          LEFT JOIN FichePoste fp ON o.FichePoste = fp.Id
          LEFT JOIN Organisation org ON fp.Organisation = org.Siren
          LEFT JOIN StatutPoste sp ON fp.StatutPoste = sp.Name
          LEFT JOIN TypeMetier tm ON fp.Type = tm.Name
          WHERE o.State = 'Published'
            AND o.Id NOT IN (
              SELECT OffreEmploi FROM Candidature WHERE Candidat = ?
            )
            AND (fp.Title LIKE ? OR org.Name LIKE ?)
          LIMIT ? OFFSET ?;
        `;
        try {
            const results = await db.query(query, [candidatId, `%${searchTerm}%`, `%${searchTerm}%`, limit, offset]);
            return results;
        } catch (err) {
            console.error('Erreur lors de la récupération des offres pour le candidat (Modèle) :', err);
            throw err;
        }
    },
    countOffresPourCandidat: async function (candidatId, searchTerm) {
        const countQuery = `
          SELECT COUNT(*) AS total
          FROM OffreEmploi o
          LEFT JOIN FichePoste fp ON o.FichePoste = fp.Id
          LEFT JOIN Organisation org ON fp.Organisation = org.Siren
          WHERE o.State = 'Published'
            AND o.Id NOT IN (
              SELECT OffreEmploi FROM Candidature WHERE Candidat = ?
            )
            AND (fp.Title LIKE ? OR org.Name LIKE ?);
        `;
        try {
          const countResult = await db.query(countQuery, [candidatId, `%${searchTerm}%`, `%${searchTerm}%`]);
          return countResult[0].total;
        } catch (err) {
          console.error('Erreur lors du comptage des offres pour le candidat (Modèle) :', err);
          throw err;
        }
      },
      

    
    
    
    
}