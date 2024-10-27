const router = require("express").Router();
const { pool } = require("../database/db-connection"); // Import correct du pool

// Route pour récupérer tous les produits
router.get("/", async (req, res) => {
    try {
        const [products] = await pool.execute("SELECT * FROM products"); // Utilise execute()
        res.json(products);
    } catch (err) {
        res.status(500).json({ error: "Erreur lors de la récupération des produits" });
    }
});

// Route pour récupérer un produit par ID
router.get("/:id", async (req, res) => {
    try {
        const [products] = await pool.execute("SELECT * FROM products WHERE id = ?", [req.params.id]);
        if (products.length === 0) {
            return res.status(404).json({ message: "produit non trouvé" });
        }
        res.json(products[0]); // Retourner un seul produit
    } catch (err) {
        res.status(500).json({ error: "Erreur lors de la récupération de l'produit" });
    }
});

// Route pour créer un nouvel produit
router.post("/", async (req, res) => {
    const { product_name, product_description, price, quantity_available, image_url, height, length, weight } = req.body;

    if (!product_name || !product_description || !price || !quantity_available || !image_url || !height  || !length || !weight) {
        return res.status(400).json({ message: "Les champs ne sont pas correctement rensignés" });
    }

    try {
        const [result] = await pool.execute(
            "INSERT INTO products (product_name, product_description, price, image_url, height, length, weight  ) VALUES (?, ?, ?, ?, ?, ?, ?)",
            [product_name, product_description, price, image_url, height, length, weight]
        );
        res.status(201).json({ message: "produit créé", id: result.insertId });
    } catch (err) {
        res.status(500).json({ error: "Erreur lors de la création de l'produit" });
    }
});

// Route pour mettre à jour un produit
// Route pour mettre à jour un produit
router.put("/:id", async (req, res) => {
    const { product_name, product_description, price, quantity_available, image_url, height, length, weight } = req.body;

    // Vérification que tous les champs nécessaires sont présents
    if (!product_name || !product_description || !price || !quantity_available || !image_url || !height || !length || !weight) {
        return res.status(400).json({ message: "Tous les champs sont requis" });
    }

    try {
        // Vérifier si le produit existe
        const [products] = await pool.execute("SELECT * FROM products WHERE id = ?", [req.params.id]);

        if (products.length === 0) {
            return res.status(404).json({ message: "Produit non trouvé" });
        }

        // Mettre à jour le produit
        await pool.execute(
            "UPDATE products SET product_name = ?, product_description = ?, price = ?, quantity_available = ?, image_url = ?, height = ?, length = ?, weight = ? WHERE id = ?",
            [product_name, product_description, price, quantity_available, image_url, height, length, weight, req.params.id]
        );

        res.json({ message: "Produit mis à jour" });
    } catch (err) {
        console.error("Erreur lors de la mise à jour :", err);
        res.status(500).json({ error: "Erreur lors de la mise à jour du produit" });
    }
});


// Route pour supprimer un produit
router.delete("/:id", async (req, res) => {
    try {
        const [products] = await pool.execute("SELECT * FROM products WHERE id = ?", [req.params.id]);

        if (products.length === 0) {
            return res.status(404).json({ message: "produit non trouvé" });
        }

        await pool.execute("DELETE FROM products WHERE id = ?", [req.params.id]);
        res.json({ message: "produit supprimé" });
    } catch (err) {
        res.status(500).json({ error: "Erreur lors de la suppression du produit" });
    }
});

module.exports = router;