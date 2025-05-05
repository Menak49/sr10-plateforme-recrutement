const db = require('./db.js');
const util = require('util');

db.query = util.promisify(db.query);

module.exports = {

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
    
    }

}