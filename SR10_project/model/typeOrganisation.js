const db = require('./db.js');
const util = require('util');

db.query = util.promisify(db.query);

module.exports = {
    readAll: async function() {
        const query = 'SELECT Name FROM TypeOrganisation ORDER BY Name ASC';
        return await db.query(query);
  }
}