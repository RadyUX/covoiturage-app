import { mailService } from "../services/mail.service";

const testMailService = async () => {
  const mailer = new mailService();

  const participants = [
    { email: "rafaele.sinaguglia@gmail.com", password: "dummyPassword" },
    
  ];

  const covoiturageId = 1;

  try {
    await mailer.sendCancellationEmail(participants, covoiturageId);
    console.log("Email envoyé avec succès !");
  } catch (error) {
    console.error("Erreur lors de l'envoi de l'email :", error);
  }
};

testMailService();
console.log("Refresh token:", process.env.REFRESH_TOKEN);
