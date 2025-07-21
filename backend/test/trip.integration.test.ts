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