const fs = require("fs");
const path = require("path");
const { pool, addUserOrUpdate } = require("./db-connection");

const initializeDatabase = async () => {
    const connection = await pool.getConnection();
    
    try {
       
        const sqlPath = path.join(__dirname, 'datas.sql');
        if (!fs.existsSync(sqlPath)) {
            console.error("Le fichier datas.sql est introuvable dans le répertoire.");
            return;
        }

        const sql = fs.readFileSync(sqlPath, "utf-8");
        const queries = sql
            .split(";")
            .map((query) => query.trim())
            .filter((query) => query.length);

       
        await connection.beginTransaction();

        for (const query of queries) {
            console.log("Executing query:", query);
            await connection.query(query);
        }
        console.log("Base de données initialisée avec succès.");

        
        await addUserOrUpdate("adj.hamzaoui@gmail.com", "adj", "Iamthebest","Administrateur","2024-10-20");
        await addUserOrUpdate("adjo@adjo.dz", "adjo", "Youarethebest","Utilisateur","2024-10-21");
       

       
        await connection.commit();
        console.log("Utilisateurs ajoutés avec succès.");

    } catch (error) {
        
        await connection.rollback();
        console.error("Erreur lors de l'initialisation de la base de données :", error.message);
    } finally {
        connection.release();
    }
};

module.exports = { initializeDatabase };


