import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { API_URL } from "../../config";

export interface Preferences {
  animaux: boolean;
  fumeur: boolean;
  texte_libre: string;
}

export const usePreferences = (userId: number) => {
  const queryClient = useQueryClient();
  const getPreferences = useQuery({
    queryKey: ["prefs", userId],
    queryFn: async () => {
      const token = localStorage.getItem("userToken");
      const res = await axios.get<{ preferences: Preferences[] }>(
        `${API_URL}/api/pref/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      return res.data.preferences;
    },
  });

  const updatePreferences = useMutation({
    mutationFn: async (preference: Preferences) => {
      const token = localStorage.getItem("userToken"); // Récupère le token depuis le stockage local
      const res = await axios.put(`${API_URL}/api/pref/${userId}`, preference, {
        headers: {
          Authorization: `Bearer ${token}`, // Ajoute le token dans les en-têtes
        },
      });
      return res.data; // Retourne la réponse du serveur
    },
    onSuccess: (updatedPref) => {
      // Mets à jour immédiatement le cache pour éviter un refetch manuel
      queryClient.setQueryData(["preferences", userId], () => {
        return [updatedPref]; // car tu reçois une seule préférence
      });
    },
  });

  return { getPreferences, updatePreferences };
};
