import axios from "axios";
import { useMutation, useQuery } from "@tanstack/react-query";
import { API_URL } from "../../config";

export interface Car {
  id: number;
  user_id: number;
  modele: string;
  couleur: string;
  energie: boolean;
  immatriculation: number;
  premiere_immatriculation_date: string;
  marque_id: number;
  libellé: string;
}

type CarResponse = {
  cars: Car[]; // `cars` est un tableau de voitures
};
export const useCar = (userId: number) => {
  const getCar = useQuery<CarResponse>({
    queryKey: ["cars", userId],
    queryFn: async () => {
      const token = localStorage.getItem("userToken"); // Récupère le token depuis le stockage local
      const res = await axios.get(`${API_URL}/api/cars/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`, // Ajoute le token dans les en-têtes
        },
      });
      return res.data.cars;
    },
    enabled: !!userId,
    refetchOnWindowFocus: false, // Désactive le refetch sur focus de la fenêtre
  });
  const createCar = useMutation({
    mutationFn: async (car: Car) => {
      const token = localStorage.getItem("userToken"); // Récupère le token depuis le stockage local
      const res = await axios.post(`${API_URL}/api/cars/create`, car, {
        headers: {
          Authorization: `Bearer ${token}`, // Ajoute le token dans les en-têtes
        },
      });
      return res.data; // Retourne la réponse du serveur
    },
  });

  const getMarques = useQuery({
    queryKey: ["marques"],
    queryFn: async () => {
      const res = await axios.get(`${API_URL}/api/cars/marques`);
      return res.data.marques;
    },
  });

  return { getCar, createCar, getMarques };
};
