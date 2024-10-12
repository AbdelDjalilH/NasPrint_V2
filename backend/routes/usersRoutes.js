const router = require("express").Router();
const pool = require("../database/db-connection");

// Route pour récupérer tous les utilisateurs
router.get("/", async (req, res) => {
    try {
        const [users] = await pool.query("SELECT * FROM users");
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Route pour récupérer un utilisateur par ID
router.get("/:id", async (req, res) => {
    try {
        const [user] = await pool.query("SELECT * FROM users WHERE id = ?", [req.params.id]);
        if (user.length === 0) {
            return res.status(404).send("Not found");
        }
        res.json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Route pour créer un nouvel utilisateur
router.post("/", async (req, res) => {
    try {
        const { name, email } = req.body;

        const [result] = await pool.query(
            "INSERT INTO users (name, email) VALUES (?, ?)",
            [name, email]
        );

        res.status(201).json({ message: "User created", id: result.insertId });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.put("/:id", async (req,res) => {
    try{
        const {id} = req.params;
        const {name, email} = req.body;
        await pool.query("UPDATE users SET name = ?, email = ? WHERE id= ?", [
            name,
            email,
            id,
          ]);
          res.json({message: "User updated"});
    } catch (err) {
        res.status(500).json({error: err.message});
    }
})

router.delete("/:id", async (req,res) => {
    try {
        const {id} = req.params;
        await pool.query("DELETE FROM users WHERE id = ?" , [id]);
        res.json({message: "User deleted"});
    
    } catch (err) {
        res.status(500).json({error: err.message });
    }
})



module.exports = router;
