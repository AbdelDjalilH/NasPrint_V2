// middleware/adminOnly.js
const jwt = require("jsonwebtoken");

const adminOnly = (req, res, next) => {
    // Le token doit déjà avoir été vérifié et décodé dans `verifyToken`
    const token = req.headers.authorization?.split(" ")[1];

    console.log("Token reçu dans adminOnly:", token); // Pour vérifier si le token est bien passé

    if (!token) {
        return res.status(401).json({ message: "Accès non autorisé, token manquant" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // Utilise le même `JWT_SECRET`
        console.log("Token décodé avec succès:", decoded);

        if (decoded.role !== "Administrateur") { // Vérifie le rôle
            console.warn("Accès refusé. Rôle requis : Administrateur. Rôle actuel :", decoded.role);
            return res.status(403).json({ message: "Accès réservé aux administrateurs" });
        }

        req.user = decoded; // Ajoute l'utilisateur décodé à `req` pour un usage ultérieur
        next(); // Passe au middleware suivant si le rôle est Administrateur
    } catch (error) {
        console.error("Erreur lors de la vérification du token dans adminOnly :", error.message);
        return res.status(403).json({ message: "Token invalide ou expiré" });
    }
};

module.exports = adminOnly;
