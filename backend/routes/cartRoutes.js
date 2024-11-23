const router = require("express").Router();
const { pool } = require("../database/db-connection");

// Route pour récupérer tous les carts
router.get("/", async (req, res) => {
    try {
        const [cart] = await pool.execute("SELECT * FROM cart");
        res.json(cart);
    } catch (err) {
        console.error("Erreur lors de la récupération des carts :", err);
        res.status(500).json({ error: "Erreur lors de la récupération des carts" });
    }
});

// Route pour récupérer un cart par ID
router.get("/:id", async (req, res) => {
    try {
        const [cart] = await pool.execute(
            "SELECT * FROM cart INNER JOIN users ON cart.user_id = users.id WHERE cart.id = ?",
            [req.params.id]
        );
        if (cart.length === 0) {
            return res.status(404).json({ message: "Cart non trouvé" });
        }
        res.json(cart[0]); // Retourner un seul cart
    } catch (err) {
        console.error("Erreur lors de la récupération du cart :", err);
        res.status(500).json({ error: "Erreur lors de la récupération du cart" });
    }
});

// Route pour créer un nouveau cart
router.post("/", async (req, res) => {
    const { date_creation, user_id } = req.body;

    if (!user_id) {
        return res.status(400).json({ message: "Le champ user_id est requis" });
    }

    try {
        const [existingCart] = await pool.execute("SELECT * FROM cart WHERE user_id = ?", [user_id]);

        if (existingCart.length > 0) {
            return res.status(400).json({ message: "Un cart existe déjà pour cet utilisateur" });
        }

        const [result] = await pool.execute(
            "INSERT INTO cart (date_creation, user_id) VALUES (?, ?)",
            [date_creation || new Date(), user_id]
        );

        res.status(201).json({ message: "Cart créé avec succès", id: result.insertId });
    } catch (err) {
        console.error("Erreur lors de la création du cart :", err);
        res.status(500).json({ error: "Erreur lors de la création du cart" });
    }
});

// Route pour mettre à jour un cart
router.put("/:id", async (req, res) => {
    const { date_creation, user_id } = req.body;

    if (!user_id) {
        return res.status(400).json({ message: "Le champ user_id est requis" });
    }

    try {
        const [cart] = await pool.execute("SELECT * FROM cart WHERE id = ?", [req.params.id]);

        if (cart.length === 0) {
            return res.status(404).json({ message: "Cart non trouvé" });
        }

        await pool.execute(
            "UPDATE cart SET date_creation = ?, user_id = ? WHERE id = ?",
            [date_creation || cart[0].date_creation, user_id, req.params.id]
        );

        res.json({ message: "Cart mis à jour avec succès" });
    } catch (err) {
        console.error("Erreur lors de la mise à jour du cart :", err);
        res.status(500).json({ error: "Erreur lors de la mise à jour du cart" });
    }
});

// Route pour supprimer un cart
router.delete("/:id", async (req, res) => {
    try {
        const [cart] = await pool.execute("SELECT * FROM cart WHERE id = ?", [req.params.id]);

        if (cart.length === 0) {
            return res.status(404).json({ message: "Cart non trouvé" });
        }

        await pool.execute("DELETE FROM cart WHERE id = ?", [req.params.id]);
        res.json({ message: "Cart supprimé avec succès" });
    } catch (err) {
        console.error("Erreur lors de la suppression du cart :", err);
        res.status(500).json({ error: "Erreur lors de la suppression du cart" });
    }
});

module.exports = router;

