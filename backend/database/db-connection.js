// Ce fichier ouvre une connexion vers une base de donnée Mysql


const argon2 = require("argon2");
const mysql = require("mysql2/promise");

const pool = mysql.createPool({
    host: "localhost",
    user: "adja",
    password: "hamzaoui",
    database: "nas_print_bdd",
});

async function addUser(email, username, password) {
    const connection = await pool.getConnection();
    
    // try {
    //     // Hacher le mot de passe
    //     const hashedPassword = await argon2.hash(password);
        
    //     // Insérer l'utilisateur dans la base de données
    //     const sql = "INSERT INTO users (email, password, username, lastname) VALUES (?, ?, ?, ?)";
    //     await connection.execute(sql, [email, username,hashedPassword ]);
        
    //     console.log("Utilisateur ajouté avec succès.");
    // } catch (err) {
    //     console.error("Erreur lors de l'insertion :", err.message);
    // } finally {
    //     connection.release();
    // }
}

// Exemple d'utilisation
addUser("utilisateur@example.com", "monMotDePasse", "monPseudo", "MonNom");




module.exports = pool;