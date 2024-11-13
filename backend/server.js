require("dotenv").config(); // Chargez les variables d'environnement au début

const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const stripe = require("stripe")(process.env.STRIPE_SECRET_TEST);
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
const { pool} = require("./database/db-connection");

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
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.json());
app.use(cookieParser());

// Route de paiement Stripe
app.post("/stripe/charge", async (req, res) => {
    const { amount, id } = req.body;
    console.log("amount & id :", amount, id);
    try {
        // Création d'une intention de paiement avec Stripe
        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount, // montant en centimes
            currency: "EUR", // devise
            description: "Votre description de l'entreprise",
            payment_method: id,
            confirm: true,
            return_url: process.env.RETURN_URL  // Utilisation de la variable d'environnement pour la redirection
        });

        // Si le paiement est réussi, renvoyer un message de succès avec l'URL de retour
        res.json({
            message: "Paiement réussi",
            success: true,
            returnUrl: process.env.RETURN_URL  // Renvoie l'URL de retour au frontend
        });
    } catch (error) {
        console.log("Erreur lors du paiement:", error);
        res.json({
            message: "Le paiement a échoué",
            success: false,
        });
    }
});


app.post("/create-payment-intent", async (req, res) => {
  try {
    console.log("Corps de la requête reçu :", req.body);
      const { amount, user_id } = req.body;

      // Validation des données
      if (!amount || !user_id) {
          return res.status(400).send("Le montant et l'user_id sont requis");
      }

      // Vérifiez que `amount` est un entier positif
      if (typeof amount !== "number" || amount <= 0) {
          return res.status(400).send("Le montant doit être un entier positif");
      }

      // Récupérez l'adresse e-mail de l'utilisateur à partir de la base de données
      const [user] = await pool.execute("SELECT email FROM users WHERE id = ?", [user_id]);
      if (user.length === 0) {
          return res.status(404).send("Utilisateur non trouvé");
      }
      const email = user[0].email;
      console.log("Adresse e-mail de l'utilisateur :", email);

      // Créez l'intention de paiement avec Stripe
      const paymentIntent = await stripe.paymentIntents.create({
          amount: amount, // Montant en centimes
          currency: "eur",
      });
      // Configurez le transporteur `nodemailer`
      const transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
              user: process.env.EMAIL_USER,
              pass: process.env.EMAIL_PASS,
          },
      });

      // Options de l'e-mail
      const mailOptions = {
          from: process.env.EMAIL_USER,
          to: email, // Utilisez l'adresse e-mail récupérée
          subject: "Confirmation de votre paiement",
          text: `Bonjour,\n\nVotre paiement de ${amount / 100} € a été initié avec succès. Voici votre identifiant de paiement : ${paymentIntent.id}.\n\nMerci pour votre commande !\n\nCordialement,\nL'équipe.`,
      };

      // Envoyez l'e-mail
      transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
              console.error("Erreur lors de l'envoi de l'e-mail :", error);
          } else {
              console.log("E-mail envoyé avec succès :", info.response);
          }
      });

      // Réponse avec le client_secret
      res.send({
        clientSecret: paymentIntent.client_secret,
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
