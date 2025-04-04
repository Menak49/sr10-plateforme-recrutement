var db = require('./db.js');
module.exports = {
read: function (email, callback) {
db.query("select * from Utilisateur where email= ?",email, function
(err, results) {
if (err) throw err;
callback(results);
});
},
readall: function (callback) {
    const sql = "SELECT * FROM OffreEmploi"; // Requête SQL pour récupérer toutes les offres
    db.query(sql, function (err, results) {
      if (err) {
        return callback(err, null); // En cas d'erreur, transmettez l'erreur au callback
      }
      callback(null, results); // Transmettez les résultats au callback
    });
  },
areValid: function (email, password, callback) {
sql = "SELECT pwd FROM USERS WHERE email = ?";
rows = db.query(sql, email, function (err, results) {
if (err) throw err;
if (rows.length == 1 && rows[0].pwd === password) {
callback(true)
} else {
callback(false);
}
});
},
creat: function (email, nom, prenom, pwd, type, callback) {
//todo
return false;
}
}
