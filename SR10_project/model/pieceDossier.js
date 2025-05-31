const db = require('./db.js');
const util = require('util');

db.query = util.promisify(db.query);

module.exports = {


create: async function(name, chemin, type) {
    const query = `
      INSERT INTO PieceDossier (Name, Chemin, Type)
      VALUES (?, ?, ?)
    `;
    try {
      const result = await db.query(query, [name, chemin, type]);
      return result.insertId;
    } catch (err) {
      console.error('Erreur lors de l\'ajout de la pièce dossier :', err);
      throw err;
    }
  }
};
