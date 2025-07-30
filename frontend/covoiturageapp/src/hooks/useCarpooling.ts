import { useMutation } from "@tanstack/react-query";

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

  return { createCarpooling };
};
