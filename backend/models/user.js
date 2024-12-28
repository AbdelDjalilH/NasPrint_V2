const { pool } = require("../database/db-connection");


const findOneByEmail = async (email) => {
    try {
        const [rows] = await pool.query("SELECT * FROM users WHERE email = ?", [email]);
        console.log("Résultat de la requête : ", rows); 
        return rows.length > 0 ? rows[0] : null; 
    } catch (error) {
        console.error("Erreur lors de la requête SQL : ", error);
        throw error; 
    }
};


const createUser = async ({ email, password, username }) => {
    const connection = await pool.getConnection();
    try {
        const [result] = await connection.query(
            "INSERT INTO users (email, password, username) VALUES (?, ?, ?)",
            [email, password, username]
        );
        return result.insertId; 
    } catch (error) {
        console.error("Erreur lors de la création de l'utilisateur :", error);
        throw new Error("Erreur lors de la création de l'utilisateur");
    } finally {
        connection.release();
    }
};



const edit = async (id, user) => {
    try {
        const [result] = await pool.query(
            "UPDATE users SET email = ?, username = ?, password = ?, role = ?, inscription_date = ? WHERE id = ?",
            [user.email, user.username, user.password, user.role, user.inscription_date, id]
        );
        return result.affectedRows; 
    } catch (error) {
        console.error("Erreur lors de la mise à jour de l'utilisateur : ", error);
        throw error; 
    }
};


const destroy = async (id) => {
    try {
        const [result] = await pool.query("DELETE FROM users WHERE id = ?", [id]);
        return result.affectedRows; 
    } catch (error) {
        console.error("Erreur lors de la suppression de l'utilisateur : ", error);
        throw error; 
    }
};

module.exports = { findOneByEmail, createUser, edit, destroy };
