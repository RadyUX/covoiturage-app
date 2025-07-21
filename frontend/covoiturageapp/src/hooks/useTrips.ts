import { useQuery } from "@tanstack/react-query";
import { API_URL } from "../../config";
import axios from "axios";

export interface Trip {
  covoiturage_id: number;
  lieu_depart: string;
  lieu_arrivee: string;
  date_depart: string;
  heure_depart: string;
  arrive_date: string;
  arrive_heure: string;
  nb_place: number;
  prix: string;
  pseudo: string;
  photo: string;
  est_ecologique: boolean;
  note_moyenne: string;
}

interface Filter {
  est_ecologique: boolean;
  prix_max?: number;
  duree_max?: number;
  note_min?: number;
}

interface SearchCriteria {
  lieu_depart: string | null;
  lieu_arrivee: string | null;
  date: string | null;
}

export function useTrips(criteria?: SearchCriteria, filters?: Filter) {
  return useQuery({
    queryKey: ["trips", criteria, filters],
    queryFn: async () => {
      const res = await axios.get<{ trips: Trip[] }>(`${API_URL}/api/trips`, {
        params: { ...criteria, ...filters },
      });
      return res.data.trips ?? [];
    },
    enabled:
      !!criteria?.lieu_depart && !!criteria?.lieu_arrivee && !!criteria?.date,
  });
}
