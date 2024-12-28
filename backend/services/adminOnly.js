
const jwt = require("jsonwebtoken");

const adminOnly = (req, res, next) => {
    
    const token = req.headers.authorization?.split(" ")[1];

    console.log("Token reçu dans adminOnly:", token); 

    if (!token) {
        return res.status(401).json({ message: "Accès non autorisé, token manquant" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET); 
        console.log("Token décodé avec succès:", decoded);

        if (decoded.role !== "Administrateur") { 
            console.warn("Accès refusé. Rôle requis : Administrateur. Rôle actuel :", decoded.role);
            return res.status(403).json({ message: "Accès réservé aux administrateurs" });
        }

        req.user = decoded; 
        next(); 
    } catch (error) {
        console.error("Erreur lors de la vérification du token dans adminOnly :", error.message);
        return res.status(403).json({ message: "Token invalide ou expiré" });
    }
};

module.exports = adminOnly;
