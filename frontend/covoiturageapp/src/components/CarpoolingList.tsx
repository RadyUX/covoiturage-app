import TripCard from "./TripCard";

interface Trip {
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
  if (isLoading) return <p>Chargement...</p>;
  if (error) return <p>Une erreur est survenue.</p>;
  if (trips?.length === 0) return <p>Aucun trajet trouvé.</p>;

  return (
    <div className="flex flex-col gap-4 mt-8">
      {(trips || []).map(
        (trip) =>
          trip.nb_place > 0 && (
            <TripCard key={trip.covoiturage_id} trip={trip} />
          ),
      )}
    </div>
  );
};

export default CarpoolingList;
