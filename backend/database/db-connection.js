const argon2 = require("argon2");
const mysql = require("mysql2/promise");

const pool = mysql.createPool({
    host: "localhost",
    user: "adja",
    password: "hamzaoui",
    database: "nas_print_bdd",
});

async function addUserOrUpdate(email, username, password) {
    const connection = await pool.getConnection();
    
    try {
        const [rows] = await connection.execute('SELECT * FROM users WHERE email = ?', [email]);
        
        
        const hashedPassword = await argon2.hash(password);
        
        
        if (rows.length > 0) {
            const sqlUpdate = "UPDATE users SET username = ?, password = ? WHERE email = ?";
            await connection.execute(sqlUpdate, [username, hashedPassword, email]);
            console.log("Utilisateur mis à jour avec succès.");
        } else {
        
            const sqlInsert = "INSERT INTO users (email, username, password) VALUES (?, ?, ?)";
            await connection.execute(sqlInsert, [email, username, hashedPassword]);
            console.log("Nouvel utilisateur ajouté avec succès.");
        }
    } catch (err) {
        console.error("Erreur lors de l'opération :", err.message);
    } finally {
        connection.release();
    }
}

module.exports = { pool, addUserOrUpdate }; 













































// async function addUser(email, username, password) {
//     const connection = await pool.getConnection();
    
//     try {
//         // Hacher le mot de passe
//         const hashedPassword = await argon2.hash(password);
        
//         // Insérer l'utilisateur dans la base de données
//         const sql = "INSERT INTO users (email, username, password) VALUES (?, ?, ?)";

//         await connection.execute(sql, [email, username,hashedPassword ]);
        
//         console.log("Utilisateur ajouté avec succès.");
//     } catch (err) {
//         console.error("Erreur lors de l'insertion :", err.message);
//     } finally {
//         connection.release();
//     }
// }

// // Exemple d'utilisation
// addUser("adj@adj.com", "adj", "Iamthebest");





// module.exports = pool;