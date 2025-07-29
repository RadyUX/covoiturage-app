import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { db } from './config/db';
import tripRoutes from "./routes/trips.routes"
import userRoutes from "./routes/user.routes"
import mongoose from "mongoose"
import CreditRoutes from "./routes/credits.route"
import CarRoutes from "./routes/car.routes"
import preferenceRoutes from "./routes/preference.routes"
dotenv.config();
const mongoUri = process.env.MONGO_URI;
if (!mongoUri) {
  throw new Error("MONGO_URI n'est pas défini dans le .env");
}
mongoose.connect(mongoUri)
  .then(() => console.log("MongoDB connecté !"))
  .catch((err) => console.error("Erreur MongoDB :", err));
// Créer l’app Express
const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
console.log(userRoutes);
// Exemple de route pour test
app.get('/', (req, res) => {
  res.send('🚗 Bienvenue sur covoiturageapp API !');
});
app.use("/api/trips", tripRoutes )
app.use("/api/users", userRoutes)
app.use("/api/credits", CreditRoutes)
app.use("/api/cars", CarRoutes)
app.use("/api/pref", preferenceRoutes)
// Lancer le serveur
app.listen(PORT, () => {
  console.log(`✅ Serveur lancé sur http://localhost:${PORT}`);
});



async function testConnection() {
  try {
    const [rows] = await db.query("SELECT 1");
    console.log("✅ Connexion à la base de données réussie !");
  } catch (err) {
    console.error("❌ Erreur de connexion à la base de données :", err);
  }
  // Ne ferme pas la connexion ici, laisse Express gérer le cycle de vie
}

app.get("/api/cars/test", (_, res) => {
  res.json({ test: "manuelle ok" });
});

testConnection();

export default app