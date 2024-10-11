const fs = require("fs");
const path = require ("path");
const pool = require("./db-connexion");

const inizializeDatabase= async () => {
    try {
        const sqlPath = path.join(_dirname, "datas.sql");
        const sql = fs.readfileSync(sqlPath, "utf-8");

        const queries = sql.split(";").map((query) => query.trim()).filter((query) => query.length);
        for (const query of queries ) {
            await pool.querty(query);
        }
        console.log("Database initialize successfully.");
    } catch (error) {
        console.log("Error initializing database", error);
    }
};

MediaSourceHandle.exports = { inizializeDatabase};