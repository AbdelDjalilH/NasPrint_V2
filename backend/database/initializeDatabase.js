const fs = require("fs");
const path = require("path");
const { pool, addUserOrUpdate } = require("./db-connection"); 

const initializeDatabase = async () => {
    try {
        const sqlPath = path.join(__dirname, 'datas.sql');
        const sql = fs.readFileSync(sqlPath, "utf-8");

        const queries = sql
            .split(";")
            .map((query) => query.trim())
            .filter((query) => query.length);
        
        for (const query of queries) {
            console.log("Executing query:", query);
            await pool.query(query);
        }
        console.log("Database initialized successfully.");

        
        await addUserOrUpdate("adj@adj.com", "adj", "Iamthebest");
        await addUserOrUpdate("adjo@adjo.dz", "adjo", "Youarethebest");
        await addUserOrUpdate("adji@adji.dz", "adji", "Heisthebest");
    } catch (error) {
        console.error("Error initializing database:", error.message);
    }
};

module.exports = { initializeDatabase };

