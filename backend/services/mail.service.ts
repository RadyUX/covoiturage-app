import { User } from "../models/user.models";
import nodemailer from "nodemailer"
import { google } from "googleapis"
import dotenv from "dotenv"
dotenv.config({path: "../.env"});

const oauth = google.auth.OAuth2;
console.log("CLIENTID:", process.env.CLIENTID);
console.log("CLIENTSECRET:", process.env.SECRETCLIENT);
console.log("REFRESH_TOKEN:", process.env.REFRESH_TOKEN);
console.log("USER_EMAIL:", process.env.USER_EMAIL);
export class mailService {
  private createTransporter = async () => {
    const oauth2Client = new oauth(
      process.env.CLIENTID,
      process.env.SECRETCLIENT,
      "https://developers.google.com/oauthplayground"
    );

    // Configure le refresh_token
    oauth2Client.setCredentials({
      refresh_token: process.env.REFRESH_TOKEN,
    });

    // Obtiens l'access_token
    const accessToken = await oauth2Client.getAccessToken();

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true, // Utilise SSL
      auth: {
        type: "OAuth2",
        user: process.env.USER_EMAIL,
        clientId: process.env.CLIENTID,
        clientSecret: process.env.SECRETCLIENT,
        refreshToken: process.env.REFRESH_TOKEN,
        accessToken: accessToken.token || "",
      },
    });

    return transporter;
  };

  public async sendCancellationEmail(participants: User[], covoiturageId: number): Promise<void> {
    const transporter = await this.createTransporter();

    const mailOptions = {
      from: process.env.USER_EMAIL,
      to: participants.map((p) => p.email).join(","),
      subject: "Covoiturage Annulé",
      text: `Le covoiturage avec l'ID ${covoiturageId} a été annulé.`,
    };

    await transporter.sendMail(mailOptions);
  }

  async sendArrivalNotification(participants: User[], tripId: number) {
  const transporter = await this.createTransporter();
  const mailOptions = {
    from: process.env.USER_EMAIL,
    to: participants.map((p) => p.email).join(","),
    subject: "Validez votre trajet",
    text: `Bonjour ${participants.map((p) => p.pseudo).join(", ")},\nVeuillez valider le trajet terminé (ID: ${tripId}) dans votre espace.`,
  };
  await transporter.sendMail(mailOptions);
}

}