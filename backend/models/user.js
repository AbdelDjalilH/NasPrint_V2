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

// const browse = async () => {
//     const [rows] = await pool.query("SELECT * FROM users");
//     return rows[0];
// } 

// const edit = async (id, user) => {
//     const [result] = await pool.query("UPDATE users SET email = ?, username = ?,   password = ?, role = ?, inscription_date =?, WHERE id = ?"
//       [user.email,user.username,user.password,user.role,user.inscription_date, id]
//     );
//     return result.affectedRows;
// } 

// Fonction pour créer un utilisateur
const createUser = async ({ email, password, username }) => {
    const [result] = await pool.query(
        "INSERT INTO users (email, password, username) VALUES (?, ?, ?)",
        [email, password, username]
    );
    
    // Retourner l'ID de l'utilisateur nouvellement créé
    return result.insertId;
};

const destroy = async (id) => {
    const [result] = await pool.query("DELETE FROM USERS WHERE id = ?"
      [id]
    );
    return result.affectedRows;
}







module.exports = { findOneByEmail,
     createUser,
    //   browse,
    //    edit,
    //    destroy
    
    };
