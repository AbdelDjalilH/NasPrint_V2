const router = require("express").Router();
const { pool } = require("../database/db-connection"); // Import correct du pool
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads'); // Assurez-vous que le dossier 'uploads' existe dans votre projet 
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + "_" + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// Route pour récupérer tous les images
router.get("/", async (req, res) => {
    try {
        const [images] = await pool.execute("SELECT * FROM images"); // Utilise execute()
        res.json(images);
    } catch (err) {
        res.status(500).json({ error: "Erreur lors de la récupération des images" });
    }
});

// Route pour récupérer un image par ID
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

// Route pour créer un nouvel image
router.post("/", upload.single('image'), async (req, res) => {
    try {
        const image = req.file.filename;
        const sql= "UPDATE images SET first_image = ?";
        pool.query(sql, [image], (err, result) => {
            if(err) return res.json({Message: "Error"});
            return res.json ({Status : "Success"});
        })

        if (!req.file) {
            return res.status(400).json({ error: "Aucun fichier reçu." });
        }

        const imageUrl = req.file.path; // Chemin de l'image
        console.log("Image URL :", imageUrl);

        // Renvoyer une seule réponse pour éviter les conflits
        return res.status(201).json({ message: "Image uploadée", imageUrl });

    } catch (err) {
        console.error("Erreur lors de l'upload :", err);

        // Vérifie si les headers sont déjà envoyés avant d'envoyer la réponse
        if (!res.headersSent) {
            res.status(500).json({ error: "Erreur serveur lors de l'upload" });
        }
    }
});

router.put("/:id", async (req, res) => {
    const { product_id,first_image, second_image, third_image, four_image, five_image } = req.body;

    // Vérification que tous les champs nécessaires sont présents
    if (!product_id || !first_image || !second_image || !third_image || !four_image || !five_image) {
        return res.status(400).json({ message: "Tous les champs sont requis" });
    }

    try {
        // Vérifier si le image existe
        const [images] = await pool.execute("SELECT * FROM images WHERE id = ?", [req.params.id]);

        if (images.length === 0) {
            return res.status(404).json({ message: "image non trouvé" });
        }

        // Mettre à jour le image
        await pool.execute(
            "UPDATE images SET product_id = ?, first_image = ?, second_image = ?, third_image = ?, four_image = ?, five_image = ? WHERE id = ?",
            [product_id,first_image, second_image, third_image, four_image, five_image, req.params.id]
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