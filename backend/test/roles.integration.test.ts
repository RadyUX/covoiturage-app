import request from "supertest";
import app from "../server";
import { describe, it, expect, beforeEach } from "vitest";
import { db } from "../config/db";

describe("🧪 Tests d'intégration - Gestion des rôles", () => {
  let user = { userId: 1 };

  it("✅ Ajoute des rôles à un utilisateur", async () => {
    const res = await request(app)
      .put(`/api/users/${user.userId}/roles`)
      .send({ roles: ["chauffeur", "passager"] });

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Rôles mis à jour avec succès");

    const [rows] = await db.execute(
      `SELECT r.role_nom FROM possede p
       JOIN role r ON p.role_id = r.role_id
       WHERE p.user_id = ?`,
      [user.userId]
    );
    const roles = Array.isArray(rows) ? rows.map((row: any) => row.role_nom) : [];
    expect(roles).toEqual(expect.arrayContaining(["chauffeur", "passager"]));
  });

  it("✅ Supprime un rôle d'un utilisateur", async () => {
    await db.execute(
      `INSERT INTO possede (user_id, role_id)
       SELECT ?, r.role_id FROM role r WHERE r.role_nom = ?
       ON DUPLICATE KEY UPDATE role_id = r.role_id`,
      [user.userId, "passager"]
    );

    const res = await request(app)
      .put(`/api/users/${user.userId}/roles`)
      .send({ roles: ["chauffeur"] });

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Rôles mis à jour avec succès");

    const [rows] = await db.execute(
      `SELECT r.role_nom FROM possede p
       JOIN role r ON p.role_id = r.role_id
       WHERE p.user_id = ?`,
      [user.userId]
    );
    const roles = Array.isArray(rows) ? rows.map((row: any) => row.role_nom) : [];
    expect(roles).toEqual(["chauffeur"]);
  });

  it("❌ Retourne une erreur si le champ 'roles' n'est pas un tableau", async () => {
    const res = await request(app)
      .put(`/api/users/${user.userId}/roles`)
      .send({ roles: "chauffeur" });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe("Le champ 'roles' doit être un tableau");
  });

  it("❌ Retourne une erreur si l'utilisateur n'existe pas", async () => {
    const res = await request(app)
      .put(`/api/users/9999/roles`)
      .send({ roles: ["chauffeur"] });

    expect(res.status).toBe(500);
    expect(res.body.error).toBe("Utilisateur introuvable");
  });

  it("✅ Récupère les rôles d'un utilisateur", async () => {
    await db.execute(
      `INSERT INTO possede (user_id, role_id)
       SELECT ?, r.role_id FROM role r WHERE r.role_nom = ?
       ON DUPLICATE KEY UPDATE role_id = r.role_id`,
      [user.userId, "chauffeur"]
    );
    await db.execute(
      `INSERT INTO possede (user_id, role_id)
       SELECT ?, r.role_id FROM role r WHERE r.role_nom = ?
       ON DUPLICATE KEY UPDATE role_id = r.role_id`,
      [user.userId, "passager"]
    );

    const res = await request(app).get(`/api/users/${user.userId}/roles`);

    expect(res.status).toBe(200);
    expect(res.body.roles).toEqual(expect.arrayContaining(["chauffeur", "passager"]));
  });
});