// Ce fichier définit des routes d'accès pour mon API (endponts)


const router = require("express").Router();
const pool= require("../db-connexion");

router.get("/", (req, res) => {
    pool.query("SELECT * FROM users", (err, users) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(users); 
    });
});

router.get("/:id", (req, res) => {
    pool.query("SELECT * FROM users WHERE id = ?", [req.params.id], (err, user) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (user.length === 0) {
            return res.status(404).send("Not found");
        }
        res.json(user); 
    });
});

router.post("/", async (req, res) => {
    try {
        const { name, email } = req.body;

        // Utilisation de la méthode promise pour la requête
        const [result] = await pool.query(
            "INSERT INTO users (name, email) VALUES (?, ?)",
            [name, email]
        );

        res.status(201).json({ message: "User created", id: result.insertId.toString() });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});




module.exports = router;  