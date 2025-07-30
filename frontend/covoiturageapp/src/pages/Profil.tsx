/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { useUser } from "../context/UserContext";
import { useCar, type Car } from "../hooks/useCar";
import AddVehicleModal from "../components/AddCarModal";
import axios from "axios";
import { API_URL } from "../../config";
import { usePreferences } from "../hooks/usePref";
import { useEffect } from "react";
import { useCarpooling } from "../hooks/useCarpooling";
import { useHistory } from "../hooks/useHistory";
import type { Trip } from "../hooks/useTrips";
export default function Profile() {
  const [roles, setRoles] = useState<string[]>([]);

  const { createCarpooling, cancelCarpooling } = useCarpooling();
  const [formTrip, setFormTrip] = useState({
    lieu_depart: "",
    lieu_arrivee: "",
    date_depart: new Date().toISOString().split("T")[0],
    arrive_date: new Date().toISOString().split("T")[0],
    heure_depart: new Date().toLocaleDateString(),
    heure_arrivee: new Date().toLocaleDateString(),
    nb_place: 1,
    prix: 2,
    voiture_id: 0,
  });
  const [carModal, setCarModal] = useState(false);
  const [showPreferenceInput, setShowPreferenceInput] = useState(false);
  const { user } = useUser();
  const { getCar, deleteCar } = useCar(user?.id ?? 0);
  const { getPreferences, updatePreferences } = usePreferences(user?.id ?? 0);
  const [localTexteLibre, setLocalTexteLibre] = useState(
    getPreferences.data?.[0]?.texte_libre || "",
  );
  const { data: historyData } = useHistory(user?.id ?? 0);
  console.log("Données des préférences :", getPreferences.data);
  console.log("formtrip :", formTrip);
  const preferences = getPreferences.data?.[0] ?? {
    fumeur: false,
    animaux: false,
    texte_libre: "",
  };

  useEffect(() => {
    if (getPreferences.data) {
      setLocalTexteLibre(getPreferences.data[0]?.texte_libre || "");
    }
  }, [getPreferences.data]);
  console.log("getCar:", getCar.data);
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/users/${user?.id}/roles`);
        setRoles(res.data.roles || []); // Assure que roles est toujours un tableau
      } catch (err) {
        console.error("Erreur lors de la récupération des rôles :", err);
        setRoles([]); // Définit roles comme un tableau vide en cas d'erreur
      }
    };

    fetchRoles();
  }, [user?.id]);

  const handleDeleteCar = async (carId: number) => {
    try {
      deleteCar.mutate(carId, {
        onSuccess: () => {
          getCar.refetch();
        },
      });
      console.log("voiture supprimé avec succés");
    } catch (err) {
      console.error("erreur lors de la suppression de la voiture :", err);
    }
  };

  const handleCancelTrip = (
    tripId: number,
    userId: number,
    credits: number,
  ) => {
    cancelCarpooling.mutate(
      { tripId, userId, credits },
      {
        onSuccess: (data) => {
          console.log("Annulation réussie :", data.message);

          // Rafraîchir l'historique ou afficher un message de succès
          historyData.refetch();
        },
        onError: (error) => {
          console.error("Erreur lors de l'annulation :", error);
          // Afficher un message d'erreur
        },
      },
    );
  };

  const handleCreateCarpooling = async () => {
    try {
      // Validation des champs requis
      if (
        !formTrip.voiture_id ||
        !formTrip.date_depart ||
        !formTrip.heure_arrivee ||
        !formTrip.arrive_date ||
        !formTrip.heure_depart ||
        !formTrip.lieu_arrivee ||
        !formTrip.lieu_depart ||
        !formTrip.nb_place ||
        !formTrip.prix
      ) {
        console.error("Veuillez remplir tous les champs requis.");
        alert(
          "Veuillez remplir tous les champs requis à la création du covoiturage.",
        );
        return; // Arrête l'exécution si les champs ne sont pas remplis
      }

      // Ajoute userId à l'objet formTrip
      const tripData = {
        ...formTrip,
        userId: user?.id, // Assure que userId est inclus
      };

      // Envoie la requête au backend
      await createCarpooling.mutateAsync(tripData);
      console.log("Covoiturage créé avec succès !");
    } catch (error) {
      console.error("Erreur lors de la création du covoiturage :", error);
    }
  };
  const handleRoleChange = async (role: string, checked: boolean) => {
    const updatedRoles = checked
      ? [...roles, role]
      : roles.filter((r) => r !== role);

    setRoles(updatedRoles); // ✅ met à jour localement pour afficher immédiatement

    try {
      const res = await axios.put(`${API_URL}/api/users/${user?.id}/roles`, {
        roles: updatedRoles,
      });
      console.log("Rôles mis à jour :", res.data);
    } catch (err) {
      console.error("Erreur lors de la mise à jour des rôles :", err);
    }
  };

  return (
    <div className="bg-[#E8F5E9] min-h-screen font-sans">
      {/* Header */}
      <header className="bg-[#A5D6A7] text-white py-6 text-center text-lg h-[218px] flex flex-col items-center justify-center ">
        <h1 className="text-[36px] ">
          Bonjour {user?.pseudo || "Utilisateur"}
        </h1>
        <div className="flex justify-center gap-4 mt-[10px]">
          <label className="flex items-center gap-2 p-[10px]">
            <input
              type="checkbox"
              checked={roles?.includes("chauffeur")}
              onChange={(e) => handleRoleChange("chauffeur", e.target.checked)}
            />
            chauffeur
          </label>
          <label className="flex items-center gap-2 p-[10px]">
            <input type="checkbox" checked={true} disabled={true} />
            passager
          </label>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-10 space-y-10 ml-[169px] mr-[169px] mt-[100px]">
        {/* Véhicules */}

        {roles && roles.includes("chauffeur") ? (
          <>
            <section>
              <h2 className="text-xl font-semibold mb-2 text-[32px]">
                Mes véhicules 🚗
              </h2>
              <button
                onClick={() => setCarModal(true)}
                className="bg-[#2E7D32] text-[#F5F5F5] px-[16px] py-[8px] rounded hover:bg-[#A5D6A7] outline-none"
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
                    (car: Car, index: number) => (
                      <div
                        key={car.voiture_id}
                        className="bg-[#A5D6A7] w-full h-[218px] p-[16px] rounded shadow flex flex-wrap justify-between items-center mt-[19px]"
                      >
                        <h1>Voiture {index + 1}</h1>
                        <p>
                          <strong>{car.modele}</strong> — {car.couleur} -{" "}
                          {car.libellé}{" "}
                          {car.energie ? "électrique" : "non éléctrique"} -{" "}
                          {car.immatriculation} -{" "}
                          {new Date(
                            car.premiere_immatriculation_date,
                          ).toLocaleDateString()}
                        </p>
                        <div className="flex gap-2 text-xl">
                          <button onClick={() => {}}>✏️</button>
                          <button
                            onClick={() => handleDeleteCar(car.voiture_id)}
                          >
                            🗑️
                          </button>
                        </div>
                      </div>
                    ),
                  )}
                </div>
              )}
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-2">Mes Préférences ⚙️</h2>
              <div className="bg-[#A5D6A7] w-full h-[218px] p-[16px] rounded shadow flex flex-wrap justify-between items-center mt-[19px]">
                <div className="flex gap-6">
                  <label className="flex items-center gap-[8px] mr-[16px]">
                    <input
                      type="checkbox"
                      checked={preferences.fumeur}
                      onChange={(e) =>
                        updatePreferences.mutate({
                          ...preferences,
                          fumeur: e.target.checked,
                        })
                      }
                    />
                    accepte les fumeurs 🚬
                  </label>

                  <label className="flex items-center gap-[8px] mr-[16px]">
                    <input
                      type="checkbox"
                      checked={preferences.animaux}
                      onChange={(e) =>
                        updatePreferences.mutate({
                          ...preferences,
                          animaux: e.target.checked,
                        })
                      }
                    />
                    accepte les animaux 🐶
                  </label>
                  <p>
                    {getPreferences.data?.[0]?.texte_libre ||
                      "Aucune préférence définie."}
                  </p>
                </div>
                {showPreferenceInput && (
                  <>
                    <input
                      type="text"
                      value={localTexteLibre}
                      placeholder="Nouvelle préférence"
                      onChange={(e) => setLocalTexteLibre(e.target.value)}
                      className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />

                    <button
                      className="mt-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                      onClick={() => {
                        updatePreferences.mutate(
                          {
                            ...preferences,
                            texte_libre: localTexteLibre,
                          },
                          {
                            onSuccess: () => {
                              getPreferences.refetch(); // force la maj du cache
                            },
                          },
                        );
                        console.log("Préférence ajoutée !");
                        setShowPreferenceInput(false);
                      }}
                    >
                      Ajouter
                    </button>
                  </>
                )}
                <button
                  className="bg-[#2E7D32] text-[#F5F5F5] px-[16px] py-[8px] rounded hover:bg-[#A5D6A7] outline-none"
                  onClick={() => setShowPreferenceInput((prev) => !prev)} // Bascule l'état
                >
                  ajouter une préférence
                </button>
              </div>
            </section>

            {/* Créer un voyage */}
            <section>
              <h2 className="text-2xl font-semibold mb-4 text-[#2E7D32]">
                Créer un voyage 🧭
              </h2>
              <div className="bg-[#A5D6A7] w-full p-6 rounded shadow-md flex flex-col gap-6 mt-4">
                <div className="flex flex-wrap justify-between gap-4">
                  <div className="flex flex-col w-[45%]">
                    <label className="text-sm font-medium text-[#2E7D32]">
                      Départ
                    </label>
                    <input
                      type="text"
                      placeholder="Départ"
                      value={formTrip.lieu_depart}
                      onChange={(e) => {
                        setFormTrip({
                          ...formTrip,
                          lieu_depart: e.target.value,
                        });
                      }}
                      className="px-4 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#2E7D32]"
                    />
                  </div>
                  <div className="flex flex-col w-[45%]">
                    <label className="text-sm font-medium text-[#2E7D32]">
                      Destination
                    </label>
                    <input
                      type="text"
                      placeholder="Destination"
                      value={formTrip.lieu_arrivee}
                      onChange={(e) => {
                        setFormTrip({
                          ...formTrip,
                          lieu_arrivee: e.target.value,
                        });
                      }}
                      className="px-4 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#2E7D32]"
                    />
                  </div>
                  <div className="flex flex-col w-[45%]">
                    <label className="text-sm font-medium text-[#2E7D32]">
                      Date de depart
                    </label>
                    <input
                      type="date"
                      value={formTrip.date_depart}
                      onChange={(e) => {
                        setFormTrip({
                          ...formTrip,
                          date_depart: e.target.value,
                        });
                      }}
                      className="px-4 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#2E7D32]"
                    />
                  </div>
                  <div className="flex flex-col w-[45%]">
                    <label className="text-sm font-medium text-[#2E7D32]">
                      Date arrivée
                    </label>
                    <input
                      type="date"
                      value={formTrip.arrive_date}
                      onChange={(e) => {
                        setFormTrip({
                          ...formTrip,
                          arrive_date: e.target.value,
                        });
                      }}
                      className="px-4 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#2E7D32]"
                    />
                  </div>
                  <div className="flex flex-col w-[45%]">
                    <label className="text-sm font-medium text-[#2E7D32]">
                      Heure de départ
                    </label>
                    <input
                      type="time"
                      value={formTrip.heure_depart}
                      onChange={(e) => {
                        setFormTrip({
                          ...formTrip,
                          heure_depart: e.target.value,
                        });
                      }}
                      className="px-4 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#2E7D32]"
                    />
                    <label className="text-sm font-medium text-[#2E7D32]">
                      Heure darrivée
                    </label>
                    <input
                      type="time"
                      value={formTrip.heure_arrivee}
                      onChange={(e) => {
                        setFormTrip({
                          ...formTrip,
                          heure_arrivee: e.target.value,
                        });
                      }}
                      className="px-4 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#2E7D32]"
                    />
                  </div>
                  <div className="flex flex-col w-[45%]">
                    <label className="text-sm font-medium text-[#2E7D32]">
                      Sélectionner un véhicule
                    </label>
                    <select
                      value={formTrip.voiture_id}
                      onChange={(e) => {
                        setFormTrip({
                          ...formTrip,
                          voiture_id: Number(e.target.value),
                        });
                      }}
                      className="bg-[#2E7D32] text-white px-4 py-2 rounded hover:bg-[#1B5E20] focus:outline-none focus:ring-2 focus:ring-[#1B5E20]"
                    >
                      {Array.isArray(getCar.data) ? (
                        getCar.data.map((car) => (
                          <option key={car.voiture_id} value={car.voiture_id}>
                            {car.modele}
                          </option>
                        ))
                      ) : (
                        <option>Aucune voiture disponible</option>
                      )}
                    </select>
                  </div>
                  <div className="flex flex-col w-[45%]">
                    <label className="text-sm font-medium text-[#2E7D32]">
                      Prix
                    </label>
                    <input
                      type="number"
                      placeholder="Prix"
                      value={formTrip.prix}
                      onChange={(e) => {
                        setFormTrip({
                          ...formTrip,
                          prix: Number(e.target.value),
                        });
                      }}
                      className="px-4 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#2E7D32]"
                    />
                  </div>
                  <div className="flex flex-col w-[45%]">
                    <label className="text-sm font-medium text-[#2E7D32]">
                      Places disponibles
                    </label>
                    <input
                      type="number"
                      placeholder="Places"
                      value={formTrip.nb_place}
                      onChange={(e) => {
                        setFormTrip({
                          ...formTrip,
                          nb_place: Number(e.target.value),
                        });
                      }}
                      className="px-4 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#2E7D32]"
                    />
                  </div>
                </div>
                <div className="flex justify-end">
                  <button
                    onClick={handleCreateCarpooling}
                    className="bg-[#2E7D32] text-white px-6 py-2 rounded hover:bg-[#1B5E20] focus:outline-none focus:ring-2 focus:ring-[#1B5E20]"
                  >
                    Créer
                  </button>
                </div>
              </div>
            </section>
          </>
        ) : null}

        {/* Historique */}
        <section>
          <h2 className="text-xl font-semibold mb-2">
            Historique et trajet à venir 🕐
          </h2>
          <div className="space-y-3">
            {Array.isArray(historyData) ? (
              historyData.map((history: Trip) => (
                <div
                  key={history.covoiturage_id}
                  className="bg-[#A5D6A7] p-4 rounded shadow flex flex-col gap-2"
                >
                  <h3 className="text-lg font-semibold">
                    {history.lieu_depart} - {history.lieu_arrivee}
                  </h3>
                  <p>
                    Date: {new Date(history.date_depart).toLocaleDateString()} à{" "}
                    {new Date(history.heure_depart).toLocaleTimeString()}
                  </p>
                  <p>
                    Places disponibles: {history.nb_place} - Prix:{" "}
                    {history.prix}€
                  </p>
                  {new Date(history.date_depart) > new Date() && (
                    <button
                      onClick={() =>
                        handleCancelTrip(
                          history.covoiturage_id,
                          user?.id ?? 0,
                          history.prix,
                        )
                      }
                    >
                      Annuler
                    </button>
                  )}
                </div>
              ))
            ) : (
              <p>Rien dans Historique</p>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
