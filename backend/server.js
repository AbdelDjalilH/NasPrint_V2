const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const { initializeDatabase } = require("./database/initializeDatabase");
const routes = require("./routes/routes");
const authRoutes = require("./routes/authRoutes");
const usersRouter = require("./routes/usersRoutes");

const app = express();

app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());
app.use(cookieParser());
app.use("/users", usersRouter);
app.use("/auth", authRoutes);
app.use("/", routes);

const PORT = 3335;

const startServer = async () => {
    try {
        await initializeDatabase();
        console.log("Base de données initialisée avec succès.");
        
        app.listen(PORT, () => {
            console.log(`j'écoute sur le port ${PORT}`);
        });
    } catch (error) {
        console.error("Erreur lors de l'initialisation de la base de données :", error.message);
    }
};

startServer();



// const rl = readLine.createInterface({
//     input: process.stdin,
//     output: process.stdout
// })

// rl.question("Enter your password: ", async (password) => {
//     const hash = await argon2.hash(password, {type: argon2.argon2id})

//     console.log(`Hash: ${hash}`)

//     rl.question("Re-enter your password: ", async (pw) => {
//         const correct = await argon2.verify(hash, pw)
//         console.log(correct ? "Correct" : "Incorrect")
//         process.exit(0)
//     })
//     })

