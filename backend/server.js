// Ce fichier sert à générer un serveur express qui écoute sur un port donné

const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const {initializeDatabase} = require("./database/initializeDatabase")

const routes = require("./routes/routes");
const authRoutes = require("./routes/authRoutes");
const usersRouter = require("./routes/usersRoutes");

const app = express();

app.use(cors({origin: "http://localhost:5173", credentials: true}));

app.use(express.json());
app.use(cookieParser());
app.use("/users", usersRouter);
app.use("/auth", authRoutes);
app.use("/", routes);

const PORT = 3335;

app.listen(PORT, () => {
    console.log(`j'écoute sur le port ${PORT}`);
});
