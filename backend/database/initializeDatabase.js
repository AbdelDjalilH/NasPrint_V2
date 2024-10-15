const fs = require("fs");
const path = require("path");
const pool = require("./db-connection");

const initializeDatabase = async () => {
    try {
        const sqlPath = path.join( __dirname, 'datas.sql');
        const sql = fs.readFileSync(sqlPath, "utf-8");

        const queries = sql
            .split(";")
            .map((query) => query.trim())
            .filter((query) => query.length);
        
        for (const query of queries) {
            console.log("Executing query:", query);  // Log chaque requête
            await pool.query(query);
        }
        console.log("Database initialized successfully.");
    } catch (error) {
        console.error("Error initializing database:", error.message); // Log l'erreur
    }
};

module.exports = { initializeDatabase };