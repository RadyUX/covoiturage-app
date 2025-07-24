import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
    try {
        // Récupère le token depuis les headers
        const token = req.headers.authorization?.split(" ")[1]; // Format attendu : "Bearer <token>"
        if (!token) {
            return res.status(401).json({ error: "Accès non autorisé, token manquant" });
        }

        // Vérifie et décode le token
        const jwt_secret = process.env.JWT_SECRET;
        if (!jwt_secret) {
            throw new Error("JWT_SECRET n'est pas défini dans le fichier .env");
        }

        const decoded = jwt.verify(token, jwt_secret);
        // @ts-ignore
        req.user = decoded; // Ajoute les infos utilisateur décodées à l'objet `req`
        next(); // Passe au middleware ou route suivant
    } catch (err) {
        res.status(401).json({ error: "Token invalide ou expiré" });
    }
}