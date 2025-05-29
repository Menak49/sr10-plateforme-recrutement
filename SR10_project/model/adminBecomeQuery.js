const db = require('./db.js');
const util = require('util');

db.query = util.promisify(db.query);

module.exports = {

  create: async ({ user, message }) => {
    try {
        const query = 'INSERT INTO AdminBecomeQuery (Message, User) VALUES (?, ?)';
        const result = await db.query(query, [message, user]);
        return result
    } catch (err) {
        console.error('Erreur MySQL : ', err);
        throw err;
    }
}, 

  read : async function (User) {
      const query = `SELECT * FROM Utilisateur WHERE User = ?`;
      try {
          const result = await db.query(query, [User]);
          return result; 
      } catch (err) {
          console.error('Erreur lors de la lecture de l\'utilisateur :', err);
          throw err;
      }
    },
}