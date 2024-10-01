// Ce fichier sert à générer un serveur express qui écoute sur un port donné
// Ce fichier définit des routes d'accès pour mon API (endponts)
// Ce fichier ouvre une connexion vers une base de donnée Mysql

const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");

const PORT = 3335;
const app = express();

app.use(express.json());
app.use(cors());

const pool = mysql.createPool({
    host: "localhost",
    user: "adja",
    password: "hamzaoui",
    database: "nas_print_bdd",
});

app.get("/", (req, res) => {
    res.send("Hello world!");
});

app.get("/toto", (req, res) => {
    res.json({ message: "toto le plus beau" });
});

app.get("/users", (req, res) => {
    pool.query("SELECT * FROM users", (err, users) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(users); 
    });
});

app.listen(PORT, () => {
    console.log(`j'écoute sur le port ${PORT}`);
});
