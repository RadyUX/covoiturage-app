import request from "supertest";
import app from "../server";
import { describe, it, expect, beforeEach } from "vitest";
import { db } from "../config/db";

describe("GET /api/cars/:userId", () => {
  it("✅ retourne les voitures d'un utilisateur existant", async () => {
    const res = await request(app).get(`/api/cars/1`);
    console.log("resultat de requete car", res.body);

    
    expect(res.status).toBe(200);

   
    expect(res.body.cars).toBeDefined();
    expect(Array.isArray(res.body.cars)).toBe(true);

   
    const firstCar = res.body.cars[0];
    expect(firstCar).toBeDefined();
    expect(firstCar.user_id).toBe(1);
    expect(firstCar).toHaveProperty("modele");
    expect(firstCar).toHaveProperty("couleur");
    expect(firstCar).toHaveProperty("libellé");
  });
});
