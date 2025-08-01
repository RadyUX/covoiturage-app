import { useState } from "react";
import { useCar } from "../hooks/useCar";

interface Props {
  open: boolean;
  onClose: () => void;
  userId: number;
}

export interface VehicleFormData {
  immatriculation: number;
  premiereImmatriculationDate: Date;
  modele: string;
  couleur: string;
  energie: boolean;
  marque_id: number; // ici c’est bien le nom de la marque (pas obligatoire côté back mais utile en front)
}

export default function AddVehicleModal({ open, onClose, userId }: Props) {
  const { createCar, getMarques } = useCar(userId);

  const [formData, setFormData] = useState<VehicleFormData>({
    immatriculation: 123456,
    premiereImmatriculationDate: new Date(),
    modele: "",
    couleur: "",
    energie: false,
    marque_id: 0,
  });

  if (!open) return null;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;

    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : name === "marque_id"
            ? Number(value)
            : name === "premiereImmatriculationDate"
              ? new Date(value)
              : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const carData = {
      voiture_id: 0,
      immatriculation: formData.immatriculation,
      premiere_immatriculation_date:
        formData.premiereImmatriculationDate.toISOString(),
      modele: formData.modele,
      couleur: formData.couleur,
      energie: formData.energie,
      user_id: userId,
      marque_id: formData.marque_id,
      libellé:
        getMarques.data?.find(
          (marque: { marque_id: number; libellé: string }) =>
            marque.marque_id === formData.marque_id,
        )?.libellé || "",
    };
    if (
      !carData.marque_id ||
      !carData.immatriculation ||
      !carData.premiere_immatriculation_date ||
      !carData.modele ||
      !carData.couleur
    ) {
      console.error("Données manquantes :", carData);
      return;
    }
    createCar.mutate(carData, {
      onSuccess: () => {
        onClose();
      },
      onError: (err) => {
        console.error("Erreur lors de la création :", err);
      },
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex justify-center items-center">
      <div className="bg-white w-full max-w-lg rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-semibold text-center mb-4">
          Ajouter un véhicule
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <label>
            Marque :
            <select
              name="marque_id"
              value={formData.marque_id}
              onChange={(e) =>
                setFormData({ ...formData, marque_id: Number(e.target.value) })
              }
              required
            >
              <option value={0} disabled>
                Sélectionner une marque
              </option>
              {getMarques.isLoading ? (
                <option>Chargement...</option>
              ) : getMarques.isError ? (
                <option>Erreur lors du chargement des marques</option>
              ) : (
                getMarques.data?.map(
                  (marque: { marque_id: number; libellé: string }) => (
                    <option key={marque.marque_id} value={marque.marque_id}>
                      {marque.libellé}
                    </option>
                  ),
                )
              )}
            </select>
          </label>
          <input
            type="number"
            name="immatriculation"
            placeholder="Plaque d'immatriculation"
            value={formData.immatriculation}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            required
          />
          <input
            type="date"
            name="premiereImmatriculationDate"
            value={
              formData.premiereImmatriculationDate.toISOString().split("T")[0]
            }
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            required
          />
          <input
            type="text"
            name="modele"
            placeholder="Modèle"
            value={formData.modele}
            onChange={handleChange}
            autoComplete="off"
            className="w-full border rounded px-3 py-2"
            required
          />
          <input
            type="text"
            name="couleur"
            placeholder="Couleur"
            autoComplete="off"
            value={formData.couleur}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            required
          />

          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              name="energie"
              checked={formData.energie}
              onChange={handleChange}
              className="w-5 h-5"
            />
            <span>Voiture électrique</span>
          </label>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Ajouter
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
