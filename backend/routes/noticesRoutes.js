const router = require("express").Router();
const { pool } = require("../database/db-connection"); 


router.get("/", async (req, res) => {
    try {
        const [notices] = await pool.execute("SELECT * FROM notices INNER JOIN users ON notices.user_id = users.id");
        res.json(notices);
    } catch (err) {
        res.status(500).json({ error: "Erreur lors de la récupération des notices" });
    }
});


router.get("/:id", async (req, res) => {
    try {
        const [notices] = await pool.execute(
            "SELECT * FROM notices INNER JOIN users ON notices.user_id = users.id WHERE notices.id = ?",
            [req.params.id]
        );
        if (notices.length === 0) {
            return res.status(404).json({ message: "notice non trouvé" });
        }
        res.json(notices[0]); 
    } catch (err) {
        res.status(500).json({ error: "Erreur lors de la récupération de l'notice" });
    }
});


router.post("/", async (req, res) => {
    const { product_id, user_id, commentary, mark, date_opinion } = req.body;

    
    if (!product_id || !user_id || !commentary || mark === undefined || !date_opinion) {
        return res.status(400).json({ message: "Tous les champs sont requis" });
    }

   
    try {
        const [product] = await pool.execute("SELECT * FROM products WHERE id = ?", [product_id]);
        const [user] = await pool.execute("SELECT * FROM users WHERE id = ?", [user_id]);

        if (product.length === 0) {
            return res.status(404).json({ message: "Produit non trouvé" });
        }
        
        if (user.length === 0) {
            return res.status(404).json({ message: "Utilisateur non trouvé" });
        }

       
        const [result] = await pool.execute(
            "INSERT INTO notices (product_id, user_id, commentary, mark, date_opinion) VALUES (?, ?, ?, ?, ?)",
            [product_id, user_id, commentary, mark, date_opinion]
        );
        res.status(201).json({ message: "notice créée", id: result.insertId });
    } catch (err) {
        console.error("Erreur lors de la création de l'notice :", err);
        res.status(500).json({ error: "Erreur lors de la création de l'notice" });
    }
});


router.put("/:id", async (req, res) => {
    const { product_id, user_id, commentary, mark, date_opinion } = req.body;

    
    if (!product_id || !user_id || !commentary || mark === undefined || !date_opinion) {
        return res.status(400).json({ message: "Tous les champs sont requis" });
    }

    try {
       
        const [notices] = await pool.execute("SELECT * FROM notices WHERE id = ?", [req.params.id]);

        if (notices.length === 0) {
            return res.status(404).json({ message: "notice non trouvée" });
        }

       
        const [product] = await pool.execute("SELECT * FROM products WHERE id = ?", [product_id]);
        const [user] = await pool.execute("SELECT * FROM users WHERE id = ?", [user_id]);

        if (product.length === 0) {
            return res.status(404).json({ message: "Produit non trouvé" });
        }
        
        if (user.length === 0) {
            return res.status(404).json({ message: "Utilisateur non trouvé" });
        }

        
        await pool.execute(
            "UPDATE notices SET product_id = ?, user_id = ?, commentary = ?, mark = ?, date_opinion = ? WHERE id = ?",
            [product_id, user_id, commentary, mark, date_opinion, req.params.id]
        );

        res.json({ message: "notice mise à jour avec succès" });
    } catch (err) {
        console.error("Erreur lors de la mise à jour de l'notice :", err);
        res.status(500).json({ error: "Erreur lors de la mise à jour de l'notice" });
    }
});


router.delete("/:id", async (req, res) => {
    try {
        const [notices] = await pool.execute("SELECT * FROM notices WHERE id = ?", [req.params.id]);

        if (notices.length === 0) {
            return res.status(404).json({ message: "notice non trouvé" });
        }

        await pool.execute("DELETE FROM notices WHERE id = ?", [req.params.id]);
        res.json({ message: "notice supprimé" });
    } catch (err) {
        console.error("Erreur lors de la suppression du notice :", err);
        res.status(500).json({ error: "Erreur lors de la suppression du notice" });
    }
});

module.exports = router;
