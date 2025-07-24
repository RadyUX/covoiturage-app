import * as mysql from 'mysql2/promise';
import bcrypt from 'bcrypt'

async function main() {


  const connection = await mysql.createConnection({
    host: 'sql7.freesqldatabase.com',
    user: 'sql7790472',
    password: 'uF4c1z3p38',
    database: 'sql7790472',
  });
await connection.execute("SET FOREIGN_KEY_CHECKS = 0");
await connection.execute("TRUNCATE TABLE participe");
await connection.execute("TRUNCATE TABLE avis");
await connection.execute("TRUNCATE TABLE covoiturage");
await connection.execute("TRUNCATE TABLE voiture");
await connection.execute("TRUNCATE TABLE utilisateur");
await connection.execute("TRUNCATE TABLE marque");
await connection.execute("SET FOREIGN_KEY_CHECKS = 1");
  const noms = ['Martin', 'Bernard', 'Dubois', 'Thomas', 'Robert'];
  const prenoms = ['Alice', 'Lucas', 'Emma', 'Hugo', 'Chloé'];
  const villes = ['Paris', 'Lyon', 'Marseille', 'Toulouse', 'Nice'];
  const modeles = ['Model X', 'Clio', '308', 'Civic', 'Golf'];
  const couleurs = ['Rouge', 'Bleu', 'Noir', 'Blanc', 'Gris'];
  const marques = ['Tesla', 'Renault', 'Peugeot', 'Honda', 'Volkswagen'];
  const commentaires = [
    'Très bon conducteur, ponctuel et sympa.',
    'Voiture confortable, je recommande.',
    'Excellent trajet, je referai volontiers.',
    'Très agréable, musique au top.',
    'Super covoiturage, chauffeur très prudent.',
  ];

  for (let i = 1; i <= marques.length; i++) {
    await connection.execute(
      'INSERT IGNORE INTO marque (marque_id, libellé) VALUES (?, ?)',
      [i, marques[i - 1]]
    );
  }

  for (let i = 1; i <= 5; i++) {
  const hashedPassword = await bcrypt.hash('password123', 10); // Hash le mot de passe

  await connection.execute(
    `INSERT INTO utilisateur (user_id, lastname, firstname, email, password, telephone, adress, birthdate, photo, pseudo)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      i,
      noms[Math.floor(Math.random() * noms.length)],
      prenoms[Math.floor(Math.random() * prenoms.length)],
      `user${i}@test.com`,
      hashedPassword, // Utilise le mot de passe hashé
      `060000000${i}`,
      `${Math.floor(Math.random() * 100)} rue ${villes[i % villes.length]}`,
      '2000-01-01',
      'photo.png',
      `pseudo${i}`,
    ]
  );
}

    for (let i = 1; i <= 5; i++) {
    await connection.execute(
      `INSERT INTO voiture (voiture_id, modele, immatriculation, energie, couleur, premiere_immatriculation_date, user_id, marque_id)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        i,
        modeles[i % modeles.length],
        1000 + i,
        i % 2 === 0,
        couleurs[i % couleurs.length],
        '2019-01-01',
        i,
        i,
      ]
    );
  }

  for (let i = 1; i <= 5; i++) {
    const date_depart = new Date();
    date_depart.setDate(date_depart.getDate() + i);
    const arrive = new Date(date_depart);
    arrive.setHours(arrive.getHours() + 2);

    await connection.execute(
      `INSERT INTO covoiturage (covoiturage_id, date_depart, heure_depart, lieu_depart, arrive_date, arrive_heure, status, nb_place, prix, voiture_id)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        i,
        date_depart.toISOString().split('T')[0],
        '08:00:00',
        villes[i % villes.length],
        arrive.toISOString().split('T')[0],
        '10:00:00',
        'disponible',
        3,
        15 + i,
        i,
      ]
    );
  }

  for (let i = 1; i <= 5; i++) {
    await connection.execute(
      'INSERT INTO participe (user_id, covoiturage_id) VALUES (?, ?)',
      [i, i]
    );
  }
// Ajout des rôles
const roles = ["passager", "chauffeur", "admin", "employé"];
for (let i = 1; i <= roles.length; i++) {
  await connection.execute(
    'INSERT IGNORE INTO role (role_id, role_nom) VALUES (?, ?)',
    [i, roles[i - 1]]
  );
}

// ... création des utilisateurs ...

// Association utilisateur <-> rôle
for (let i = 1; i <= 5; i++) {
  const roleId = ((i - 1) % roles.length) + 1;
  await connection.execute(
    'INSERT IGNORE INTO possede (user_id, role_id) VALUES (?, ?)',
    [i, roleId]
  );
}

for (let i = 1; i <= 5; i++) {
  await connection.execute(
    `INSERT INTO avis (avis_id, commentaire, note, status, auteur_id, cible_id)
   VALUES (?, ?, ?, ?, ?, ?)`,
  [
    i,
    commentaires[i - 1],
    Math.floor(Math.random() * 3) + 3,
    'public',
    i, // auteur
    i === 5 ? 1 : i + 1 // cible (pour éviter l’auto-évaluation et boucler sur le premier)
  ]
);



  }

  
  console.log('✅ Données insérées avec succès.');
  await connection.end();
}

main().catch((err) => {
  console.error('❌ Erreur :', err);
});
