const multer = require("multer");
const path = require("path");
const { pool } = require("../database/db-connection");

const express = require("express");
const router = express.Router();

// Configuration de Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/images"); // Dossier où les images sont stockées
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Nom unique
  },
});
const upload = multer({ storage: storage });


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



router.post("/", upload.single("image"), async (req, res) => {
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
  
      const productId = productResult.insertId; // ID du produit créé
  
      // Étape 2 : Ajouter l'image dans la table `images`
      if (req.file) {
        const firstImagePath = `/images/${req.file.filename}`;
        await pool.execute(
          "INSERT INTO images (product_id, first_image) VALUES (?, ?)",
          [productId, firstImagePath]
        );
      }
  
      res.status(201).json({ message: "Produit et image ajoutés avec succès", id: productId });
    } catch (err) {
      console.error("Erreur lors de l'ajout du produit et de l'image :", err);
      res.status(500).json({ error: "Erreur interne du serveur" });
    }
  });
  

router.put("/:id", upload.single('image'), async (req, res) => {
    const { product_name, product_description, price, quantity_available, height, length, weight } = req.body;

    if (!product_name || !product_description || !price || !quantity_available || !height || !length || !weight) {
        return res.status(400).json({ message: "Tous les champs sont requis" });
    }

    try {
        const [products] = await pool.execute("SELECT * FROM products WHERE id = ?", [req.params.id]);
        if (products.length === 0) {
            return res.status(404).json({ message: "Produit non trouvé" });
        }

        // Si une nouvelle image est téléchargée, utilisez-la
        const imageUrl = req.file ? `/images/${req.file.filename}` : products[0].image_url;

        await pool.execute(
            "UPDATE products SET product_name = ?, product_description = ?, price = ?, quantity_available = ?, image_url = ?, height = ?, length = ?, weight = ? WHERE id = ?",
            [product_name, product_description, price, quantity_available, imageUrl, height, length, weight, req.params.id]
        );

        res.json({ message: "Produit mis à jour avec succès" });
    } catch (err) {
        console.error("Erreur lors de la mise à jour :", err);
        res.status(500).json({ error: "Erreur interne" });
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