
// middleware/verifyToken.js
const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
        console.log("Token manquant dans l'en-tête d'autorisation");
        return res.status(401).json({ message: 'Accès non autorisé, token manquant' });
    }

    const token = authHeader.split(' ')[1];
    console.log('Token reçu dans le middleware verifyToken:', token);

    if (!token) return res.status(403).json({ message: 'Token manquant' });

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            console.error("Erreur lors de la vérification du token :", err.message);
            return res.status(403).json({ message: 'Token invalide ou expiré' });
        }

        console.log("Token valide, utilisateur décodé :", user);
        req.user = user; // Ajoute les informations utilisateur au `req` pour un usage ultérieur
        next(); // Passe au middleware suivant
    });
};

module.exports = verifyToken;
