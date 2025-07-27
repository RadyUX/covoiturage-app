import request from "supertest";
import app from "../server";
import { describe, it, expect, beforeEach } from "vitest";
import { db } from "../config/db";

describe("GET /api/cars/:userId", () => {
  it("✅ retourne la voiture d'un utilisateur existant", async () => {
    const res = await request(app).get(`/api/cars/${1}`);
    console.log("resultat de requete car", res.body)
    expect(res.status).toBe(200);
    expect(res.body.car).toBeDefined();
    expect(res.body.car.user_id).toBe(1);
    expect(res.body.car).toHaveProperty("modele");
     expect(res.body.car).toHaveProperty("couleur")
     
    expect(res.body.car).toHaveProperty("libellé");
    
  })})
