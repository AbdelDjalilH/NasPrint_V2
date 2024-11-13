const router = require("express").Router();
const { pool } = require("../database/db-connection"); // Importation correcte du pool
 // Importation de Nodemailer

// Route pour récupérer tous les paiements
router.get("/", async (req, res) => {
    try {
        const [payments] = await pool.execute("SELECT * FROM payments");
        res.json(payments);
    } catch (err) {
        res.status(500).json({ error: "Erreur lors de la récupération des paiements" });
    }
});

// Route pour récupérer un paiement par ID
router.get("/:id", async (req, res) => {
    try {
        const [payments] = await pool.execute("SELECT * FROM payments INNER JOIN users ON payments.user_id = users.id WHERE payments.id = ?", [req.params.id]);
        if (payments.length === 0) {
            return res.status(404).json({ message: "Paiement non trouvé" });
        }
        res.json(payments[0]);
    } catch (err) {
        res.status(500).json({ error: "Erreur lors de la récupération du paiement" });
    }
});

// Route pour créer un nouvel paiement
router.post("/", async (req, res) => {
    const { rising, payment_date, payment_mean, payment_status, user_id } = req.body;

    // Vérifier que tous les champs, y compris user_id, sont présents
    if (!rising || !payment_date || !payment_mean || !payment_status || !user_id) {
        return res.status(400).json({ message: "Tous les champs sont requis, y compris user_id" });
    }

    try {
        const [result] = await pool.execute(
            "INSERT INTO payments (rising, payment_date, payment_mean, payment_status, user_id) VALUES (?, ?, ?, ?, ?)",
            [rising, payment_date, payment_mean, payment_status, user_id]
        );
        res.status(201).json({ message: "paiement créé", id: result.insertId });
    } catch (err) {
        console.error("Erreur lors de la création du paiement :", err);  // Affiche l'erreur dans la console
        res.status(500).json({ error: "Erreur lors de la création du paiement" });
    }
});

// Route pour mettre à jour un paiement
router.put("/:id", async (req, res) => {
    const { rising, payment_date, payment_mean, payment_status } = req.body;

    console.log("Requête PUT reçue pour paiement avec ID:", req.params.id);
    console.log("Corps de la requête:", req.body);

    if (!rising || !payment_date || !payment_mean || !payment_status) {
        console.error("Données manquantes dans la requête");
        return res.status(400).json({ message: "Tous les champs sont requis" });
    }

    try {
        const [payments] = await pool.execute("SELECT * FROM payments WHERE id = ?", [req.params.id]);
        if (payments.length === 0) {
            console.error("Paiement non trouvé pour ID:", req.params.id);
            return res.status(404).json({ message: "Paiement non trouvé" });
        }

        await pool.execute(
            "UPDATE payments SET rising = ?, payment_date = ?, payment_mean = ?, payment_status = ? WHERE id = ?",
            [rising, payment_date, payment_mean, payment_status, req.params.id]
        );

        console.log("Paiement mis à jour avec succès pour ID:", req.params.id);
        res.json({ message: "Paiement mis à jour" });
    } catch (err) {
        console.error("Erreur lors de la mise à jour :", err);
        res.status(500).json({ error: "Erreur lors de la mise à jour du paiement" });
    }
});

// Route pour supprimer un paiement
router.delete("/:id", async (req, res) => {
    try {
        const [payments] = await pool.execute("SELECT * FROM payments WHERE id = ?", [req.params.id]);

        if (payments.length === 0) {
            return res.status(404).json({ message: "Paiement non trouvé" });
        }

        await pool.execute("DELETE FROM payments WHERE id = ?", [req.params.id]);
        res.json({ message: "Paiement supprimé" });
    } catch (err) {
        res.status(500).json({ error: "Erreur lors de la suppression du paiement" });
    }
});

module.exports = router;
