const express = require("express");
const router = express.Router();
const { pool } = require("../database/db-connection");
const jwt = require("jsonwebtoken");
const adminOnly = require("../services/adminOnly"); 
const verifyToken = require("../services/authMiddleware");



router.get("/", verifyToken, adminOnly, async (req, res) => {
    try {
        const [users] = await pool.execute("SELECT * FROM users");
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: "Erreur lors de la récupération des utilisateurs" });
    }
});


router.get("/:id", verifyToken, adminOnly, async (req, res) => {
    try {
        const [user] = await pool.execute("SELECT * FROM users WHERE id = ?", [req.params.id]);
        if (user.length === 0) {
            return res.status(404).json({ message: "Utilisateur non trouvé" });
        }
        res.json(user[0]);
    } catch (err) {
        res.status(500).json({ error: "Erreur lors de la récupération de l'utilisateur" });
    }
});


router.post("/", verifyToken, async (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({ message: "Tous les champs sont requis" });
    }

    try {
        const [result] = await pool.execute(
            "INSERT INTO users (username, email, password) VALUES (?, ?, ?)",
            [username, email, password]
        );

        res.status(201).json({ message: "Utilisateur créé avec succès", userId: result.insertId });
    } catch (error) {
        console.error("Erreur lors de la création de l'utilisateur:", error);
        res.status(500).json({ error: "Erreur lors de la création de l'utilisateur" });
    }
});


router.post("/login", verifyToken, async (req, res) => {
    const { username, password } = req.body;

    try {
        const [users] = await pool.execute("SELECT * FROM users WHERE username = ?", [username]);
        const user = users[0];
        if (!user || user.password !== password) {
            return res.status(401).json({ message: "Nom d'utilisateur ou mot de passe incorrect" });
        }

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: "1h" });
        return res.json({ token });
    } catch (error) {
        console.error("Erreur lors de la connexion:", error);
        return res.status(500).json({ error: "Erreur lors de la connexion" });
    }
});


router.put("/:id", verifyToken, adminOnly, async (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email) {
        return res.status(400).json({ message: "Le nom et l'email sont requis" });
    }

    try {
        const [user] = await pool.execute("SELECT * FROM users WHERE id = ?", [req.params.id]);
        
        if (user.length === 0) {
            return res.status(404).json({ message: "Utilisateur non trouvé" });
        }

        const values = [username, email, req.params.id];
        let query = "UPDATE users SET username = ?, email = ?";

        if (password) {
            query += ", password = ?";
            values.unshift(password);
        }

        query += " WHERE id = ?";
        
        await pool.execute(query, values);
        res.json({ message: "Utilisateur mis à jour" });
    } catch (err) {
        console.error("Erreur lors de la mise à jour de l'utilisateur:", err);
        res.status(500).json({ error: "Erreur lors de la mise à jour de l'utilisateur" });
    }
});


router.delete("/:id", verifyToken, adminOnly, async (req, res) => {
    try {
        const [user] = await pool.execute("SELECT * FROM users WHERE id = ?", [req.params.id]);

        if (user.length === 0) {
            return res.status(404).json({ message: "Utilisateur non trouvé" });
        }

        await pool.execute("DELETE FROM users WHERE id = ?", [req.params.id]);
        res.json({ message: "Utilisateur supprimé" });
    } catch (err) {
        console.error("Erreur lors de la suppression de l'utilisateur:", err);
        res.status(500).json({ error: "Erreur lors de la suppression de l'utilisateur" });
    }
});

module.exports = router;
