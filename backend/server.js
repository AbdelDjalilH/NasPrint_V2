// Ce fichier sert à générer un serveur express qui écoute sur un port donné
// Ce fichier définit des routes d'accès pour mon API (endponts)
// Ce fichier ouvre une connexion vers une base de donnée Mysql

const express = require("express");
const cors = require("cors");

const app = express ();

const mysql = require("mysql");

const PORT = 3335;

const pool = mysql.createPool({
    host: "localhost",
    user: "adja",
    password: "hamzaoui",
    database : "Nas_Print_BDD"
})

app.get("/", (req, res) => {
    res.send("Hello world!")
});

app.get("/toto" (req,res) =>{
    res.json({message: "toto le plus beau"});
})

app.get("/users", (req,res) => {
    SELECT * FROM users;
    return
})

app.listen(PORT, () => {
    console.log(`j'écoute sur le port ${PORT}`);
});
