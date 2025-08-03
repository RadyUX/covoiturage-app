import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { API_URL } from "../../config";

export function useCredits(userId: number | null) {
  return useQuery({
    queryKey: ["credits", userId],
    queryFn: async () => {
      const token = localStorage.getItem("userToken");
      if (!userId) {
        return 0; // Retourne 0 si userId est null
      }
      const response = await axios.get(`${API_URL}/api/credits/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("Réponse de l'API :", response.data); // Ajoute un log pour vérifier la réponse
      return response.data.credit; // Assure-toi que la clé correspond à la réponse de l'API
    },
    enabled: userId !== null, // Désactive la requête si userId est null
  });
}
