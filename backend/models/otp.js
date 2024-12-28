const { pool } = require("../database/db-connection");

async function saveOtp(email, otp) {
    try {
        const expirationTime = new Date(Date.now() + 5 * 60 * 1000);
        const result = await pool.query(
            'INSERT INTO otps (email, otp, expires_at) VALUES (?, ?, ?)',
            [email, otp, expirationTime]
        );
        console.log("OTP enregistré :", result);
    } catch (error) {
        console.error("Erreur lors de l'enregistrement de l'OTP :", error);
        throw error;
    }
}

async function findOtpByEmail(email) {
    try {
        const [rows] = await pool.query(
            'SELECT * FROM otps WHERE email = ? AND expires_at > NOW()',
            [email]
        );
        console.log("OTP trouvé :", rows);
        return rows[0];
    } catch (error) {
        console.error("Erreur lors de la récupération de l'OTP :", error);
        throw error;
    }
}

async function deleteOtp(email) {
    try {
        const result = await pool.query('DELETE FROM otps WHERE email = ?', [email]);
        console.log("OTP supprimé pour :", email, result);
    } catch (error) {
        console.error("Erreur lors de la suppression de l'OTP :", error);
        throw error;
    }
}

module.exports = {
    saveOtp,
    findOtpByEmail,
    deleteOtp,
};
