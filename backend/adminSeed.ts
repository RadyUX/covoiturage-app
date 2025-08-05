import dotenv from 'dotenv';
import { db } from './config/db';
import bcrypt from "bcrypt"

dotenv.config();

async function createAdmins(){
  const admin = {
      firstname: 'admin',
      lastname: 'un',
      email: process.env.ADMIN_EMAIL,
      password: process.env.ADMIN_PASSWORD 
  };


  // Insère l'utilisateur dans la table `utilisateur`
  // Hashage du mot de passe et insertion de l'administrateur
  if (!admin.password) {
    throw new Error('ADMIN_PASSWORD environment variable is not set');
  }
  const hashedPassword = await bcrypt.hash(admin.password, 10);

  // Insère l'utilisateur dans la table `utilisateur`
  const [userResult] = await db.execute(
    `INSERT IGNORE INTO utilisateur (firstname, lastname, email, password, telephone, adress, birthdate, photo, pseudo)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      admin.firstname,
      admin.lastname,
      admin.email,
      hashedPassword,
      '0600000000', // Téléphone par défaut
      'Adresse par défaut', // Adresse par défaut
      '2000-01-01', // Date de naissance par défaut
      'admin.png', // Photo par défaut
      admin.firstname.toLowerCase(), // Pseudo par défaut
    ]
  );

  const userId = (userResult as any).insertId;
console.log('✅ Utilisateur administrateur créé avec succès :', userId);
    // Récupère l'ID du rôle `admin`
    const [roleResult] = await db.execute(
      `SELECT role_id FROM role WHERE role_nom = 'admin'`
    );
    const roleId = (roleResult as any)[0]?.role_id;

if (userId && roleId) {
  console.log('🔄 Association de l\'utilisateur au rôle admin...');
  await db.execute(
    `INSERT IGNORE INTO possede (user_id, role_id) VALUES (?, ?)`,
    [userId, roleId]
  );
  console.log('✅ Association réussie.');
}
console.log('✅ Résultat de l\'insertion utilisateur :', userResult);
    console.log('✅ Comptes administrateurs créés avec succès.');
  await db.end();
  }

createAdmins().catch((err) => {
  console.error('❌ Erreur lors de la création des administrateurs :', err);
});