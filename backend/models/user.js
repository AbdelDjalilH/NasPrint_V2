const pool = require("../database/db-connection");

const findOneByEmail = async (email) => {
    const [rows] = await pool.query("SELECT * FROM users WHERE email = ?", [
        email,
    ]);

    return rows;
};

module.exports = findOneByEmail;