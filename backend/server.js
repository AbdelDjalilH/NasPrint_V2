// Ce fichier sert à générer un serveur express qui écoute sur un port donné

const express = require("express");
const cors = require("cors");
const usersRouter = require("./routes/usersRoutes");
const routes = require("./routes/routes");

const PORT = 3335;
const app = express();

app.use(express.json());
app.use("/users", usersRouter);
app.use("/", routes);

app.listen(PORT, () => {
    console.log(`j'écoute sur le port ${PORT}`);
});
