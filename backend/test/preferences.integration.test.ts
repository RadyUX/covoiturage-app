import request from "supertest";
import app from "../server";
import { describe, it, expect, beforeEach } from "vitest";
import { db } from "../config/db";



  describe("preference api", () => {
    it("✅ retourne les préférences d'un utilisateur existant", async () => {
      const res = await request(app).get(`/api/pref/1`);
      expect(res.status).toBe(200);
      expect(res.body).toBeDefined();
      expect(res.body).toHaveProperty("preferences");
     console.log("Résultat de la requête GET /api/pref/:userId =>", res.body);
    });

       it("✅ modifie les préférences d'un utilisateur existant", async () => {
         const updatedPreferences = {
    animaux: true,
    fumeur: false,
    texte_libre: "Nouvelle préférence mise à jour",
  };
      const res = await request(app).put(`/api/pref/1`).send(updatedPreferences);
      expect(res.status).toBe(200);
      expect(res.body).toBeDefined();
      expect(res.body).toHaveProperty("message", "preference mise a jour avec succés");
     console.log("Résultat de la requête PUT /api/pref/:userId =>", res.body);
    });

    it("✅ retourne une réponse vide pour un utilisateur sans préférences", async () => {
  const res = await request(app).get(`/api/pref/5`); // ID utilisateur sans préférences
  expect(res.status).toBe(200);
  expect(res.body.preferences).toEqual([]); // Tableau vide
});
});


 

  