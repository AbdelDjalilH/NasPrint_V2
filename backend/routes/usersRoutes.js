const router = require("express").Router();
const { pool } = require("../database/db-connection"); // Import correct du pool

// Route pour récupérer tous les utilisateurs
router.get("/", async (req, res) => {
    try {
        const [users] = await pool.execute("SELECT * FROM users"); // Utilise execute()
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: "Erreur lors de la récupération des utilisateurs" });
    }
});

// Route pour récupérer un utilisateur par ID
router.get("/:id", async (req, res) => {
    try {
        const [user] = await pool.execute("SELECT * FROM users WHERE id = ?", [req.params.id]);
        if (user.length === 0) {
            return res.status(404).json({ message: "Utilisateur non trouvé" });
        }
        res.json(user[0]); // Retourner un seul utilisateur
    } catch (err) {
        res.status(500).json({ error: "Erreur lors de la récupération de l'utilisateur" });
    }
});

// Route pour créer un nouvel utilisateur
router.post("/", async (req, res) => {
    const { username, email } = req.body;

    if (!username || !email) {
        return res.status(400).json({ message: "Le nom et l'email sont requis" });
    }

    try {
        const [result] = await pool.execute(
            "INSERT INTO users (username, email) VALUES (?, ?)",
            [username, email]
        );
        res.status(201).json({ message: "Utilisateur créé", id: result.insertId });
    } catch (err) {
        res.status(500).json({ error: "Erreur lors de la création de l'utilisateur" });
    }
});

// Route pour mettre à jour un utilisateur
router.put("/:id", async (req, res) => {
    const { username, email } = req.body;

    if (!username || !email) {
        return res.status(400).json({ message: "Le nom et l'email sont requis" });
    }

    try {
        const [user] = await pool.execute("SELECT * FROM users WHERE id = ?", [req.params.id]);

        if (user.length === 0) {
            return res.status(404).json({ message: "Utilisateur non trouvé" });
        }

        await pool.execute("UPDATE users SET username = ?, email = ? WHERE id = ?", [username, email, req.params.id]);
        res.json({ message: "Utilisateur mis à jour" });
    } catch (err) {
        res.status(500).json({ error: "Erreur lors de la mise à jour de l'utilisateur" });
    }
});

// Route pour supprimer un utilisateur
router.delete("/:id", async (req, res) => {
    try {
        const [user] = await pool.execute("SELECT * FROM users WHERE id = ?", [req.params.id]);

        if (user.length === 0) {
            return res.status(404).json({ message: "Utilisateur non trouvé" });
        }

        await pool.execute("DELETE FROM users WHERE id = ?", [req.params.id]);
        res.json({ message: "Utilisateur supprimé" });
    } catch (err) {
        res.status(500).json({ error: "Erreur lors de la suppression de l'utilisateur" });
    }
});

module.exports = router;
