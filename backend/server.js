require("dotenv").config(); 

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
const uploadRouter = require("./routes/uploadRoutes");

const app = express();


const corsOptions = {
    origin: process.env.CLIENT_URL,
    credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static('public'));


app.post("/create-payment-intent", async (req, res) => {
    try {
        console.log("Requête reçue :", req.body);
        const { amount, user_id } = req.body;

        
        if (!amount || !user_id) {
            return res.status(400).send("Le montant et l'ID utilisateur sont requis.");
        }

        if (typeof amount !== "number" || amount <= 0) {
            return res.status(400).send("Le montant doit être un entier positif.");
        }

        
        const [user] = await pool.execute("SELECT email FROM users WHERE id = ?", [user_id]);
        if (user.length === 0) {
            return res.status(404).send("Utilisateur non trouvé.");
        }
        const email = user[0].email;
        console.log("Adresse e-mail de l'utilisateur :", email);

        
        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount, 
            currency: "eur",
        });

        
        const [userAddress] = await pool.execute(
            "SELECT lastname, firstname, number_road, city, postal_code FROM adresses WHERE user_id = ?",
            [user_id]
        );

        if (userAddress.length === 0) {
            return res.status(404).send("Adresse de l'utilisateur non trouvée.");
        }

        const { firstname, lastname, number_road, city, postal_code } = userAddress[0];

        
        let cartId;
        const [cart] = await pool.execute("SELECT id FROM cart WHERE user_id = ?", [user_id]);
        if (cart.length === 0) {
            
            await pool.execute("INSERT INTO cart (user_id, date_creation) VALUES (?, CURDATE())", [user_id]);
            const [newCart] = await pool.execute("SELECT id FROM cart WHERE user_id = ?", [user_id]);
            cartId = newCart[0].id;
            console.log("Nouveau panier créé avec ID :", cartId);
        } else {
            cartId = cart[0].id;
            console.log("ID du panier existant :", cartId);
        }

        
        let cartProducts = [];
        try {
            const [results] = await pool.execute(
                `SELECT cp.quantity, p.product_name
                 FROM cart_products cp
                 JOIN products p ON cp.product_id = p.id
                 WHERE cp.cart_id = ?`,
                [cartId]
            );
            cartProducts = results;
            console.log("Produits récupérés pour le panier :", cartProducts);
        } catch (error) {
            console.error("Erreur lors de la récupération des produits du panier :", error);
        }

       
        let productDetails = "";
        if (cartProducts.length > 0) {
            cartProducts.forEach((product) => {
                productDetails += `- Produit : ${product.product_name}, Quantité : ${product.quantity}\n`;
            });
        } else {
            productDetails = "Aucun produit trouvé dans le panier.";
        }
        console.log("Détails des produits pour l'email :", productDetails);

       
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
            text: `Bonjour ${firstname},\n\nVotre paiement de ${amount / 100} € a été initié avec succès. Détails des produits :\n${productDetails} \n\nVoici votre identifiant de paiement : ${paymentIntent.id}.\n\nMerci pour votre commande !\n\nCordialement,\nL'équipe.`,
        };

        transporter.sendMail(mailOptionsUser, (error, info) => {
            if (error) {
                console.error("Erreur lors de l'envoi de l'e-mail utilisateur :", error);
            } else {
                console.log("E-mail utilisateur envoyé avec succès :", info.response);
            }
        });

        
        const mailOptionsAdmin = {
            from: process.env.EMAIL_USER,
            to: "adj.hamzaoui@gmail.com",
            subject: "Nouvelle commande",
            text: `Bonjour,\n\nVous avez reçu une nouvelle commande d'un montant de ${amount / 100} €.\n\nInformations du client :\n- Prénom : ${firstname}\n- Nom : ${lastname}\n- Adresse : ${number_road}\n- Ville : ${city}\n- Code postal : ${postal_code}\n\nIdentifiant de paiement : ${paymentIntent.id}\n\nDétails des produits :\n${productDetails}\n\nCordialement,\nL'équipe.`,
        };

        transporter.sendMail(mailOptionsAdmin, (error, info) => {
            if (error) {
                console.error("Erreur lors de l'envoi de l'e-mail administrateur :", error);
            } else {
                console.log("E-mail administrateur envoyé avec succès :", info.response);
            }
        });
        await pool.execute("DELETE FROM cart_products WHERE cart_id = ?", [cartId]);
       
        res.send({
            clientSecret: paymentIntent.client_secret,
            cartProducts: cartProducts,
        });
    } catch (error) {
        console.error("Erreur lors de la création du PaymentIntent :", error);
        res.status(500).send("Erreur lors de la création du PaymentIntent");
    }
});



app.use((req, res, next) => {
    console.log(`Received ${req.method} request for '${req.url}'`);
    next();
});


app.get("/test-cors", (req, res) => {
    res.json({ message: "CORS fonctionne!" });
});

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

app.use("/upload", uploadRouter);

app.use((err, req, res, next) => {
    console.error("Erreur serveur:", err.stack);
    res.status(500).send("Quelque chose s'est mal passé !");
});

const PORT = process.env.PORT || 3335;


app.listen(PORT, async () => {
    console.log(`Serveur démarré sur le port ${PORT}`);
    await initializeDatabase();
});
