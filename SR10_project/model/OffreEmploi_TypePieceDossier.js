const db = require('./db.js');
const util = require('util');



db.query = util.promisify(db.query);

module.exports = {
    
    getTypesByOffreId: async function(offreId) {
    const query = `
        SELECT TypePiece
        FROM OffreEmploi_TypePieceDossier oetpd
        JOIN TypePieceDossier tpd ON oetpd.TypePiece = tpd.Name
        WHERE oetpd.OffreId = ?
    `;
    try {
        const results = await db.query(query, [offreId]);
        return results;
    } catch (err) {
        console.error('Erreur lors de la récupération des types de pièces pour l\'offre :', err);
        throw err;
    }
},

addTypesToOffre: async function(offreId, typePieceNames) {
    if (!Array.isArray(typePieceNames) || typePieceNames.length === 0) return;
    const values = typePieceNames.map(name => [offreId, name]);
    const query = `
        INSERT INTO OffreEmploi_TypePieceDossier (OffreId, TypePiece)
        VALUES ?
    `;
    try {
        await db.query(query, [values]);
    } catch (err) {
        console.error('Erreur lors de l\'association des types de pièces à l\'offre :', err);
        throw err;
    }
},
deleteByOffreId: async function(offreId) {
    const query = `
        DELETE FROM OffreEmploi_TypePieceDossier
        WHERE OffreId = ?
    `;
    try {
        await db.query(query, [offreId]);
    } catch (err) {
        console.error('Erreur lors de la suppression des types de pièces pour l\'offre :', err);
        throw err;
    }
},
}