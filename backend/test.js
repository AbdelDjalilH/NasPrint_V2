const { pool } = require("./database/db-connection");

(async () => {
    const cartId = 4; // ID du panier à tester
    try {
        // Ajoutez un produit au panier
        await pool.execute(
            `INSERT INTO cart_products (cart_id, product_id, quantity) VALUES (?, ?, ?)`,
            [cartId, 1, 1] // Exemple : produit ID 1 avec une quantité de 1
        );
        console.log("Produit ajouté au panier :", cartId);

        // Récupérez les produits du panier
        const [products] = await pool.execute(
            `SELECT cp.quantity, p.product_name
             FROM cart_products cp
             JOIN products p ON cp.product_id = p.id
             WHERE cp.cart_id = ?`,
            [cartId]
        );
        console.log("Produits récupérés :", products);
    } catch (error) {
        console.error("Erreur :", error);
    }
})();