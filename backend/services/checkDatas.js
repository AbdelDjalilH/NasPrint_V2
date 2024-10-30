const Joi = require("joi");

const checkRegisterDatas = (req, res, next) => {
    const { error } = Joi.object({
        email: Joi.string().email().required(),
        username: Joi.string().min(2).required(),
        password: Joi.string().min(8).max(20).required(),
    }).validate(req.body, { abortEarly: false });

    if (!error) {
        next();
    } else {
        const errorMessages = error.details.map(err => err.message);
        console.error("Erreur de validation lors de l'inscription :", errorMessages);
        res.status(400).json({ message: "Erreur de validation", details: errorMessages });
    }
};

const checkLoginDatas = (req, res, next) => {
    const { error } = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().min(8).max(20).required(),
    }).validate(req.body, { abortEarly: false });

    if (!error) {
        next();
    } else {
        const errorMessages = error.details.map(err => err.message); // Récupération des messages d'erreur
        console.error("Erreur de validation lors de la connexion :", errorMessages);
        res.status(400).json({ message: "Erreur de validation", details: errorMessages });
    }
};

module.exports = { checkLoginDatas, checkRegisterDatas };

