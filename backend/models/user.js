const { pool } = require("../database/db-connection");

// Fonction pour trouver un utilisateur par email
const findOneByEmail = async (email) => {
    try {
        const [rows] = await pool.query("SELECT * FROM users WHERE email = ?", [email]);
        console.log("Résultat de la requête : ", rows); // Log du résultat de la requête
        return rows.length > 0 ? rows[0] : null;
    } catch (error) {
        console.error("Erreur lors de la requête SQL : ", error);
        throw error; // Lever une erreur en cas de problème
    }
};


// Fonction pour créer un utilisateur
const createUser = async ({ email, password, username }) => {
    const [result] = await pool.query(
        "INSERT INTO users (email, password, username) VALUES (?, ?, ?)",
        [email, password, username]
    );
    
    // Retourner l'ID de l'utilisateur nouvellement créé
    return result.insertId;
};

module.exports = { findOneByEmail, createUser };
