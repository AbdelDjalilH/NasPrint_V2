const router = require("express").Router();
const { pool } = require("../database/db-connection");

// Route pour récupérer tous les cart-products
router.get("/", async (req, res) => {
    try {
        const [cartProducts] = await pool.execute(
            `SELECT cp.cart_id, cp.product_id, cp.quantity, p.product_name
             FROM cart_products cp
             JOIN products p ON cp.product_id = p.id`
        );
        res.json(cartProducts);
    } catch (err) {
        console.error("Erreur lors de la récupération des cart-products :", err);
        res.status(500).json({ error: "Erreur lors de la récupération des cart-products" });
    }
});

// Route pour récupérer un cart-product par cart_id et product_id
router.get("/:cart_id/:product_id", async (req, res) => {
    try {
        const { cart_id, product_id } = req.params;
        const [cartProduct] = await pool.execute(
            `SELECT cp.cart_id, cp.product_id, cp.quantity, p.product_name
             FROM cart_products cp
             JOIN products p ON cp.product_id = p.id
             WHERE cp.cart_id = ? AND cp.product_id = ?`,
            [cart_id, product_id]
        );

        if (cartProduct.length === 0) {
            return res.status(404).json({ message: "Cart-product non trouvé" });
        }

        res.json(cartProduct[0]);
    } catch (err) {
        console.error("Erreur lors de la récupération du cart-product :", err);
        res.status(500).json({ error: "Erreur lors de la récupération du cart-product" });
    }
});

// Route pour créer un nouveau cart-product
router.post("/", async (req, res) => {
    const { cart_id, product_id, quantity } = req.body;

    if (!cart_id || !product_id || !quantity) {
        return res.status(400).json({ message: "Tous les champs (cart_id, product_id, quantity) sont requis" });
    }

    try {
        await pool.execute(
            `INSERT INTO cart_products (cart_id, product_id, quantity) VALUES (?, ?, ?)
             ON DUPLICATE KEY UPDATE quantity = quantity + VALUES(quantity)`,
            [cart_id, product_id, quantity]
        );

        res.status(201).json({ message: "Cart-product ajouté avec succès" });
    } catch (err) {
        console.error("Erreur lors de la création du cart-product :", err);
        res.status(500).json({ error: "Erreur lors de la création du cart-product" });
    }
});

// Route pour mettre à jour un cart-product
router.put("/:cart_id/:product_id", async (req, res) => {
    const { quantity } = req.body;
    const { cart_id, product_id } = req.params;

    if (!quantity) {
        return res.status(400).json({ message: "Le champ quantity est requis" });
    }

    try {
        const [cartProduct] = await pool.execute(
            "SELECT * FROM cart_products WHERE cart_id = ? AND product_id = ?",
            [cart_id, product_id]
        );

        if (cartProduct.length === 0) {
            return res.status(404).json({ message: "Cart-product non trouvé" });
        }

        await pool.execute(
            "UPDATE cart_products SET quantity = ? WHERE cart_id = ? AND product_id = ?",
            [quantity, cart_id, product_id]
        );

        res.json({ message: "Cart-product mis à jour avec succès" });
    } catch (err) {
        console.error("Erreur lors de la mise à jour du cart-product :", err);
        res.status(500).json({ error: "Erreur lors de la mise à jour du cart-product" });
    }
});

// Route pour supprimer un cart-product
router.delete("/:cart_id/:product_id", async (req, res) => {
    const { cart_id, product_id } = req.params;

    try {
        await pool.execute("DELETE FROM cart_products WHERE cart_id = ? AND product_id = ?", [cart_id, product_id]);
        res.json({ message: "Cart-product supprimé avec succès" });
    } catch (err) {
        console.error("Erreur lors de la suppression du cart-product :", err);
        res.status(500).json({ error: "Erreur lors de la suppression du cart-product" });
    }
});

module.exports = router;


