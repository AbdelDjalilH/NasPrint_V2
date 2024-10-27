const router = require("express").Router();
const { pool } = require("../database/db-connection"); // Import correct du pool

// Route pour récupérer tous les produits
router.get("/", async (req, res) => {
    try {
        const [categories] = await pool.execute("SELECT * FROM categories"); // Utilise execute()
        res.json(categories);
    } catch (err) {
        res.status(500).json({ error: "Erreur lors de la récupération des categories" });
    }
});

// Route pour récupérer un produit par ID
router.get("/:id", async (req, res) => {
    try {
        const [categories] = await pool.execute("SELECT * FROM categories WHERE id = ?", [req.params.id]);
        if (categories.length === 0) {
            return res.status(404).json({ message: "categorie non trouvé" });
        }
        res.json(categories[0]); // Retourner un seul produit
    } catch (err) {
        res.status(500).json({ error: "Erreur lors de la récupération de la categorie" });
    }
});

// Route pour créer un nouvel produit
router.post("/", async (req, res) => {
    const { rising, payment_date, payment_mean, payment_status, user_id } = req.body;

    // Vérification des champs nécessaires
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
        console.error("Erreur lors de la création du paiement :", err);
        res.status(500).json({ error: "Erreur lors de la création du paiement" });
    }
});


// Route pour mettre à jour un produit
// Route pour mettre à jour un produit
router.put("/:id", async (req, res) => {
    const { category_name, category_description } = req.body;

    // Vérification que tous les champs nécessaires sont présents
    if (!category_name || !category_description ) {
        return res.status(400).json({ message: "Tous les champs sont requis" });
    }

    try {
        // Vérifier si le produit existe
        const [products] = await pool.execute("SELECT * FROM products WHERE id = ?", [req.params.id]);

        if (products.length === 0) {
            return res.status(404).json({ message: "Categorie non trouvé" });
        }

        // Mettre à jour le produit
        await pool.execute(
            "UPDATE categories SET category_name = ?, category_description = ?",
            [category_name, category_description]
        );

        res.json({ message: "Categorie mis à jour" });
    } catch (err) {
        console.error("Erreur lors de la mise à jour :", err);
        res.status(500).json({ error: "Erreur lors de la mise à jour de la categorie" });
    }
});


// Route pour supprimer un produit
router.delete("/:id", async (req, res) => {
    try {
        const [categories] = await pool.execute("SELECT * FROM categories WHERE id = ?", [req.params.id]);

        if (categories.length === 0) {
            return res.status(404).json({ message: "categorie non trouvé" });
        }

        await pool.execute("DELETE FROM categories WHERE id = ?", [req.params.id]);
        res.json({ message: "categorie supprimée" });
    } catch (err) {
        res.status(500).json({ error: "Erreur lors de la suppression de la categorie" });
    }
});

module.exports = router;