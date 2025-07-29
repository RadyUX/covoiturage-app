/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { useUser } from "../context/UserContext";
import { useCar, type Car } from "../hooks/useCar";
import AddVehicleModal from "../components/AddCarModal";
import axios from "axios";
import { API_URL } from "../../config";
import { usePreferences } from "../hooks/usePref";
import { useEffect } from "react";

export default function Profile() {
  const [roles, setRoles] = useState<string[]>([]);

  const [carModal, setCarModal] = useState(false);
  const [showPreferenceInput, setShowPreferenceInput] = useState(false);
  const { user } = useUser();
  const { getCar } = useCar(user?.id ?? 0);
  const { getPreferences, updatePreferences } = usePreferences(user?.id ?? 0);
  const [localTexteLibre, setLocalTexteLibre] = useState(
    getPreferences.data?.[0]?.texte_libre || "",
  );
  console.log("Données des préférences :", getPreferences.data);
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
                        key={car.id}
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
                          <button>✏️</button>
                          <button>🗑️</button>
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
                        updatePreferences.mutate(
                          {
                            ...preferences,
                            fumeur: e.target.checked,
                          },
                          {
                            onSuccess: () => {
                              getPreferences.refetch(); // force la maj du cache
                            },
                          },
                        )
                      }
                    />
                    accepte les fumeurs 🚬
                  </label>

                  <label className="flex items-center gap-[8px] mr-[16px]">
                    <input
                      type="checkbox"
                      checked={preferences.animaux}
                      onChange={(e) =>
                        updatePreferences.mutate(
                          {
                            ...preferences,
                            animaux: e.target.checked,
                          },
                          {
                            onSuccess: () => {
                              getPreferences.refetch(); // force la maj du cache
                            },
                          },
                        )
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
          </>
        ) : null}

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
