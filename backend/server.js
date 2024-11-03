const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv"); // Importez dotenv pour utiliser le fichier .env

dotenv.config(); // Chargez les variables d'environnement avant de les utiliser

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


const app = express();

// Utilisez les variables d'environnement pour la configuration CORS
const corsOptions = {
    origin: process.env.CLIENT_URL,
    credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());



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

// Gestion des erreurs
app.use((err, req, res, next) => {
    console.error("Erreur serveur:", err.stack);
    res.status(500).send("Quelque chose s'est mal passé !");
});

// Utilisez la variable d'environnement pour le port
const PORT = process.env.APP_PORT || 3335; // Si APP_PORT n'est pas défini, utilisez 3335

app.listen(PORT, async () => {
    console.log(`Salut, j'écoute sur le port ${PORT}`);
    await initializeDatabase();
});
