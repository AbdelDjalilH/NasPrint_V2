const nodemailer= require("nodemailer");

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS, // Mot de passe d'application généré dans le compte Google
    },
  });



function sendWelcomeEmail(to, subject, text) {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: to,
    subject: subject,
    text: text,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Erreur lors de l'envoi de l'e-mail :", error);
    } else {
      console.log("E-mail envoyé avec succès :", info.response);
    }
  });
}



module.exports= sendWelcomeEmail;