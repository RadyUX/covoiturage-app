import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { API_URL } from "../../config";
import type { Avis } from "../components/TripDetailsModal";

interface CovoiturageDetail {
  covoiturage_id: number;
  pseudo: string;
  photo: string;
  note_moyenne: number;
  nb_place: number;
  prix: number;
  lieu_depart: string;
  lieu_arrivee: string;
  date_depart: string;
  heure_depart: string;
  arrive_date: string;
  arrive_heure: string;
  est_ecologique: boolean;
  voiture_couleur: string;
  voiture_modele: string;
  voiture_energie: string;
  preferences: {
    fumeur: boolean;
    animaux: boolean;
    texte_libre?: string;
  };
  texte_libre: string;
  avis: Avis[];
}
export function useTripDetail(id: number) {
  return useQuery({
    queryKey: ["tripDetail", id],
    queryFn: async () => {
      const res = await axios.get<{ tripDetails: CovoiturageDetail }>(
        `${API_URL}/api/trips/${id}`,
      );
      return res.data.tripDetails ?? null;
    },
    enabled: !!id,
  });
}
