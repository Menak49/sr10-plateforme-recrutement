const db = require('./db.js');
const util = require('util');

db.query = util.promisify(db.query);

module.exports = {

    readAll: async function(){
        const query = 'SELECT * FROM TypeMetier'
        try {
            const results = await db.query(query);
            return results;
        } catch (err) {
        console.error('Erreur lors de la récupération des types de métier :', err);
        throw err;
        }
    }

}