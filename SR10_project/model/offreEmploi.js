const db = require('./db.js');
const util = require('util');

db.query = util.promisify(db.query);

module.exports = {

    readall: async function(){
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
            return results; // Retourne tous les utilisateurs
        } catch (err) {
            console.error('Erreur lors de la récupération des offres demploi (Modèle) :', err);
            throw err;
        }
    }
    
}