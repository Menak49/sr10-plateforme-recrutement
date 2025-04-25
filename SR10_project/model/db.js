


var mysql = require("mysql");
var pool = mysql.createPool({
host: "tuxa.sme.utc", //ou localhost
user: "sr10p029",
password: "",
database: "sr10p029"
});
module.exports = pool;
/*
var pool = mysql.createPool({
    host: "localhost", 
    user: "root",
    port: 3036,
    password: "",
    database: "sr10p029"
    });
    module.exports = pool;*/
    