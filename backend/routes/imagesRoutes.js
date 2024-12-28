const router = require("express").Router();
const { pool } = require("../database/db-connection"); 
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
        const [images] = await pool.execute("SELECT * FROM images"); 
        res.json(images);
    } catch (err) {
        res.status(500).json({ error: "Erreur lors de la récupération des images" });
    }
});


router.get("/:id", async (req, res) => {
    try {
        const [images] = await pool.execute("SELECT * FROM images WHERE id = ?", [req.params.id]);
        if (images.length === 0) {
            return res.status(404).json({ message: "Image non trouvée" });
        }

        // Ajout d'une valeur par défaut pour `first_image`
        const image = images[0];
        image.first_image = image.first_image || "https://via.placeholder.com/150";

        res.json(image);
    } catch (err) {
        console.error("Erreur lors de la récupération de l'image :", err);
        res.status(500).json({ error: "Erreur lors de la récupération de l'image" });
    }
});



router.post("/", upload.single('image'), async (req, res) => {
    console.log(req.file); 
    console.log(req.body); 

    
    const { product_id,first_image, second_image, third_image, fourth_image, fifth_image } = req.body;

   
    if (!product_id || !first_image || !second_image || !third_image || !fourth_image || !fifth_image) {
        return res.status(400).json({ message: "Les champs ne sont pas correctement renseignés" });
    }

    try {
        
        const [result] = await pool.execute(
            "INSERT INTO images (product_id, first_image, second_image, third_image, fourth_image, fifth_image) VALUES (?, ?, ?, ?, ?, ?)",
            [product_id,first_image, second_image, third_image, fourth_image, fifth_image]
        );
        res.status(201).json({ message: "image créé", id: result.insertId });
    } catch (err) {
        console.error("Erreur lors de la création :", err);
        res.status(500).json({ error: "Erreur lors de la création du image" });
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