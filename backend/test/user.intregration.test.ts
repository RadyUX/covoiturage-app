import request from "supertest";
import app from "../server";
import { db } from "../config/db"; // <== vérifie que c’est bien ton pool ici
import { describe, it, expect} from "vitest";

describe("🧪 Tests d'intégration - User", () => {
 


  const testUser = {
    firstname: "Jean",
    lastname: "Test",
    email: `jean@test.com`, // email unique à chaque test
    password: "password123",
    telephone: "0102030405",
    adress: "1 rue de Paris",
    birthdate: "2000-01-01",
    photo: "https://fr.pinterest.com/zoesthetic2pdp/pdp-filles/",
    pseudo: "jeanTest"
  };
  

 it("✅ doit se connecter avec l'utilisateur enregistré", async () => {
    const res = await request(app)
        .post("/api/users/login")
        .send({ email: testUser.email, password: testUser.password });

    console.log("Réponse de la connexion :", res.body);

    expect(res.status).toBe(200);
    expect(res.body.user).toHaveProperty("email", testUser.email);
    expect(res.body).toHaveProperty("token");
});

  it("❌ doit refuser l'enregistrement si l'email existe déjà", async () => {
    // Enregistre une première fois
    await request(app)
        .post("/api/users/register")
        .send(testUser);

    // Tente d'enregistrer avec le même email
    const res = await request(app)
        .post("/api/users/register")
        .send(testUser);

    console.log("Réponse de la tentative de duplication :", res.body);

    // Vérifie que le statut est 400 (Bad Request)
    expect(res.status).toBe(400);

    // Vérifie que le message d'erreur est retourné
    expect(res.body).toHaveProperty("error", "Un utilisateur avec cet email existe déjà");
});


});

