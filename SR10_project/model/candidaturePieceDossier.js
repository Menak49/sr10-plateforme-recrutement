const db = require('./db.js');
const util = require('util');

db.query = util.promisify(db.query);

module.exports = {
    create: async function(candidatureId, pieceDossierId) {
        const query = `
        INSERT INTO CandidaturePieceDossier (Candidature, PieceDossier)
        VALUES (?, ?)
        `;
        try {
        const result = await db.query(query, [candidatureId, pieceDossierId]);
        return result.insertId;
        } catch (err) {
        console.error('Erreur lors de l\'ajout dans CandidaturePieceDossier :', err);
        throw err;
        }
    }

};
