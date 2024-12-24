const multer = require("multer");
const path = require("path");
const { pool } = require("../database/db-connection");

const express = require("express");
const router = express.Router();

// Configuration de Multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "public/images");
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + path.extname(file.originalname));
    },
  });
  
  const upload = multer({ storage: storage });
  
  // Configuration pour gérer plusieurs champs
  const uploadFields = upload.fields([
    { name: "first_image", maxCount: 1 },
    { name: "second_image", maxCount: 1 },
    { name: "third_image", maxCount: 1 },
    { name: "fourth_image", maxCount: 1 },
    { name: "fifth_image", maxCount: 1 },
  ]);
  


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



router.post("/", uploadFields, async (req, res) => {
    const {
      product_name,
      product_description,
      category_id,
      price,
      quantity_available,
      height,
      length,
      weight,
    } = req.body;
  
    if (
      !product_name ||
      !product_description ||
      !category_id ||
      !price ||
      !quantity_available ||
      !height ||
      !length ||
      !weight
    ) {
      return res.status(400).json({ message: "Tous les champs sont obligatoires" });
    }
  
    try {
      // Étape 1 : Ajouter le produit dans la table `products`
      const [productResult] = await pool.execute(
        "INSERT INTO products (product_name, product_description, category_id, price, quantity_available, height, length, weight) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
        [
          product_name,
          product_description,
          category_id,
          price,
          quantity_available,
          height,
          length,
          weight,
        ]
      );
  
      const productId = productResult.insertId;
  
      // Étape 2 : Ajouter les images dans la table `images`
      const files = req.files;
      const firstImage = files.first_image ? `/images/${files.first_image[0].filename}` : null;
      const secondImage = files.second_image ? `/images/${files.second_image[0].filename}` : null;
      const thirdImage = files.third_image ? `/images/${files.third_image[0].filename}` : null;
      const fourthImage = files.fourth_image ? `/images/${files.fourth_image[0].filename}` : null;
      const fifthImage = files.fifth_image ? `/images/${files.fifth_image[0].filename}` : null;
  
      await pool.execute(
        "INSERT INTO images (product_id, first_image, second_image, third_image, fourth_image, fifth_image) VALUES (?, ?, ?, ?, ?, ?)",
        [productId, firstImage, secondImage, thirdImage, fourthImage, fifthImage]
      );
  
      res.status(201).json({ message: "Produit et images ajoutés avec succès", id: productId });
    } catch (err) {
      console.error("Erreur lors de l'ajout du produit et des images :", err);
      res.status(500).json({ error: "Erreur interne du serveur" });
    }
  });
  
  

  router.put("/:id", uploadFields, async (req, res) => {
    const { product_name, product_description, price, quantity_available, height, length, weight } = req.body;
  
    try {
      const files = req.files || {};
      const firstImage = files.first_image ? `/images/${files.first_image[0].filename}` : null;
      const secondImage = files.second_image ? `/images/${files.second_image[0].filename}` : null;
      const thirdImage = files.third_image ? `/images/${files.third_image[0].filename}` : null;
      const fourthImage = files.fourth_image ? `/images/${files.fourth_image[0].filename}` : null;
      const fifthImage = files.fifth_image ? `/images/${files.fifth_image[0].filename}` : null;
  
      await pool.execute(
        "UPDATE products SET product_name = ?, product_description = ?, price = ?, quantity_available = ?, height = ?, length = ?, weight = ? WHERE id = ?",
        [product_name, product_description, price, quantity_available, height, length, weight, req.params.id]
      );
  
      await pool.execute(
        "UPDATE images SET first_image = ?, second_image = ?, third_image = ?, fourth_image = ?, fifth_image = ? WHERE product_id = ?",
        [firstImage, secondImage, thirdImage, fourthImage, fifthImage, req.params.id]
      );
  
      res.json({ message: "Produit mis à jour avec succès" });
    } catch (err) {
      console.error("Erreur lors de la mise à jour :", err);
      res.status(500).json({ error: "Erreur interne" });
    }
  });
  

router.delete("/:id", async (req, res) => {
    try {
        console.log("Requête DELETE reçue pour le produit avec ID :", req.params.id);

        
        const [products] = await pool.execute("SELECT * FROM products WHERE id = ?", [req.params.id]);
        if (products.length === 0) {
            return res.status(404).json({ message: "Produit non trouvé" });
        }

        console.log("Produit trouvé. Suppression des dépendances...");
        
        await pool.execute("DELETE FROM cart_products WHERE product_id = ?", [req.params.id]);

        console.log("Dépendances supprimées. Suppression du produit...");
        
        await pool.execute("DELETE FROM products WHERE id = ?", [req.params.id]);

        res.json({ message: "Produit supprimé avec succès." });
    } catch (err) {
        console.error("Erreur lors de la suppression :", err);
        res.status(500).json({ error: "Erreur lors de la suppression du produit" });
    }
});



module.exports = router;