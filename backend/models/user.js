const { pool } = require("../database/db-connection");

// Fonction pour trouver un utilisateur par email
const findOneByEmail = async (email) => {
    try {
        const [rows] = await pool.query("SELECT * FROM users WHERE email = ?", [email]);
        console.log("Résultat de la requête : ", rows); // Log du résultat de la requête
        return rows.length > 0 ? rows[0] : null; // Retourne le premier utilisateur trouvé ou null
    } catch (error) {
        console.error("Erreur lors de la requête SQL : ", error);
        throw error; // Lever une erreur en cas de problème
    }
};

// Fonction pour créer un utilisateur
const createUser = async ({ email, password, username }) => {
    const connection = await pool.getConnection();
    try {
        const [result] = await connection.query(
            "INSERT INTO users (email, password, username) VALUES (?, ?, ?)",
            [email, password, username]
        );
        return result.insertId; // Retourner l'ID de l'utilisateur créé
    } catch (error) {
        console.error("Erreur lors de la création de l'utilisateur :", error);
        throw new Error("Erreur lors de la création de l'utilisateur");
    } finally {
        connection.release();
    }
};


// Fonction pour mettre à jour un utilisateur (à décommenter et compléter si nécessaire)
const edit = async (id, user) => {
    try {
        const [result] = await pool.query(
            "UPDATE users SET email = ?, username = ?, password = ?, role = ?, inscription_date = ? WHERE id = ?",
            [user.email, user.username, user.password, user.role, user.inscription_date, id]
        );
        return result.affectedRows; // Retourne le nombre de lignes affectées
    } catch (error) {
        console.error("Erreur lors de la mise à jour de l'utilisateur : ", error);
        throw error; // Lever une erreur en cas de problème
    }
};

// Fonction pour supprimer un utilisateur
const destroy = async (id) => {
    try {
        const [result] = await pool.query("DELETE FROM users WHERE id = ?", [id]);
        return result.affectedRows; // Retourne le nombre de lignes affectées
    } catch (error) {
        console.error("Erreur lors de la suppression de l'utilisateur : ", error);
        throw error; // Lever une erreur en cas de problème
    }
};

module.exports = { findOneByEmail, createUser, edit, destroy };
