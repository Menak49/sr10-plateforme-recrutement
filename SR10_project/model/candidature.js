const db = require('./db.js');
const util = require('util');

db.query = util.promisify(db.query);

module.exports = {

    getCandidaturesByUserId : async function(userId) {
        const query = `
        SELECT 
            c.Id AS candidature_id,
            DATE_FORMAT(c.Date, '%d/%m/%Y') AS date_candidature,
            f.Title AS titre,
            org.Name AS organisation,
            f.Location AS localisation,
            sp.Name AS contrat,
            GROUP_CONCAT(pd.Name, '::', pd.Chemin SEPARATOR '||') AS pieces
        FROM Candidature c
        JOIN OffreEmploi o ON c.OffreEmploi = o.Id
        JOIN FichePoste f ON o.FichePoste = f.Id
        JOIN Organisation org ON f.Organisation = org.Siren
        LEFT JOIN StatutPoste sp ON f.StatutPoste = sp.Name
        LEFT JOIN CandidaturePieceDossier cpd ON c.Id = cpd.Candidature
        LEFT JOIN PieceDossier pd ON cpd.PieceDossier = pd.Id
        WHERE c.Candidat = ?
        GROUP BY c.Id, f.Title, org.Name, f.Location, sp.Name, c.Date
        ORDER BY c.Date DESC `;
        try {
            const results = await db.query(query, [userId]);
            return results;
        } catch (err) {
            console.error('Erreur lors de la récupération des candidatures (Modèle) :', err);
            throw err;
        }
    
}}