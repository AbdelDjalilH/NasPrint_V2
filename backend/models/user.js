const {pool} = require("../database/db-connection");

const findOneByEmail = async (email) => {
    const [rows] = await pool.query("SELECT * FROM users WHERE email = ?", [
        email,
    ]);
    
    
    return rows.length > 0 ? rows[0] : null; 
};

module.exports = { findOneByEmail };

