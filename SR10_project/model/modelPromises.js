const db = require('./db.js');
const util = require('util');

// Promisify the db.query method
const query = util.promisify(db.query).bind(db);


//définition de fonctions qui vont être appelées dans le controller

module.exports = {
    read: async function (email) {
        try {
            const results = await query("SELECT * FROM Utilisateur WHERE email = ?", email);
            return results;
        } catch (err) {
            throw err;
        }
    },

    readall: async function () {
        try {
            const results = await query("SELECT * FROM Utilisateur");
            return results;
        } catch (err) {
            throw err;
        }
    },

    areValid: async function (email, password) {
        try {
            const sql = "SELECT pwd FROM USERS WHERE email = ?";
            const results = await query(sql, email);

            if (results.length === 1 && results[0].pwd === password) {
                return true;
            } else {
                return false;
            }
        } catch (err) {
            throw err;
        }
    },

    creat: async function (email, nom, prenom, pwd, type) {
        try {
            // TODO: Implement the creation logic
            return false;
        } catch (err) {
            throw err;
        }
    }
};