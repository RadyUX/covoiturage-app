/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { useUser } from "../context/UserContext";
import { useCar, type Car } from "../hooks/useCar";
import AddVehicleModal from "../components/AddCarModal";

export default function Profile() {
  const [carModal, setCarModal] = useState(false);
  const { user } = useUser();
  const { getCar } = useCar(user?.id ?? 0);

  return (
    <div className="bg-[#E8F5E9] min-h-screen font-sans">
      {/* Header */}
      <header className="bg-[#A5D6A7] text-white py-6 text-center text-lg">
        Bonjour {user?.pseudo || "Utilisateur"}
        <div className="flex justify-center gap-4 mt-2">
          <label className="flex items-center gap-2">
            <input type="checkbox" />
            chauffeur
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" />
            passager
          </label>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-10 space-y-10">
        {/* Véhicules */}
        <section>
          <h2 className="text-xl font-semibold mb-2">Mes véhicules 🚗</h2>
          <button
            onClick={() => setCarModal(true)}
            className="bg-green-700 text-white px-4 py-2 rounded hover:bg-green-800"
          >
            ajouter un véhicule
          </button>
          <AddVehicleModal
            open={carModal}
            onClose={() => setCarModal(false)}
            userId={user?.id ?? 0}
          />
          {getCar.isLoading ? (
            <p>Chargement des véhicules...</p>
          ) : getCar.isError ? (
            <p>
              {(getCar.error as any)?.response?.data?.error ||
                getCar.error.message ||
                "Une erreur est survenue"}
            </p>
          ) : (
            <div className="space-y-4 mt-4">
              {(Array.isArray(getCar.data) ? getCar.data : []).map(
                (car: Car) => (
                  <div
                    key={car.id}
                    className="bg-green-300 p-4 rounded shadow flex flex-wrap justify-between items-center gap-2"
                  >
                    <p>
                      <strong>{car.modele}</strong> — {car.couleur} -
                      {car.marque_id}{" "}
                      {car.energie ? "électrique" : "non éléctrique"}
                      {car.immatriculatation} -{" "}
                      {car.premiere_immatriculation_date}
                    </p>
                    <div className="flex gap-2 text-xl">
                      <button>✏️</button>
                      <button>🗑️</button>
                    </div>
                  </div>
                ),
              )}
            </div>
          )}
        </section>
        {/* Préférences */}
        <section>
          <h2 className="text-xl font-semibold mb-2">Mes Préférences ⚙️</h2>
          <div className="bg-green-300 p-4 rounded shadow flex items-center justify-between">
            <div className="flex gap-6">
              <label className="flex items-center gap-2">
                <input type="checkbox" checked />
                accepte les fumeurs
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" checked />
                accepte les animaux
              </label>
            </div>
            <button className="bg-green-700 text-white px-3 py-2 rounded hover:bg-green-800">
              ajouter une préférence
            </button>
          </div>
        </section>

        {/* Créer un voyage */}
        <section>
          <h2 className="text-xl font-semibold mb-2">Créer un voyage 🧭</h2>
          <div className="bg-green-300 p-4 rounded shadow space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              <input
                type="text"
                placeholder="Départ"
                className="px-2 py-1 rounded border"
              />
              <input
                type="text"
                placeholder="Destination"
                className="px-2 py-1 rounded border"
              />
              <input type="date" className="px-2 py-1 rounded border" />
              <input type="time" className="px-2 py-1 rounded border" />
              <select className="px-2 py-1 rounded border">
                <option>Voiture 1</option>
              </select>
              <input
                type="number"
                placeholder="Prix"
                className="px-2 py-1 rounded border"
              />
              <input
                type="number"
                placeholder="Place"
                className="px-2 py-1 rounded border"
              />
            </div>
            <button className="bg-green-700 text-white px-4 py-2 rounded hover:bg-green-800">
              Créer
            </button>
          </div>
        </section>

        {/* Historique */}
        <section>
          <h2 className="text-xl font-semibold mb-2">
            Historique et trajet à venir 🕐
          </h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center bg-green-300 p-3 rounded">
              <p>
                <strong>Trajet 1</strong> — Paris &gt; Marseille, le 20/10/2025
              </p>
              <button className="bg-green-800 text-white px-3 py-1 rounded hover:bg-green-900">
                Annuler
              </button>
            </div>
            <div className="flex justify-between items-center bg-green-300 p-3 rounded">
              <p>
                <strong>Trajet 2</strong> — Paris &gt; Marseille, le 12/01/2025
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
