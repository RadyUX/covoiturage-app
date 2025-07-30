import { useMutation } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";
import { API_URL } from "../../config";
import axios from "axios";

export interface NewTrip {
  lieu_depart: string;
  lieu_arrivee: string;
  date_depart: string;
  heure_depart: string;
  heure_arrivee: string;
  nb_place: number;
  prix: number;
}

export const useCarpooling = () => {
  const queryClient = useQueryClient();
  const createCarpooling = useMutation<{ id: number }, unknown, NewTrip>({
    mutationFn: async (trip: NewTrip) => {
      const token = localStorage.getItem("userToken");
      const response = await axios.post<{ id: number }>(
        `${API_URL}/api/trips/create`,
        trip,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      return response.data;
    },
  });

  interface CancelTripParams {
    userId: number;
    tripId: number;
    credits: number;
  }

  interface CancelTripResponse {
    success: boolean;
    message?: string;
  }

  const cancelCarpooling = useMutation<
    CancelTripResponse,
    unknown,
    CancelTripParams
  >({
    mutationFn: async ({ userId, tripId, credits }: CancelTripParams) => {
      const token = localStorage.getItem("userToken");
      const response = await axios.delete<CancelTripResponse>(
        `${API_URL}/api/trips/${tripId}/cancel`,
        {
          data: { userId, credits },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["history"] }); // Invalide le cache pour forcer une mise à jour
    },
  });

  return { createCarpooling, cancelCarpooling };
};
