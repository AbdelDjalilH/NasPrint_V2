// Ce fichier ouvre une connexion vers une base de donnée Mysql

const mysql = require("mysql2");

const pool = mysql.createPool({
    host: "localhost",
    user: "adja",
    password: "hamzaoui",
    database: "nas_print_bdd",
});

module.exports = pool;