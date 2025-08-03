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
import { useQueryClient } from "@tanstack/react-query";
import FeedbackModal from "../components/FeedBackMmodal";
export default function Profile() {
  const [roles, setRoles] = useState<string[]>([]);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const queryClient = useQueryClient();
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
  const [tripId, setTripId] = useState<number | null>(null);
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
    if (Array.isArray(getCar.data) && getCar.data.length > 0) {
      setFormTrip((prevFormTrip) => ({
        ...prevFormTrip,
        voiture_id:
          Array.isArray(getCar?.data) && getCar.data.length > 0
            ? getCar.data[0].voiture_id
            : 0, // Définit la première voiture comme sélectionnée par défaut
      }));
    }
  }, [getCar.data]);
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
    deleteCar.mutate(carId, {
      onSuccess: () => {
        getCar.refetch();
        queryClient.invalidateQueries({ queryKey: ["cars"] });
        console.log("Voiture supprimée avec succès");
      },
      onError: (err: any) => {
        console.error("Erreur lors de la suppression de la voiture :", err);

        if (
          typeof err === "object" &&
          err !== null &&
          "response" in err &&
          err.response?.status === 400
        ) {
          alert(
            "Vous ne pouvez pas supprimer une voiture qui participe actuellement à un trajet.",
          );
        } else {
          alert(
            "Une erreur est survenue lors de la suppression de la voiture.",
          );
        }
      },
    });
  };
  console.log("FeedbackModal isOpen:", showFeedbackModal);
  const handleValidation = async (
    userId: number,
    tripId: number,
    status: string,
  ) => {
    try {
      const token = localStorage.getItem("userToken");
      const response = await axios.post(
        `${API_URL}/api/trips/validate`,
        {
          covoiturage_id: tripId,
          user_id: userId,
          status: status,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      console.log("Validation enregistrée :", response.data);
      setShowFeedbackModal(true);
      queryClient.invalidateQueries({ queryKey: ["history", user?.id ?? 0] });
      alert(
        status === "validated"
          ? "Merci pour votre validation !"
          : "Votre problème a été signalé, un employé sera mis au jus ⚡.",
      );
    } catch (error) {
      console.error("Erreur lors de la validation du trajet :", error);
      alert("Une erreur est survenue lors de la validation.");
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

  const handleStart = async (tripId: number, userId: number) => {
    try {
      const token = localStorage.getItem("userToken");
      const response = await axios.put(
        `${API_URL}/api/trips/start`,
        {
          covoiturage_id: tripId,
          user_id: userId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      queryClient.invalidateQueries({ queryKey: ["history", userId] });
      console.log("Trajet démarré avec succès :", response.data);
    } catch (error) {
      console.error("Erreur lors du démarrage du trajet :", error);
    }
  };

  const handleEnd = async (tripId: number, userId: number) => {
    try {
      const token = localStorage.getItem("userToken");
      const response = await axios.put(
        `${API_URL}/api/trips/end`,
        {
          covoiturage_id: tripId,
          user_id: userId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      console.log("Trajet terminé avec succès :", response.data);
      queryClient.invalidateQueries({ queryKey: ["history", userId] });
    } catch (error) {
      console.error("Erreur lors de la terminaison du trajet :", error);
    }
  };

  const handleFeedbackSubmit = async (note: number, commentaire: string) => {
    try {
      const token = localStorage.getItem("userToken");
      const response = await axios.post(
        `${API_URL}/api/avis/add`,
        {
          commentaire,
          note,
          auteur_id: user?.id, // ID de l'utilisateur qui donne l'avis
          covoiturage_id: tripId, // ID du trajet
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      console.log("Avis enregistré :", response.data);
      setShowFeedbackModal(false);
    } catch (error) {
      console.error("Erreur lors de l'enregistrement de l'avis :", error);
    }
  };
  return (
    <div className="bg-[#E8F5E9] min-h-screen font-sans">
      <FeedbackModal
        isOpen={showFeedbackModal}
        onClose={() => setShowFeedbackModal(false)}
        onSubmit={handleFeedbackSubmit}
      />
      {/* Header */}
      <header className="bg-[#A5D6A7] text-white py-6 text-center text-lg h-[218px] flex flex-col items-center justify-center ">
        <h1 className="text-[36px] ">
          Bonjour {user?.pseudo || "Utilisateur"} 👋
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
                      onChange={(e) => {
                        const updatedPreferences = {
                          ...preferences,
                          animaux: e.target.checked,
                        };
                        console.log("Données envoyées :", updatedPreferences); // Ajoute un log
                        updatePreferences.mutate(updatedPreferences, {
                          onSuccess: () => {
                            queryClient.invalidateQueries({
                              queryKey: ["prefs", user?.id ?? 0],
                            });
                          },
                        });
                      }}
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
                  className="bg-[#A5D6A7] p-4 rounded shadow flex flex-col gap-[10px] mt-[10px]"
                >
                  <h3 className="text-lg font-semibold">
                    {history.lieu_depart} - {history.lieu_arrivee}
                  </h3>
                  <p>
                    Date: {new Date(history.date_depart).toLocaleDateString()}
                  </p>
                  <p>Prix: {history.prix} crédits</p>
                  {new Date(history.date_depart).setHours(0, 0, 0, 0) >=
                    new Date().setHours(0, 0, 0, 0) && (
                    <>
                      {history.isStarted ? (
                        <p>le trajet a deja commencé </p>
                      ) : history.isEnded ? (
                        <p>le trajet est terminé</p>
                      ) : (
                        <button
                          onClick={() => {
                            handleCancelTrip(
                              history.covoiturage_id,
                              user?.id ?? 0,
                              history.prix,
                            );
                            queryClient.invalidateQueries({
                              queryKey: ["credits"],
                            });
                            queryClient.invalidateQueries({
                              queryKey: ["history", user?.id ?? 0],
                            });
                            alert("votre annulation a été prise en compte");
                          }}
                        >
                          Annuler
                        </button>
                      )}

                      {console.log("ISOWNER", history.isOwner)}
                      {history.isOwner && (
                        <>
                          {console.log("ISSTARTED", history.isStarted)}
                          {history.isEnded ? (
                            <p>Trajet terminé</p>
                          ) : history.isStarted ? (
                            <button
                              onClick={() =>
                                handleEnd(history.covoiturage_id, user?.id ?? 0)
                              }
                            >
                              Terminer
                            </button>
                          ) : (
                            <button
                              onClick={() =>
                                handleStart(
                                  history.covoiturage_id,
                                  user?.id ?? 0,
                                )
                              }
                            >
                              Commencer
                            </button>
                          )}
                        </>
                      )}
                      {!history.isOwner && history.isEnded && (
                        <div className="bg-[#FFCDD2] p-4 rounded shadow flex flex-col gap-2">
                          <h3 className="text-lg font-semibold">
                            Valider le trajet
                          </h3>
                          <p>
                            Veuillez indiquer si le trajet s&#39;est bien passé
                            :
                          </p>
                          <div className="flex gap-4">
                            <button
                              className="bg-[#2E7D32] text-white px-4 py-2 rounded hover:bg-[#1B5E20]"
                              onClick={() => {
                                setTripId(history.covoiturage_id);
                                handleValidation(
                                  user?.id ?? 0,
                                  history.covoiturage_id,
                                  "validated",
                                );
                              }}
                            >
                              Tout s&#39;est bien passé 👍
                            </button>
                            <button
                              className="bg-[#D32F2F] text-white px-4 py-2 rounded hover:bg-[#B71C1C]"
                              onClick={() => {
                                setTripId(history.covoiturage_id);
                                handleValidation(
                                  user?.id ?? 0,
                                  history.covoiturage_id,
                                  "problem",
                                );
                              }}
                            >
                              Problème rencontré 👎
                            </button>
                          </div>
                        </div>
                      )}
                    </>
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
