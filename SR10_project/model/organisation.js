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
    }
}