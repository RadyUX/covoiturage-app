import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { API_URL } from "../../config";

export function useRole(userId: number | null) {
  return useQuery({
    queryKey: ["roles", userId],
    queryFn: async () => {
      if (!userId) {
        return 0; // Retourne 0 si userId est null
      }
      const response = await axios.get(`${API_URL}/api/users/${userId}/roles`);
      console.log("Réponse de l'API :", response.data);
      return response.data.roles;
    },
  });
}
