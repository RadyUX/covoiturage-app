import { jwtDecode } from "jwt-decode";

export const getUserIdFromToken = (token: string): number | null => {
  try {
    const decoded: { userId?: number } = jwtDecode(token);
    return decoded.userId || null; // Assure-toi que l'ID utilisateur est présent
  } catch (err) {
    console.error("Erreur lors du décodage du token :", err);
    return null;
  }
};
