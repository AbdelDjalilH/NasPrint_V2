const router = require("express").Router();
const { pool } = require("../database/db-connection"); // Import correct du pool

// Route pour récupérer tous les adresses
router.get("/", async (req, res) => {
    try {
        const [adresses] = await pool.execute("SELECT * FROM adresses");
        res.json(adresses);
    } catch (err) {
        res.status(500).json({ error: "Erreur lors de la récupération des adresses" });
    }
});

// Route pour récupérer un adresse par ID
router.get("/:id", async (req, res) => {
    try {
        const [adresses] = await pool.execute(
            "SELECT * FROM adresses INNER JOIN users ON adresses.user_id = users.id WHERE adresses.id = ?", 
            [req.params.id]
        );
        if (adresses.length === 0) {
            return res.status(404).json({ message: "Adresse non trouvée" });
        }
        res.json(adresses[0]); // Retourner un seul adresse
    } catch (err) {
        res.status(500).json({ error: "Erreur lors de la récupération de l'adresse" });
    }
});

// Route pour créer un nouvel adresse
router.post("/", async (req, res) => {
    const { lastname, firstname, number_road, city, postal_code, user_id } = req.body;

    // Vérifier que tous les champs, y compris user_id, sont présents
    if (!lastname || !firstname || !number_road || !city || !postal_code || !user_id) {
        return res.status(400).json({ message: "Tous les champs sont requis, y compris user_id" });
    }

    try {
        const [result] = await pool.execute(
            "INSERT INTO adresses (lastname, firstname, number_road, city, postal_code, user_id) VALUES (?, ?, ?, ?, ?, ?)",
            [lastname, firstname, number_road, city, postal_code, user_id] // Ajout de user_id ici
        );
        res.status(201).json({ message: "Adresse créée", id: result.insertId });
    } catch (err) {
        console.error("Erreur lors de la création de l'adresse :", err);
        res.status(500).json({ error: "Erreur lors de la création de l'adresse" });
    }
});

// Route pour mettre à jour un adresse
router.put("/:id", async (req, res) => {
    const { lastname, firstname, number_road, city, postal_code, user_id } = req.body;

    // Vérification que tous les champs nécessaires sont présents
    if (!lastname || !firstname || !number_road || !city || !postal_code || !user_id) {
        return res.status(400).json({ message: "Tous les champs sont requis" });
    }

    try {
        // Vérifier si l'adresse existe
        const [adresses] = await pool.execute("SELECT * FROM adresses WHERE id = ?", [req.params.id]);

        if (adresses.length === 0) {
            return res.status(404).json({ message: "Adresse non trouvée" });
        }

        // Mettre à jour l'adresse avec user_id inclus
        await pool.execute(
            "UPDATE adresses SET lastname = ?, firstname = ?, number_road = ?, city = ?, postal_code = ?, user_id = ? WHERE id = ?",
            [lastname, firstname, number_road, city, postal_code, user_id, req.params.id]
        );

        res.json({ message: "Adresse mise à jour avec succès" });
    } catch (err) {
        console.error("Erreur lors de la mise à jour de l'adresse :", err);
        res.status(500).json({ error: "Erreur lors de la mise à jour de l'adresse" });
    }
});

// Route pour supprimer un adresse
router.delete("/:id", async (req, res) => {
    try {
        const [adresses] = await pool.execute("SELECT * FROM adresses WHERE id = ?", [req.params.id]);

        if (adresses.length === 0) {
            return res.status(404).json({ message: "Adresse non trouvée" });
        }

        await pool.execute("DELETE FROM adresses WHERE id = ?", [req.params.id]);
        res.json({ message: "Adresse supprimée" });
    } catch (err) {
        console.error("Erreur lors de la suppression de l'adresse :", err);
        res.status(500).json({ error: "Erreur lors de la suppression de l'adresse" });
    }
});

module.exports = router;
