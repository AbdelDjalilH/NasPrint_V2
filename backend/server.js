require("dotenv").config(); // Charger les variables d'environnement au début

const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const stripe = require("stripe")(process.env.STRIPE_SECRET_TEST);
const nodemailer = require("nodemailer");
const { pool } = require("./database/db-connection");
const { initializeDatabase } = require("./database/initializeDatabase");

const routes = require("./routes/routes");
const authRoutes = require("./routes/authRoutes");
const usersRouter = require("./routes/usersRoutes");
const productsRouter = require("./routes/productsRoutes");
const categoriesRouter = require("./routes/categoriesRoutes");
const paymentsRouter = require("./routes/paymentsRoutes");
const adressesRouter = require("./routes/adressesRoutes");
const cartRouter = require("./routes/cartRoutes");
const cartProductRouter = require("./routes/cart_productRoutes");
const noticesRouter = require("./routes/noticesRoutes");
const ordersRouter = require("./routes/ordersRoutes");
const imagesRouter = require("./routes/imagesRoutes");

const app = express();

// Configuration CORS
const corsOptions = {
    origin: process.env.CLIENT_URL,
    credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Route de paiement Stripe
app.post("/create-payment-intent", async (req, res) => {
    try {
        const { amount, user_id } = req.body;

        // Validation des champs requis
        if (!amount || !user_id) {
            return res.status(400).json({ error: "Le montant et l'ID utilisateur sont requis." });
        }

        // Récupération de l'utilisateur
        const [user] = await pool.execute("SELECT email FROM users WHERE id = ?", [user_id]);
        if (user.length === 0) return res.status(404).json({ error: "Utilisateur non trouvé." });
        const email = user[0].email;

        // Création du PaymentIntent
        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount,
            currency: "eur",
        });

        // Récupération de l'adresse de l'utilisateur
        const [userAddress] = await pool.execute(
            "SELECT lastname, firstname, number_road, city, postal_code FROM adresses WHERE user_id = ?",
            [user_id]
        );
        if (userAddress.length === 0) {
            return res.status(404).json({ error: "Adresse non trouvée." });
        }
        const { firstname, lastname, number_road, city, postal_code } = userAddress[0];

        // Gestion du panier (existant ou nouveau)
        const [cart] = await pool.execute("SELECT id FROM cart WHERE user_id = ?", [user_id]);
        let cartId;
        if (cart.length === 0) {
            console.log(`Création d'un nouveau panier pour l'utilisateur ${user_id}.`);
            const [newCart] = await pool.execute(
                "INSERT INTO cart (user_id, date_creation) VALUES (?, CURDATE())",
                [user_id]
            );
            cartId = newCart.insertId;
        } else {
            cartId = cart[0].id;
        }

        console.log("Cart ID utilisé :", cartId);

        // Récupération des produits dans le panier
        const [results] = await pool.execute(
            `SELECT cp.quantity, p.product_name
             FROM cart_products cp
             JOIN products p ON cp.product_id = p.id
             WHERE cp.cart_id = ?`,
            [cartId]
        );
        console.log(results);
        const cartProducts = results || [];
        const productDetails =
    results.length > 0
        ? results
              .map(
                  (item) =>
                      `Produit : ${item.product_name}, Quantité : ${item.quantity}`
              )
              .join("\n")
        : "Aucun produit trouvé dans le panier.";

console.log("Détails des produits formatés :", productDetails);


        // Configuration de l'envoi d'emails
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const mailOptionsUser = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: "Confirmation de votre paiement",
            text: `Bonjour ${firstname},\n\nVotre paiement de ${amount / 100} € a été initié avec succès.\n\nDétails des produits :\n${productDetails}\n\nCordialement,\nL'équipe.`,
        };

        transporter.sendMail(mailOptionsUser, error => {
            if (error) console.error("Erreur lors de l'envoi du mail utilisateur :", error);
        });

        const mailOptionsAdmin = {
            from: process.env.EMAIL_USER,
            to: "adj.hamzaoui@gmail.com",
            subject: "Nouvelle commande",
            text: `Bonjour,\n\nVous avez reçu une nouvelle commande d'un montant de ${amount / 100} €.\n\nInformations du client :\n- Prénom : ${firstname}\n- Nom : ${lastname}\n- Adresse : ${number_road}\n- Ville : ${city}\n- Code postal : ${postal_code}\n\nIdentifiant de paiement : ${paymentIntent.id}\n\nDétails des produits :\n${productDetails}\n\nCordialement,\nL'équipe.`,
        };

        transporter.sendMail(mailOptionsAdmin, error => {
            if (error) console.error("Erreur lors de l'envoi du mail admin :", error);
        });

        // Réponse au client
        res.json({ clientSecret: paymentIntent.client_secret, cartProducts });
    } catch (error) {
        console.error("Erreur lors de la création du paiement :", error);
        res.status(500).json({ error: "Erreur lors de la création du paiement." });
    }
});

// Logger les requêtes
app.use((req, res, next) => {
    console.log(`Requête ${req.method} reçue sur '${req.url}'`);
    next();
});

// Configuration des routes
app.use("/users", usersRouter);
app.use("/auth", authRoutes);
app.use("/", routes);
app.use("/products", productsRouter);
app.use("/categories", categoriesRouter);
app.use("/payments", paymentsRouter);
app.use("/adresses", adressesRouter);
app.use("/cart", cartRouter);
app.use("/cart_product", cartProductRouter);
app.use("/notices", noticesRouter);
app.use("/orders", ordersRouter);
app.use("/images", imagesRouter);

// Gestion des erreurs
app.use((err, req, res, next) => {
    console.error("Erreur serveur :", err.stack);
    res.status(500).send("Erreur serveur !");
});

// Lancer le serveur
const PORT = process.env.APP_PORT || 3335;

app.listen(PORT, async () => {
    console.log(`Serveur démarré sur le port ${PORT}`);
    await initializeDatabase();
});
