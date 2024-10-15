// Ce fichier ouvre une connexion vers une base de donnée Mysql



const mysql = require("mysql2/promise");

const pool = mysql.createPool({
    host: "localhost",
    user: "adja",
    password: "hamzaoui",
    database: "nas_print_bdd",
});

pool.getConnection()
    .then(connection => {
        console.log("Connected to the database.");
        connection.release();
    })
    .catch(err => {
        console.error("Database connection failed:", err.message);
    });



module.exports = pool;