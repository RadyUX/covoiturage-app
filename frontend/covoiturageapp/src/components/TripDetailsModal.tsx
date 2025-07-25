import { useState } from "react";
import { useTripDetail } from "../hooks/useDetails";
import LoginModal from "./LoginModal";
import { useUser } from "../context/UserContext";
import ConfirmModal from "./ConfirmModal";
export interface Avis {
  avis_id: number;
  auteur: string;
  note: number;
  commentaire: string;
}

export interface CovoiturageDetail {
  covoiturage_id: number;
  pseudo: string;
  photo: string;
  note_moyenne: number;
  nb_place: number;
  prix: number;
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
  avis: Avis[];
}

interface Props {
  onClose: () => void;
  open: boolean;
  tripId: number | null;
}

export default function TripDetailsModal({ onClose, open, tripId }: Props) {
  const { data: trip, isLoading, error } = useTripDetail(tripId ?? 0);
  const [showLogin, setShowLogin] = useState<boolean>(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const { isAuthenticated } = useUser();
  if (!open || !tripId) return null;
  if (isLoading) return <p>Chargement...</p>;
  if (error) return <p>une erreur sest produite</p>;
  if (isLoading || !trip) {
    return (
      <div className="bg-[#2E7D32] z-50 flex items-center justify-center fixed inset-0">
        <div className="w-[600px] max-h-[900px] overflow-y-auto rounded-lg shadow-lg p-6 relative">
          <button
            className="absolute top-2 right-2 text-gray-600 text-lg"
            onClick={onClose}
          >
            ✖
          </button>

          <div className="text-center text-white text-xl mt-20">
            {isLoading ? "Chargement..." : "Aucune donnée à afficher"}
          </div>
        </div>
      </div>
    );
  }

  console.log(trip);
  console.log("TripDetailsModal rendu", { open, tripId });
  return (
    <div className="bg-[#2E7D32] fixed top-1/2 left-1/2 z-50 transform -translate-x-1/2 -translate-y-1/2  flex items-center justify-center w-full h-[600px] text-[#F5F5F5]">
      <div className=" w-[600px] max-h-[900px] overflow-y-auto rounded-lg shadow-lg p-6 relative">
        <button
          className="absolute top-2 right-2 text-gray-600 text-lg"
          onClick={onClose}
        >
          ✖
        </button>

        <div className="mb-4 text-center">
          <img
            src={trip.photo}
            alt="photo conducteur"
            className="mx-auto w-20 h-20 rounded-full"
          />
        </div>
        <div className="text-sm text-gray-800">
          <p className="p-[10px]">
            <strong>Départ :🏁</strong> à {trip.lieu_depart} le{" "}
            {new Date(trip.date_depart).toLocaleDateString("fr-FR", {
              day: "2-digit",
              month: "long",
            })}{" "}
            à {trip.heure_depart}
          </p>
          <p className="p-[10px]">
            <strong>Arrivée :🚩</strong> à {trip.lieu_arrivee}{" "}
            {new Date(trip.arrive_date).toLocaleDateString("fr-FR", {
              day: "2-digit",
              month: "long",
            })}{" "}
            à {trip.arrive_heure}
          </p>
          <p className="p-[10px]">
            <strong>Places dispo :👪</strong> {trip.nb_place}
          </p>
          <p className="p-[10px]">
            <strong>Prix : 💲</strong> {trip.prix} crédits
          </p>

          <p className="p-[10px]">
            <strong>Écologique : 🍃</strong>{" "}
            {trip.est_ecologique ? "Oui ✅" : "Non ❌"}
          </p>

          <p className="p-[10px]">
            <strong>Voiture : 🚗</strong> {trip.voiture_couleur}{" "}
            {trip.voiture_modele}
          </p>
          <p className="p-[10px]">
            <strong>Animaux : 🐶</strong>{" "}
            {trip.preferences.animaux ? "Oui" : "Non"}
          </p>
          <p className="p-[10px]">
            <strong>Fumeur : 🚬</strong>{" "}
            {trip.preferences.fumeur ? "Oui" : "Non"}
          </p>
          <p className="p-[10px]">
            <strong>Préference : 💟</strong> {trip.texte_libre}
          </p>
          {isAuthenticated ? (
            <>
              <button
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded"
                onClick={() => setShowConfirm(true)}
              >
                Participer
              </button>
              {showConfirm && (
                <ConfirmModal
                  tripCredit={trip.prix}
                  onCancel={() => setShowConfirm(false)}
                  onConfirm={() => {
                    setShowConfirm(false);
                    // appelle ici ton endpoint API de participation
                    console.log("✅ Participation confirmée !");
                  }}
                />
              )}
            </>
          ) : (
            <button className="p-[10px]" onClick={() => setShowLogin(true)}>
              RESERVER
            </button>
          )}
          {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}
        </div>

        <div className="mt-4 border-t pt-4">
          <h3 className="font-semibold mb-2">Avis des passagers :</h3>
          {trip.avis.length > 0 ? (
            <ul className="space-y-2">
              {trip.avis.map((a) => (
                <li key={a.avis_id} className="bg-gray-100 rounded p-2">
                  <p className="font-medium">
                    {a.auteur} — {a.note} ⭐
                  </p>
                  <p className="text-sm">{a.commentaire}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p>Aucun avis disponible.</p>
          )}
        </div>
      </div>
    </div>
  );
}
