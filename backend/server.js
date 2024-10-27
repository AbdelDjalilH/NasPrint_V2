const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

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

app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());
app.use(cookieParser());

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

const PORT = 3335;

app.listen(PORT, async () => {
    console.log(`Salut j'écoute sur le port ${PORT}`);
    await initializeDatabase();
});



