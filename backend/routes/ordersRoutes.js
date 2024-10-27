const router = require("express").Router();
const { pool } = require("../database/db-connection"); 

router.get("/", async (req, res) => {
    try {
        const [orders] = await pool.execute("SELECT * FROM orders INNER JOIN users ON orders.user_id = users.id INNER JOIN payments ON orders.payment_id = payments.id INNER JOIN adresses ON orders.address_id = adresses.id");
        res.json(orders);
    } catch (err) {
        res.status(500).json({ error: "Erreur lors de la récupération des commandes" });
    }
});

router.get("/:id", async (req, res) => {
    try {
        const [orders] = await pool.execute(
            "SELECT * FROM orders INNER JOIN users ON orders.user_id = users.id INNER JOIN payments ON orders.payment_id = payments.id INNER JOIN adresses ON orders.address_id = adresses.id WHERE orders.id = ?",
            [req.params.id]
        );
        if (orders.length === 0) {
            return res.status(404).json({ message: "Commande non trouvée" });
        }
        res.json(orders[0]); 
    } catch (err) {
        res.status(500).json({ error: "Erreur lors de la récupération de la commande" });
    }
});

router.post("/", async (req, res) => {
    const { user_id, payment_id, address_id, order_date, order_status, total_rising } = req.body;

    console.log("Données reçues : ", req.body);

    const requiredFields = [user_id, payment_id, address_id, order_date, order_status, total_rising];
    if (requiredFields.some(field => field === undefined || field === null)) {
        return res.status(400).json({ message: "Tous les champs sont requis" });
    }

    try {
        const [user, payment, address] = await Promise.all([
            pool.execute("SELECT * FROM users WHERE id = ?", [user_id]),
            pool.execute("SELECT * FROM payments WHERE id = ?", [payment_id]),
            pool.execute("SELECT * FROM adresses WHERE id = ?", [address_id])
        ]);

        if (user.length === 0) return res.status(404).json({ message: "Utilisateur non trouvé" });
        if (payment.length === 0) return res.status(404).json({ message: "Paiement non trouvé" });
        if (address.length === 0) return res.status(404).json({ message: "Adresse non trouvée" });

        const [result] = await pool.execute(
            "INSERT INTO orders (user_id, payment_id, address_id, order_date, order_status, total_rising) VALUES (?, ?, ?, ?, ?, ?)",
            [user_id, payment_id, address_id, order_date, order_status, total_rising]
        );
        res.status(201).json({ message: "Commande créée", id: result.insertId });
    } catch (err) {
        console.error("Erreur lors de la création de la commande :", err);
        res.status(500).json({ error: "Erreur lors de la création de la commande" });
    }
});

router.put("/:id", async (req, res) => {
    const { user_id, payment_id, address_id, order_date, order_status, total_rising } = req.body;

    if (!user_id || !payment_id || !address_id || !order_date || !order_status || total_rising === undefined) {
        return res.status(400).json({ message: "Tous les champs sont requis" });
    }

    try {
        const [orders] = await pool.execute("SELECT * FROM orders WHERE id = ?", [req.params.id]);

        if (orders.length === 0) {
            return res.status(404).json({ message: "Commande non trouvée" });
        }

        const [user] = await pool.execute("SELECT * FROM users WHERE id = ?", [user_id]);
        const [payment] = await pool.execute("SELECT * FROM payments WHERE id = ?", [payment_id]);
        const [address] = await pool.execute("SELECT * FROM adresses WHERE id = ?", [address_id]);

        if (user.length === 0) {
            return res.status(404).json({ message: "Utilisateur non trouvé" });
        }
        
        if (payment.length === 0) {
            return res.status(404).json({ message: "Paiement non trouvé" });
        }
        
        if (address.length === 0) {
            return res.status(404).json({ message: "Adresse non trouvée" });
        }

        await pool.execute(
            "UPDATE orders SET user_id = ?, payment_id = ?, address_id = ?, order_date = ?, order_status = ?, total_rising = ? WHERE id = ?",
            [user_id, payment_id, address_id, order_date, order_status, total_rising, req.params.id]
        );

        res.json({ message: "Commande mise à jour avec succès" });
    } catch (err) {
        console.error("Erreur lors de la mise à jour de la commande :", err);
        res.status(500).json({ error: "Erreur lors de la mise à jour de la commande" });
    }
});

router.delete("/:id", async (req, res) => {
    try {
        const [orders] = await pool.execute("SELECT * FROM orders WHERE id = ?", [req.params.id]);

        if (orders.length === 0) {
            return res.status(404).json({ message: "Commande non trouvée" });
        }

        await pool.execute("DELETE FROM orders WHERE id = ?", [req.params.id]);
        res.json({ message: "Commande supprimée" });
    } catch (err) {
        console.error("Erreur lors de la suppression de la commande :", err);
        res.status(500).json({ error: "Erreur lors de la suppression de la commande" });
    }
});

module.exports = router;
