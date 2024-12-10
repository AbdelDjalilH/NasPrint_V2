const router = require("express").Router();
const { pool } = require("../database/db-connection"); // Import correct du pool
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/images'); 
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + "_" + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

router.get("/", async (req, res) => {
    try {
        const [images] = await pool.execute("SELECT * FROM images"); // Utilise execute()
        res.json(images);
    } catch (err) {
        res.status(500).json({ error: "Erreur lors de la récupération des images" });
    }
});

router.get("/:id", async (req, res) => {
    try {
        const [images] = await pool.execute("SELECT * FROM images WHERE id = ?", [req.params.id]);
        if (images.length === 0) {
            return res.status(404).json({ message: "image non trouvé" });
        }
        res.json(images[0]); // Retourner un seul image
    } catch (err) {
        res.status(500).json({ error: "Erreur lors de la récupération de l'image" });
    }
});

router.post("/", upload.single('image'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: "Aucun fichier reçu." });
        }

        // Récupérer le nom du fichier pour le premier champ image
        const firstImage = req.file.filename;

        // Vérifiez les autres images envoyées et remplacez par NULL si elles ne sont pas présentes
        const secondImage = req.body.second_image || null;
        const thirdImage = req.body.third_image || null;
        const fourthImage = req.body.fourth_image || null;
        const fifthImage = req.body.fifth_image || null;

        // Tableau des valeurs à insérer
        const values = [firstImage, secondImage, thirdImage, fourthImage, fifthImage];

        // Vérifiez que toutes les valeurs sont présentes (y compris product_id)
        const productId = req.body.product_id;

        if (!productId) {
            return res.status(400).json({ error: "Le product_id est requis" });
        }

        // Logique de la requête SQL avec les paramètres
        const sql = 'INSERT INTO images (product_id, first_image, second_image, third_image, fourth_image, fifth_image) VALUES (?, ?, ?, ?, ?, ?) id = ?';

        pool.query(sql, [productId, ...values], (err, result) => {
            if (err) {
                console.error(err);  // Affichage de l'erreur dans la console
                return res.status(500).json({ message: "Erreur lors de l'insertion de l'image" });
            }

            return res.status(201).json({ status: "Success", imageId: result.insertId });
        });

    } catch (err) {
        console.error("Erreur lors de l'upload :", err);

        if (!res.headersSent) {
            res.status(500).json({ error: "Erreur serveur lors de l'upload" });
        }
    }
});



router.put("/:id", async (req, res) => {
    const { product_id,first_image, second_image, third_image, fourth_image, fifth_image } = req.body;

       if (!product_id || !first_image || !second_image || !third_image || !fourth_image || !fifth_image) {
        return res.status(400).json({ message: "Tous les champs sont requis" });
    }

    try {
        const [images] = await pool.execute("SELECT * FROM images WHERE id = ?", [req.params.id]);

        if (images.length === 0) {
            return res.status(404).json({ message: "image non trouvé" });
        }

        // Mettre à jour le image
        await pool.execute(
            "UPDATE images SET product_id = ?, first_image = ?, second_image = ?, third_image = ?, fourth_image = ?, fifth_image = ? WHERE id = ?",
            [product_id,first_image, second_image, third_image, fourth_image, fifth_image, req.params.id]
        );

        res.json({ message: "image mis à jour" });
    } catch (err) {
        console.error("Erreur lors de la mise à jour :", err);
        res.status(500).json({ error: "Erreur lors de la mise à jour du image" });
    }
});


// Route pour supprimer un image
router.delete("/:id", async (req, res) => {
    try {
        const [images] = await pool.execute("SELECT * FROM images WHERE id = ?", [req.params.id]);

        if (images.length === 0) {
            return res.status(404).json({ message: "image non trouvé" });
        }

        await pool.execute("DELETE FROM images WHERE id = ?", [req.params.id]);
        res.json({ message: "image supprimé" });
    } catch (err) {
        res.status(500).json({ error: "Erreur lors de la suppression du image" });
    }
});

module.exports = router;