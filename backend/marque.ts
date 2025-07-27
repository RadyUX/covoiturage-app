import { db } from "./config/db";

async function insertMarques() {
  const marques = [
    'Abarth', 'Acura', 'Alfa Romeo', 'Aston Martin', 'Audi',
    'Bentley', 'BMW', 'Bugatti', 'Buick', 'BYD',
    'Cadillac', 'Chevrolet', 'Chrysler', 'Citroën', 'Cupra',
    'Dacia', 'Daewoo', 'Daihatsu', 'Dodge', 'DS Automobiles',
    'Ferrari', 'Fiat', 'Fisker', 'Ford', 'Genesis',
    'GMC', 'Great Wall', 'Hyundai', 'Infiniti', 'Isuzu',
    'Iveco', 'Jaguar', 'Jeep', 'Kia', 'Koenigsegg',
    'Lada', 'Lamborghini', 'Lancia', 'Land Rover', 'Lexus',
    'Lincoln', 'Lotus', 'Lucid', 'Maserati', 'Mazda',
    'McLaren', 'Mercedes-Benz', 'Mini', 'Mitsubishi', 'Nissan',
    'Opel', 'Polestar', 'Pontiac', 'Porsche', 'Proton',
    'Rolls-Royce', 'Rover', 'Saab', 'Samsung', 'Seat',
    'Skoda', 'Smart', 'SsangYong', 'Subaru', 'Suzuki',
    'Tata', 'Volvo', 'Wiesmann',
  ];

  for (const marque of marques) {
    try {
      const [rows] = await connection.execute(
        `SELECT libellé FROM marque WHERE libellé = ?`,
        [marque]
      );

      if (rows.length > 0) {
        console.log(`La marque "${marque}" existe déjà.`);
        continue;
      }

      const [result] = await connection.execute(
        `INSERT INTO marque (libellé) VALUES (?)`,
        [marque]
      );
      console.log(`Insertion de ${marque} :`, result);
    } catch (error) {
      console.error(`Erreur lors de l'insertion de ${marque} :`, error);
    }
  }
  console.log("✅ Marques insérées avec succès.");
}