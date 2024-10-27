const router = require("express").Router();
const { pool } = require("../database/db-connection"); // Import correct du pool

// Route pour récupérer tous les cart
router.get("/", async (req, res) => {
    try {
        const [cart] = await pool.execute("SELECT * FROM cart"); // Utilise execute()
        res.json(cart);
    } catch (err) {
        res.status(500).json({ error: "Erreur lors de la récupération des cart" });
    }
});

// Route pour récupérer un cart par ID
router.get("/:id", async (req, res) => {
    try {
        const [cart] = await pool.execute("SELECT * FROM cart INNER JOIN users ON cart.user_id = users.id WHERE cart.id = ?", [req.params.id]);
        if (cart.length === 0) {
            return res.status(404).json({ message: "cart non trouvé" });
        }
        res.json(cart[0]); // Retourner un seul cart
    } catch (err) {
        res.status(500).json({ error: "Erreur lors de la récupération de l'cart" });
    }
});

// Route pour créer un nouvel cart
router.post("/", async (req, res) => {
    const { date_creation, user_id } = req.body;

    // Vérifier que tous les champs, y compris user_id, sont présents
    if (!date_creation || !user_id) {
        return res.status(400).json({ message: "Tous les champs sont requis, y compris user_id" });
    }

    try {
        const [result] = await pool.execute(
            "INSERT INTO cart (date_creation, user_id) VALUES (?, ?)",
            [date_creation, user_id]
        );
        res.status(201).json({ message: "cart créée", id: result.insertId });
    } catch (err) {
        console.error("Erreur lors de la création de l'cart :", err);
        res.status(500).json({ error: "Erreur lors de la création de l'cart" });
    }
});




// Route pour mettre à jour un cart
// Route pour mettre à jour un cart
router.put("/:id", async (req, res) => {
    const { date_creation, user_id } = req.body;

    // Vérification que tous les champs nécessaires sont présents
    if (!date_creation || !user_id) {
        return res.status(400).json({ message: "Tous les champs sont requis" });
    }

    try {
        // Vérifier si l'cart existe
        const [cart] = await pool.execute("SELECT * FROM cart WHERE id = ?", [req.params.id]);

        if (cart.length === 0) {
            return res.status(404).json({ message: "cart non trouvée" });
        }

        // Mettre à jour l'cart avec user_id inclus
        await pool.execute(
            "UPDATE cart SET date_creation = ?, user_id = ? WHERE id = ?",
            [date_creation, user_id, req.params.id]
        );

        res.json({ message: "cart mise à jour avec succès" });
    } catch (err) {
        console.error("Erreur lors de la mise à jour de l'cart :", err);
        res.status(500).json({ error: "Erreur lors de la mise à jour de l'cart" });
    }
});


// Route pour supprimer un cart
router.delete("/:id", async (req, res) => {
    try {
        const [cart] = await pool.execute("SELECT * FROM cart WHERE id = ?", [req.params.id]);

        if (cart.length === 0) {
            return res.status(404).json({ message: "cart non trouvé" });
        }

        await pool.execute("DELETE FROM cart WHERE id = ?", [req.params.id]);
        res.json({ message: "cart supprimé" });
    } catch (err) {
        res.status(500).json({ error: "Erreur lors de la suppression du cart" });
    }
});

module.exports = router;