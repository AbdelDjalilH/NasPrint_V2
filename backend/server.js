require("dotenv").config(); // Chargez les variables d'environnement au début

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

// Utilisez les variables d'environnement pour la configuration CORS
const corsOptions = {
    origin: process.env.CLIENT_URL,
    credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Route de paiement Stripe
app.post("/stripe/charge", async (req, res) => {
    const { amount, id } = req.body;
    console.log("amount & id :", amount, id);
    try {
        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount, // montant en centimes
            currency: "EUR", // devise
            description: "Votre description de l'entreprise",
            payment_method: id,
            confirm: true,
            return_url: process.env.RETURN_URL, // URL de retour
        });

        res.json({
            message: "Paiement réussi",
            success: true,
            returnUrl: process.env.RETURN_URL, // URL de retour au frontend
        });
    } catch (error) {
        console.log("Erreur lors du paiement:", error);
        res.json({ message: "Le paiement a échoué", success: false });
    }
});

app.post("/create-payment-intent", async (req, res) => {
    try {
        console.log("Corps de la requête reçu :", req.body);
        const { amount, user_id } = req.body;

        if (!amount || !user_id) {
            return res.status(400).send("Le montant et l'user_id sont requis");
        }

        if (typeof amount !== "number" || amount <= 0) {
            return res.status(400).send("Le montant doit être un entier positif");
        }

        const [user] = await pool.execute("SELECT email FROM users WHERE id = ?", [user_id]);
        if (user.length === 0) {
            return res.status(404).send("Utilisateur non trouvé");
        }
        const email = user[0].email;
        console.log("Adresse e-mail de l'utilisateur :", email);

        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount, // Montant en centimes
            currency: "eur",
        });

        const [userAddress] = await pool.execute(
            "SELECT lastname, firstname, number_road, city, postal_code FROM adresses WHERE user_id = ?",
            [user_id]
        );

        if (userAddress.length === 0) {
            return res.status(404).send("Adresse de l'utilisateur non trouvée");
        }

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: "Confirmation de votre paiement",
            text: `Bonjour,\n\nVotre paiement de ${amount / 100} € a été initié avec succès. Voici votre identifiant de paiement : ${paymentIntent.id}.\n\nMerci pour votre commande !\n\nCordialement,\nL'équipe.`,
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error("Erreur lors de l'envoi de l'e-mail :", error);
            } else {
                console.log("E-mail envoyé avec succès :", info.response);
            }
        });

        const { firstname, lastname, number_road, city, postal_code } = userAddress[0];

        // Vérifier si l'utilisateur a un panier actif, sinon en créer un
        let cartId;
        const [cart] = await pool.execute("SELECT id FROM cart WHERE user_id = ?", [user_id]);
        if (cart.length === 0) {
            // Créer un panier pour l'utilisateur
            await pool.execute("INSERT INTO cart (user_id, date_creation) VALUES (?, CURDATE())", [user_id]);
            const [newCart] = await pool.execute("SELECT id FROM cart WHERE user_id = ?", [user_id]);
            cartId = newCart[0].id;
            console.log("Nouveau panier créé avec ID :", cartId);
        } else {
            cartId = cart[0].id;
            console.log("ID du panier existant :", cartId);
        }

        // Récupérer les informations des produits dans le panier
        const [cartProducts] = await pool.execute(
            `SELECT cp.quantity, p.product_name
             FROM cart_products cp
             JOIN products p ON cp.product_id = p.id
             WHERE cp.cart_id = ?`,
            [cartId]
        );

        // Log des résultats de la requête SQL
        console.log("Produits dans le panier :", cartProducts);

        // Construire le contenu de l'e-mail avec les informations des produits
        let productDetails = "";
        if (cartProducts.length > 0) {
            cartProducts.forEach((product) => {
                productDetails += `- Produit : ${product.product_name}, Quantité : ${product.quantity}\n`;
            });
        } else {
            productDetails = "Aucun produit trouvé dans le panier.";
        }

        const mailOptions2 = {
            from: process.env.EMAIL_USER,
            to: "adj.hamzaoui@gmail.com",
            subject: "Nouvelle commande",
            text: `Bonjour,\n\nVous avez reçu une nouvelle commande d'un montant de ${amount / 100} €.\n\nInformations du client :\n- Prénom : ${firstname}\n- Nom : ${lastname}\n- Adresse : ${number_road}\n- Ville : ${city}\n- Code postal : ${postal_code}\n\nIdentifiant de paiement : ${paymentIntent.id}\n\nDétails des produits :\n${productDetails}\n\nCordialement,\nL'équipe.`,
        };

        transporter.sendMail(mailOptions2, (error, info) => {
            if (error) {
                console.error("Erreur lors de l'envoi de l'e-mail :", error);
            } else {
                console.log("E-mail envoyé avec succès :", info.response);
            }
        });

        res.send({
            clientSecret: paymentIntent.client_secret,
            cartProducts: cartProducts,
        });
    } catch (error) {
        console.error("Erreur lors de la création du PaymentIntent :", error);
        res.status(500).send("Erreur lors de la création du PaymentIntent");
    }
});

// Middleware pour logger les requêtes
app.use((req, res, next) => {
    console.log(`Received ${req.method} request for '${req.url}'`);
    next();
});

// Route de test pour vérifier CORS
app.get("/test-cors", (req, res) => {
    res.json({ message: "CORS fonctionne!" });
});

// Configurez les routes
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
    console.error("Erreur serveur:", err.stack);
    res.status(500).send("Quelque chose s'est mal passé !");
});

// Utilisez la variable d'environnement pour le port avec une valeur par défaut
const PORT = process.env.APP_PORT || 3335;

app.listen(PORT, async () => {
    console.log(`Serveur démarré sur le port ${PORT}`);
    await initializeDatabase();
});
