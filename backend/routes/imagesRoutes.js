const express = require("express");
const multer = require("multer");
const path = require("path");
const { pool } = require("../database/db-connection"); // Import de la DB

const router = express.Router();

// Configuration Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.resolve(__dirname, "../uploads")); // Dossier de stockage
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}_${file.originalname}`); // Nom unique pour chaque fichier
  },
});

const upload = multer({ storage });
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
router.post("/upload", upload.single("file"), async (req, res) => {
    if (!req.file) {
      return res.status(400).json({ error: "Aucun fichier téléchargé" });
    }
  
    const { productId } = req.body;
    const imageUrl = `/uploads/${req.file.filename}`;
  
    try {
      const [result] = await pool.execute(
        "UPDATE products SET first_image = ? WHERE id = ?",
          [imageUrl, productId]
        );
  
      if (result.affectedRows > 0) {
        res.status(200).json({ message: "Image téléchargée et mise à jour avec succès", imageUrl });
      } else {
        res.status(404).json({ error: "Produit non trouvé" });
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour de l'URL de l'image :", error);
      res.status(500).json({ error: "Erreur interne du serveur" });
    }
  });
router.post("/", async (req, res) => {
    console.log(req.file); // Vérifier le fichier dans la console
    console.log(req.body); // Vérifier les données du corps

    // Récupération des champs depuis req.body
    const { product_id,first_image, second_image, third_image, four_image, five_image } = req.body;

    // Définir une URL par défaut si aucun fichier n'est t../uploads/1732821788016_salade.pngéléchargé
    // const imageUrl = req.file ? req.file.path : "..."; // Remplacez par le chemin de votre image par défaut

    // Vérification des champs obligatoires
    if (!product_id || !first_image || !second_image || !third_image || !four_image || !five_image) {
        return res.status(400).json({ message: "Les champs ne sont pas correctement renseignés" });
    }

    try {
        // Requête SQL pour insérer les données dans la base
        const [result] = await pool.execute(
            "INSERT INTO images (product_id, first_image, second_image, third_image, four_image, five_image) VALUES (?, ?, ?, ?, ?, ?)",
            [product_id,first_image, second_image, third_image, four_image, five_image]
        );
        res.status(201).json({ message: "image créé", id: result.insertId });
    } catch (err) {
        console.error("Erreur lors de la création :", err);
        res.status(500).json({ error: "Erreur lors de la création du image" });
    }
});


// Route pour mettre à jour un image
// Route pour mettre à jour un image
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