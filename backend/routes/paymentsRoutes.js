const router = require("express").Router();
const { pool } = require("../database/db-connection"); // Import correct du pool

// Route pour récupérer tous les paiements
router.get("/", async (req, res) => {
    try {
        const [payments] = await pool.execute("SELECT * FROM payments"); // Utilise execute()
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
            return res.status(404).json({ message: "paiement non trouvé" });
        }
        res.json(payments[0]); // Retourner un seul paiement
    } catch (err) {
        res.status(500).json({ error: "Erreur lors de la récupération de l'paiement" });
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
// Route pour mettre à jour un paiement
router.put("/:id", async (req, res) => {
    const { rising, payment_date, payment_mean, payment_status } = req.body;

    // Vérification que tous les champs nécessaires sont présents
    if (!rising || !payment_date || !payment_mean || !payment_status) {
        return res.status(400).json({ message: "Tous les champs sont requis" });
    }

    try {
        // Vérifier si le paiement existe
        const [payments] = await pool.execute("SELECT * FROM payments WHERE id = ?", [req.params.id]);

        if (payments.length === 0) {
            return res.status(404).json({ message: "paiement non trouvé" });
        }

        // Mettre à jour le paiement
        await pool.execute(
            "UPDATE payments SET  rising = ?, payment_date = ?, payment_mean = ?, payment_status = ? WHERE id = ?",
            [rising, payment_date, payment_mean, payment_status, req.params.id]
        );

        res.json({ message: "paiement mis à jour" });
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
            return res.status(404).json({ message: "paiement non trouvé" });
        }

        await pool.execute("DELETE FROM payments WHERE id = ?", [req.params.id]);
        res.json({ message: "paiement supprimé" });
    } catch (err) {
        res.status(500).json({ error: "Erreur lors de la suppression du paiement" });
    }
});

module.exports = router;