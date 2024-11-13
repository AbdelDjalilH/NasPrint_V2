
const nodemailer= require("nodemailer");

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER, // Utiliser l'email configuré dans les variables d'environnement
        pass: process.env.EMAIL_PASS, // Utiliser le mot de passe de l'application
    },
});

function SendPaymentEmail(to) {
const mailOptions = {
    from: process.env.EMAIL_USER,
    to: to,
    subject: "Confirmation de votre paiement",
    text: `Bonjour,\n\nVotre paiement de  € a été effectué avec succès le . Merci de votre commande !\n\nCordialement,\nL'équipe.`,
};
console.log("Tentative d'envoi de l'email...");

// Envoyer l'email
transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
        console.error("Erreur lors de l'envoi de l'e-mail :", error);
    } else {
        console.log("E-mail envoyé avec succès :", info.response);
    }
});
}

module.exports= SendPaymentEmail;