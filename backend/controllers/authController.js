const argon2 = require("argon2");
const jwt = require("jsonwebtoken");
const { findOneByEmail, createUser } = require("../models/user");
const sendWelcomeEmail = require("../services/sendWelcomeEmail");
const otpGenerator = require("otp-generator");
const { saveOtp, findOtpByEmail, deleteOtp } = require("../models/otp");

const ERROR_MESSAGES = {
    INTERNAL_SERVER_ERROR: "Erreur interne du serveur",
    INVALID_CREDENTIALS: "Identifiants incorrects",
    USER_EXISTS: "L'utilisateur avec cet email existe déjà.",
    MISSING_FIELDS: "Veuillez fournir tous les champs requis.",
    INVALID_OTP: "OTP invalide ou expiré.",
};

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

const register = async (req, res) => {
    const { email, password, username } = req.body || {};
    console.log("Données reçues pour inscription :", { email, username, password });

    if (!email || !password || !username) {
        return res.status(400).json({ success: false, message: ERROR_MESSAGES.MISSING_FIELDS });
    }

    try {
        const existingUser = await findOneByEmail(email.toLowerCase());
        console.log("Utilisateur existant :", existingUser);

        if (existingUser) {
            return res.status(400).json({ success: false, message: ERROR_MESSAGES.USER_EXISTS });
        }

        const otp = otpGenerator.generate(6, { upperCaseAlphabets: false, specialChars: false });
        console.log("OTP généré :", otp);

        await saveOtp(email, otp);
        console.log("OTP enregistré dans la base de données pour :", email);

        const subject = "Code de vérification de votre compte";
        const text = `Votre code de vérification est : ${otp}`;
        await sendWelcomeEmail(email, subject, text);
        console.log("Email envoyé à :", email);

        res.status(200).json({ success: true, message: "Code OTP envoyé à votre e-mail." });
    } catch (error) {
        console.error("Erreur lors de l'enregistrement de l'utilisateur :", error);
        res.status(500).json({ success: false, message: ERROR_MESSAGES.INTERNAL_SERVER_ERROR });
    }
};

const verifyOtp = async (req, res) => {
    const { email, otp } = req.body;
    console.log("Vérification OTP pour :", { email, otp });

    if (!email || !otp) {
        return res.status(400).json({ success: false, message: "Email et OTP requis." });
    }

    try {
        const storedOtp = await findOtpByEmail(email);
        console.log("OTP récupéré de la base de données :", storedOtp);

        if (!storedOtp || storedOtp.otp !== otp) {
            return res.status(400).json({ success: false, message: ERROR_MESSAGES.INVALID_OTP });
        }

        await deleteOtp(email);
        console.log("OTP supprimé pour :", email);

        res.status(200).json({ success: true, message: "OTP validé avec succès." });
    } catch (error) {
        console.error("Erreur lors de la vérification de l'OTP :", error);
        res.status(500).json({ success: false, message: ERROR_MESSAGES.INTERNAL_SERVER_ERROR });
    }
};

module.exports = {
    login,
    register,
    verifyOtp,
};
