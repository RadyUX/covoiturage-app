import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { db } from './config/db';

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


// Lancer le serveur
app.listen(PORT, () => {
  console.log(`✅ Serveur lancé sur http://localhost:${PORT}`);
});



async function testConnection() {
  try {
    const [rows] = await db.query("SELECT 1");
    console.log("✅ Connexion à la base de données réussie !");
    console.log(rows);
  } catch (err) {
    console.error("❌ Erreur de connexion à la base de données : ", err);
  } finally {
    db.end(); // ferme proprement la connexion
  }
}

testConnection();
