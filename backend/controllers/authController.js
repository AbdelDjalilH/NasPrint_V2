const argon2 = require("argon2");
const { findOneByEmail, createUser } = require("../models/user");



// Assurez-vous d'importer createUser
// const browse = async (req, res, next) => {
//     try {
//       const users = await users.browse();
//       res.json(users);
//     } catch (error) {
//       next(error);
//     }
//   };

//   const readOneById = async (req, res, next) => {
//     try {
//       const user = await users.readOneById(req.params.id);
//       res.json(user);
//     } catch (error) {
//       next(error);
//     }
//   };



// Fonction de connexion (Login)
const login = async (req, res) => {
    const { email, password } = req.body;
    console.log("Mot de passe reçu : ", password);

    try {
        // Recherche de l'utilisateur dans la base de données par email
        const user = await findOneByEmail(email.toLowerCase()); // Normaliser l'email
        console.log('Utilisateur trouvé :', user);

        // Si l'utilisateur n'existe pas, renvoyer une erreur
        if (!user) {
            return res.status(401).json({ message: "Identifiants incorrects" });
        }

        // Vérification du mot de passe avec Argon2
        const passwordMatch = await argon2.verify(user.password, password);

        // Si le mot de passe ne correspond pas, renvoyer une erreur
        if (!passwordMatch) {
            return res.status(401).json({ message: "Identifiants incorrects" });
        }

        // Si tout est bon, renvoyer une réponse avec les informations de l'utilisateur
        res.status(200).json({ user: { id: user.id, email: user.email, role: "ADMIN" } });
    } catch (error) {
        console.error("Erreur lors de la connexion :", error);
        res.status(500).json({ message: "Erreur interne du serveur" });
    }
};

// Fonction d'inscription (Register)
const register = async (req, res) => {
    const { email, password, username } = req.body; // Assurez-vous d'extraire lastname
    console.log("Email reçu : ", email);

    // Vérification des champs obligatoires
    if (!email || !password || !username  ) {
        return res.status(400).json({ success: false, message: "Veuillez fournir tous les champs requis." });
    }

    try {
        // Vérifier si l'utilisateur existe déjà dans la base de données
        const existingUser = await findOneByEmail(email.toLowerCase());
        if (existingUser) {
            return res.status(400).json({ success: false, message: "L'utilisateur avec cet email existe déjà." });
        }

        // Hasher le mot de passe avec Argon2
        const hashedPassword = await argon2.hash(password);
        console.log("Mot de passe hashé :", hashedPassword);

        // Création de l'utilisateur dans la base de données
        const userId = await createUser({
            email: email.toLowerCase(),
            password: hashedPassword,
            username,
            
        });

        // Renvoi de la réponse avec l'ID de l'utilisateur créé
        res.status(201).json({ success: true, message: "Utilisateur enregistré avec succès.", userId: userId });
    } catch (error) {
        console.error("Erreur lors de l'enregistrement de l'utilisateur :", error);
        res.status(500).json({ success: false, message: "Erreur interne du serveur." });
    }
};

// const edit = async (req, res, next) => {
//     try {
//       const affectedRows = await users.edit(req.params.id, req.body);
  
//       if (affectedRows > 0) {
//         const updatedUser = await users.readOneById(req.params.id);
  
//         const response = {
//           email: updatedUser.email,
//           username: updatedUser.username,
//           password: updatedUser.password,
//           role: updatedUser.role,
//           inscription_date: updatedUser.inscription_date,
//           id: updatedUser.id,
//         };
  
//         res.json({ message: "User updated successfully", user: response });
//       } else {
//         res.status(404).json({ message: "User not found" });
//       }
//     } catch (error) {
//       next(error);
//     }
//   };

//   const destroy = async (req, res, next) => {
//     const { id } = req.params;
//     try {
//       const success = await users.destroy(id);
//       if (success) {
//         res.json({ message: "User deleted successfully" });
//       } else {
//         res.status(404).json({ message: "User not found" });
//       }
//     } catch (error) {
//       next(error);
//     }
//   };

// Fonction de vérification d'authentification (simple check)
const checkAuth = (req, res) => {
    res.json({ authenticated: true });
};

module.exports = {
    login,
    register,
    checkAuth,
    // browse,
    // readOneById,
    // edit,
    // destroy

};
