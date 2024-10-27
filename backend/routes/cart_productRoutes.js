const router = require("express").Router();
const { pool } = require("../database/db-connection"); // Import correct du pool

// Route pour récupérer tous les cart-products
router.get("/", async (req, res) => {
    try {
        const [cartProducts] = await pool.execute("SELECT * FROM cart_products"); // Utilise execute()
        res.json(cartProducts);
    } catch (err) {
        res.status(500).json({ error: "Erreur lors de la récupération des cart-products" });
    }
});

// Route pour récupérer un cart-product par cart_id et product_id
router.get("/:cart_id/:product_id", async (req, res) => {
    try {
        const { cart_id, product_id } = req.params;
        const [cartProduct] = await pool.execute(
            "SELECT * FROM cart_products WHERE cart_id = ? AND product_id = ?",
            [cart_id, product_id]
        );
        if (cartProduct.length === 0) {
            return res.status(404).json({ message: "Cart-product non trouvé" });
        }
        res.json(cartProduct[0]); // Retourner un seul cart-product
    } catch (err) {
        res.status(500).json({ error: "Erreur lors de la récupération du cart-product" });
    }
});

// Route pour créer un nouveau cart-product
// Route pour créer un nouveau cart-product
// Route pour créer un nouveau cart-product
// Route pour créer un nouveau cart-product
// Exemple de route POST dans cart_productRoutes.js
router.post("/", async (req, res) => {
    const { cart_id, product_id, quantity } = req.body;

    if (!cart_id || !product_id || !quantity) {
        return res.status(400).json({ message: "Tous les champs (cart_id, product_id, quantity) sont requis" });
    }

    try {
        // Vérifiez si cart_id existe
        const [cart] = await pool.execute("SELECT * FROM cart WHERE id = ?", [cart_id]);
        if (cart.length === 0) {
            return res.status(404).json({ message: "Le cart_id spécifié n'existe pas" });
        }

        // Vérifiez si product_id existe
        const [product] = await pool.execute("SELECT * FROM products WHERE id = ?", [product_id]);
        if (product.length === 0) {
            return res.status(404).json({ message: "Le product_id spécifié n'existe pas" });
        }

        // Insérez dans la base de données
        await pool.execute(
            "INSERT INTO cart_products (cart_id, product_id, quantity) VALUES (?, ?, ?)",
            [cart_id, product_id, quantity]
        );
        res.status(201).json({ message: "Cart-product créé avec succès" });
    } catch (err) {
        console.error("Erreur lors de la création du cart-product :", err);
        res.status(500).json({ error: "Erreur lors de la création du cart-product" });
    }
});






// Route pour mettre à jour un cart-product
router.put("/:cart_id/:product_id", async (req, res) => {
    const { quantity } = req.body;
    const { cart_id, product_id } = req.params;

    // Vérification que tous les champs nécessaires sont présents
    if (!quantity) {
        return res.status(400).json({ message: "Le champ quantity est requis" });
    }

    try {
        // Vérifier si le cart-product existe
        const [cartProduct] = await pool.execute(
            "SELECT * FROM cart_products WHERE cart_id = ? AND product_id = ?",
            [cart_id, product_id]
        );

        if (cartProduct.length === 0) {
            return res.status(404).json({ message: "Cart-product non trouvé" });
        }

        // Mettre à jour le cart-product
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
        // Vérifier si le cart-product existe
        const [cartProduct] = await pool.execute(
            "SELECT * FROM cart_products WHERE cart_id = ? AND product_id = ?",
            [cart_id, product_id]
        );

        if (cartProduct.length === 0) {
            return res.status(404).json({ message: "Cart-product non trouvé" });
        }

        // Supprimer le cart-product
        await pool.execute("DELETE FROM cart_products WHERE cart_id = ? AND product_id = ?", [cart_id, product_id]);
        res.json({ message: "Cart-product supprimé avec succès" });
    } catch (err) {
        res.status(500).json({ error: "Erreur lors de la suppression du cart-product" });
    }
});

module.exports = router;
