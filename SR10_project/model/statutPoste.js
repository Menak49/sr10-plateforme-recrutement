const db = require('./db.js');
const util = require('util');

db.query = util.promisify(db.query);

module.exports = {

    readAll: async function(){
        const query = 'SELECT * FROM StatutPoste'
        try {
            const results = await db.query(query);
            return results;
        } catch (err) {
        console.error('Erreur lors de la récupération des statuts de poste :', err);
        throw err;
        }
    }

}