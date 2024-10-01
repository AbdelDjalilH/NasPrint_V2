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
module.exports = router;