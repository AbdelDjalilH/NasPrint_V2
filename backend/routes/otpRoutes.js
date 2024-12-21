const router = require("express").Router();
const { pool } = require("../database/db-connection"); // Importation du pool pour la base de données

// Route pour récupérer tous les OTPs
router.get("/", async (req, res) => {
    try {
        const [otps] = await pool.execute("SELECT * FROM otps");
        res.json(otps);
    } catch (err) {
        res.status(500).json({ error: "Erreur lors de la récupération des OTPs" });
    }
});

// Route pour récupérer un OTP par ID
router.get("/:id", async (req, res) => {
    try {
        const [otps] = await pool.execute("SELECT * FROM otps WHERE id = ?", [req.params.id]);
        if (otps.length === 0) {
            return res.status(404).json({ message: "OTP non trouvé" });
        }
        res.json(otps[0]);
    } catch (err) {
        res.status(500).json({ error: "Erreur lors de la récupération de l'OTP" });
    }
});

// Route pour créer un nouvel OTP
router.post("/", async (req, res) => {
    const { otp_code, user_id, expiration_date } = req.body;

    // Vérifier que tous les champs requis sont fournis
    if (!otp_code || !user_id || !expiration_date) {
        return res.status(400).json({ message: "Tous les champs (otp_code, user_id, expiration_date) sont requis" });
    }

    try {
        const [result] = await pool.execute(
            "INSERT INTO otps (otp_code, user_id, expiration_date) VALUES (?, ?, ?)",
            [otp_code, user_id, expiration_date]
        );
        res.status(201).json({ message: "OTP créé", id: result.insertId });
    } catch (err) {
        console.error("Erreur lors de la création de l'OTP :", err);
        res.status(500).json({ error: "Erreur lors de la création de l'OTP" });
    }
});

// Route pour mettre à jour un OTP
router.put("/:id", async (req, res) => {
    const { otp_code, expiration_date } = req.body;

    if (!otp_code || !expiration_date) {
        return res.status(400).json({ message: "Tous les champs (otp_code, expiration_date) sont requis" });
    }

    try {
        const [otps] = await pool.execute("SELECT * FROM otps WHERE id = ?", [req.params.id]);
        if (otps.length === 0) {
            return res.status(404).json({ message: "OTP non trouvé" });
        }

        await pool.execute(
            "UPDATE otps SET otp_code = ?, expiration_date = ? WHERE id = ?",
            [otp_code, expiration_date, req.params.id]
        );

        res.json({ message: "OTP mis à jour" });
    } catch (err) {
        console.error("Erreur lors de la mise à jour :", err);
        res.status(500).json({ error: "Erreur lors de la mise à jour de l'OTP" });
    }
});

// Route pour supprimer un OTP
router.delete("/:id", async (req, res) => {
    try {
        const [otps] = await pool.execute("SELECT * FROM otps WHERE id = ?", [req.params.id]);
        if (otps.length === 0) {
            return res.status(404).json({ message: "OTP non trouvé" });
        }

        await pool.execute("DELETE FROM otps WHERE id = ?", [req.params.id]);
        res.json({ message: "OTP supprimé" });
    } catch (err) {
        res.status(500).json({ error: "Erreur lors de la suppression de l'OTP" });
    }
});

module.exports = router;
