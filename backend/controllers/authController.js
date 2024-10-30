const argon2 = require("argon2");
const jwt = require("jsonwebtoken");
const { findOneByEmail, createUser } = require("../models/user");

// Messages d'erreur
const ERROR_MESSAGES = {
    INTERNAL_SERVER_ERROR: "Erreur interne du serveur",
    INVALID_CREDENTIALS: "Identifiants incorrects",
    USER_EXISTS: "L'utilisateur avec cet email existe déjà.",
    MISSING_FIELDS: "Veuillez fournir tous les champs requis.",
};

// Fonction de connexion (Login)
const login = async (req, res) => {
    const { email, password } = req.body;
    console.log("Données de connexion reçues :", req.body);

    try {
        const user = await findOneByEmail(email.toLowerCase());
        console.log('Utilisateur trouvé :', user);

        if (!user) {
            return res.status(401).json({ message: ERROR_MESSAGES.INVALID_CREDENTIALS });
        }

        const passwordMatch = await argon2.verify(user.password, password);
        console.log('Correspondance de mot de passe :', passwordMatch);

        if (!passwordMatch) {
            return res.status(401).json({ message: ERROR_MESSAGES.INVALID_CREDENTIALS });
        }

        // Générer un token JWT
        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );
        console.log('Token JWT généré :', token);

        res.status(200).json({ user: { id: user.id, email: user.email, role: user.role }, token });
    } catch (error) {
        console.error("Erreur lors de la connexion :", error);
        res.status(500).json({ message: ERROR_MESSAGES.INTERNAL_SERVER_ERROR });
    }
};

// Fonction d'inscription (Register)
const register = async (req, res) => {
    console.log("Contenu de req.body dans register :", req.body); // Vérifiez ce qui est reçu

    const { email, password, username } = req.body || {}; // Ajoutez des valeurs par défaut pour éviter `undefined`
    
    if (!email || !password || !username) {
        console.error("Champs manquants dans la requête : ", { email, password, username });
        return res.status(400).json({ success: false, message: ERROR_MESSAGES.MISSING_FIELDS });
    }

    try {
        const existingUser = await findOneByEmail(email.toLowerCase());
        if (existingUser) {
            return res.status(400).json({ success: false, message: ERROR_MESSAGES.USER_EXISTS });
        }

        const hashedPassword = await argon2.hash(password);
        console.log("Mot de passe hashé :", hashedPassword);

        const userId = await createUser({
            email: email.toLowerCase(),
            password: hashedPassword,
            username,
        });

        res.status(201).json({ success: true, message: "Utilisateur enregistré avec succès.", userId });
    } catch (error) {
        console.error("Erreur lors de l'enregistrement de l'utilisateur :", error);
        res.status(500).json({ success: false, message: ERROR_MESSAGES.INTERNAL_SERVER_ERROR });
    }
};

module.exports = {
    login,
    register,
};

