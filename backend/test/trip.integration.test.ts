import request from 'supertest'
import app from "../server"
import {describe, it,expect} from "vitest"


describe('GET /api/trips', () => {
  it('devrait retourner 400 si des champs sont manquants', async () => {
    const res = await request(app).get('/api/trips');
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error');
  });
 
  it('devrait retourner les trajets correspondant', async () => {
    const res = await request(app)
      .get('/api/trips')
      .query({
        lieu_depart: 'Lyon',
        lieu_arrivee: 'Paris',
        date: '2025-07-18',
      });
   console.log("Résultat de la requête GET /api/trips =>", res.body); 
    expect(res.status).toBe(200);
   expect(Array.isArray(res.body.trips)).toBe(true);

  });
});




describe("GET /api/trips/:id", () => {
  it("devrait retourner les détails d’un covoiturage valide", async () => {
    const tripId = 1; 

    const res = await request(app).get(`/api/trips/${tripId}`);
console.log("Résultat de la requête GET /api/trips/:id=>", res.body); 

    expect(res.status).toBe(200);
    expect(res.body.tripDetails).toHaveProperty("covoiturage_id", tripId);
    expect(res.body.tripDetails).toHaveProperty("pseudo");
    expect(res.body.tripDetails).toHaveProperty("photo");
    expect(res.body.tripDetails).toHaveProperty("voiture_couleur");
    expect(res.body.tripDetails).toHaveProperty("voiture_modele");
    expect(res.body.tripDetails).toHaveProperty("voiture_energie");
    expect(res.body.tripDetails).toHaveProperty("preferences");
    expect(Array.isArray(res.body.tripDetails.preferences)).toBe(true);
    expect(res.body.tripDetails).toHaveProperty("avis");
expect(Array.isArray(res.body.tripDetails.avis)).toBe(true);
    
  });

  it("devrait retourner 404 si le covoiturage n’existe pas", async () => {
    const res = await request(app).get("/api/trips/99999"); 
    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty("error");
  });

  it("devrait retourner 400 si l’id est invalide", async () => {
    const res = await request(app).get("/api/trips/abc"); 
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("error");
  });
});
