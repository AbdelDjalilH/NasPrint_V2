const express = require("express");
const multer = require("multer");
const path = require("path");
const { pool } = require("../database/db-connection"); // Import de la DB

const router = express.Router();

// // Configuration Multer
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, path.resolve(__dirname, "../uploads")); // Dossier de stockage
//   },
//   filename: (req, file, cb) => {
//     cb(null, `${Date.now()}_${file.originalname}`); // Nom unique pour chaque fichier
//   },
// });

// const upload = multer({ storage });
// Route pour récupérer tous les produits
router.get("/", async (req, res) => {
    try {
        const [products] = await pool.execute("SELECT * FROM products"); // Utilise execute()
        res.json(products);
    } catch (err) {
        res.status(500).json({ error: "Erreur lors de la récupération des produits" });
    }
});

// Route pour récupérer un produit par ID
router.get("/:id", async (req, res) => {
    try {
        const [products] = await pool.execute("SELECT * FROM products WHERE id = ?", [req.params.id]);
        if (products.length === 0) {
            return res.status(404).json({ message: "produit non trouvé" });
        }
        res.json(products[0]); // Retourner un seul produit
    } catch (err) {
        res.status(500).json({ error: "Erreur lors de la récupération de l'produit" });
    }
});

// Route pour créer un nouvel produit
// router.post("/upload", upload.single("file"), async (req, res) => {
//     if (!req.file) {
//       return res.status(400).json({ error: "Aucun fichier téléchargé" });
//     }
  
//     const { productId } = req.body;
//     const imageUrl = `/uploads/${req.file.filename}`;
  
//     try {
//       // Mettre à jour la table `images`
//       const [updateResult] = await pool.execute(
//         "UPDATE images SET first_image = ? WHERE product_id = ?",
//         [imageUrl, productId]
//       );
  
//       if (updateResult.affectedRows === 0) {
//         return res.status(404).json({ error: "Produit non trouvé" });
//       }
  
//       // Récupérer le produit mis à jour pour le renvoyer
//       const [productResult] = await pool.execute(
//         "SELECT * FROM products WHERE id = ?",
//         [productId]
//       );
  
//       res.status(200).json({
//         message: "Image mise à jour avec succès",
//         product: productResult[0],
//       });
//     } catch (error) {
//       console.error("Erreur lors de la mise à jour de l'image :", error);
//       res.status(500).json({ error: "Erreur interne du serveur" });
//     }
//   });

router.post("/", async (req, res) => {
    console.log(req.file); // Vérifier le fichier dans la console
    console.log(req.body); // Vérifier les données du corps

    // Récupération des champs depuis req.body
    const { product_name, product_description, category_id, price, quantity_available, height, length, weight } = req.body;

    // Définir une URL par défaut si aucun fichier n'est téléchargé
    const imageUrl = req.file ? req.file.path : "../uploads"; // Remplacez par le chemin de votre image par défaut

    // Vérification des champs obligatoires
    if (!product_name || !product_description || !category_id || !price || !quantity_available || !height || !length || !weight) {
        return res.status(400).json({ message: "Les champs ne sont pas correctement renseignés" });
    }

    try {
        // Requête SQL pour insérer les données dans la base
        const [result] = await pool.execute(
            "INSERT INTO products (product_name, product_description, category_id, price, quantity_available, image_url, height, length, weight) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
            [product_name, product_description, category_id, price, quantity_available, imageUrl, height, length, weight]
        );
        res.status(201).json({ message: "Produit créé", id: result.insertId });
    } catch (err) {
        console.error("Erreur lors de la création :", err);
        res.status(500).json({ error: "Erreur lors de la création du produit" });
    }
});


// Route pour mettre à jour un produit
// Route pour mettre à jour un produit
router.put("/:id", async (req, res) => {
    console.log("Requête PUT reçue pour le produit avec ID :", req.params.id);
    
    const { product_name, product_description, price, quantity_available, image_url, height, length, weight } = req.body;
    
    // Loggez le corps de la requête
    console.log("Données de la requête :", req.body);

    // Vérification des champs
    if (!product_name || !product_description || !price || !quantity_available || !image_url || !height || !length || !weight) {
        console.log("Champs manquants dans la requête.");
        return res.status(400).json({ message: "Tous les champs sont requis" });
    }

    try {
        // Log avant la requête SQL pour vérifier que cette partie est atteinte
        console.log("Exécution de la requête SELECT pour vérifier si le produit existe...");

        const [products] = await pool.execute("SELECT * FROM products WHERE id = ?", [req.params.id]);
        
        // Vérifiez si un produit a été trouvé
        if (products.length === 0) {
            console.log("Produit non trouvé avec l'ID :", req.params.id);
            return res.status(404).json({ message: "Produit non trouvé" });
        }

        console.log("Produit trouvé, exécution de la requête UPDATE...");

        // Exécution de la mise à jour
        await pool.execute(
            "UPDATE products SET product_name = ?, product_description = ?, price = ?, quantity_available = ?, image_url = ?, height = ?, length = ?, weight = ? WHERE id = ?",
            [product_name, product_description, price, quantity_available, image_url, height, length, weight, req.params.id]
        );

        console.log("Mise à jour réussie pour le produit avec ID :", req.params.id);
        res.json({ message: "Produit mis à jour" });
    } catch (err) {
        console.error("Erreur lors de la mise à jour :", err);
        res.status(500).json({ error: "Erreur lors de la mise à jour du produit" });
    }
});



// Route pour supprimer un produit
router.delete("/:id", async (req, res) => {
    try {
        console.log("Requête DELETE reçue pour le produit avec ID :", req.params.id);

        // Vérifiez si le produit existe
        const [products] = await pool.execute("SELECT * FROM products WHERE id = ?", [req.params.id]);
        if (products.length === 0) {
            return res.status(404).json({ message: "Produit non trouvé" });
        }

        console.log("Produit trouvé. Suppression des dépendances...");
        // Supprimez les entrées liées dans cart_products
        await pool.execute("DELETE FROM cart_products WHERE product_id = ?", [req.params.id]);

        console.log("Dépendances supprimées. Suppression du produit...");
        // Supprimez le produit
        await pool.execute("DELETE FROM products WHERE id = ?", [req.params.id]);

        res.json({ message: "Produit supprimé avec succès." });
    } catch (err) {
        console.error("Erreur lors de la suppression :", err);
        res.status(500).json({ error: "Erreur lors de la suppression du produit" });
    }
});



module.exports = router;