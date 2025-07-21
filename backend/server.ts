import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { db } from './config/db';
import tripRoutes from "./routes/trips.routes"
// Charger les variables d’environnement
dotenv.config();


// Créer l’app Express
const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Exemple de route pour test
app.get('/', (req, res) => {
  res.send('🚗 Bienvenue sur covoiturageapp API !');
});
app.use("/api/trips", tripRoutes )

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


testConnection();

export default app