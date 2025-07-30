import { useState } from "react";
import TripCard from "./TripCard";
import TripDetailsModal from "./TripDetailsModal";

interface Trip {
  covoiturage_id: number;
  lieu_depart: string;
  lieu_arrivee: string;
  date_depart: string;
  heure_depart: string;
  arrive_date: string;
  arrive_heure: string;
  nb_place: number;
  prix: number;
  pseudo: string;
  photo: string;
  est_ecologique: boolean;
  note_moyenne: string;
}

interface Props {
  trips?: Trip[];
  isLoading: boolean;
  error: unknown;
}

const CarpoolingList: React.FC<Props> = ({
  trips,
  isLoading,
  error,
}: Props) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTripId, setSelectedTripId] = useState<number | null>(null);
  console.log(modalOpen, selectedTripId);
  if (isLoading) return <p>Chargement...</p>;
  if (error) return <p>Une erreur est survenue.</p>;
  if (trips?.length === 0) return <p>Aucun trajet trouvé.</p>;
  console.log("modalOpen:", modalOpen, "selectedTripId:", selectedTripId);
  return (
    <div className="flex flex-col gap-4 mt-8">
      {(trips || []).map(
        (trip) =>
          trip.nb_place > 0 && (
            <TripCard
              key={trip.covoiturage_id}
              trip={trip}
              onClickDetail={() => {
                setSelectedTripId(trip.covoiturage_id);
                setModalOpen(true);
              }}
            />
          ),
      )}

      {modalOpen && selectedTripId !== null && (
        <TripDetailsModal
          open={modalOpen}
          tripId={selectedTripId}
          onClose={() => {
            setModalOpen(false);
            setSelectedTripId(null);
          }}
        />
      )}
    </div>
  );
};

export default CarpoolingList;
