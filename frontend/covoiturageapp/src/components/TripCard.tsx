import { FaStar } from "react-icons/fa";

import type { Trip } from "../hooks/useTrips";

interface Props {
  trip: Trip;
  onClickDetail: () => void;
}
export default function TripCard({ trip, onClickDetail }: Props) {
  function renderStars(note: number) {
    const fullStars = Math.floor(Number(note));
    const emptyStars = 5 - fullStars;

    return (
      <div className="flex gap-1">
        {[...Array(fullStars)].map((_, i) => (
          <FaStar key={`full-${i}`} color="gold" size={20} />
        ))}
        {[...Array(emptyStars)].map((_, i) => (
          <FaStar key={`empty-${i}`} color="#ccc" size={20} />
        ))}
      </div>
    );
  }

  function getTripDuration(
    departDate: string,
    departTime: string,
    arriveDate: string,
    arriveTime: string,
  ) {
    const depart = new Date(`${departDate.split("T")[0]}T${departTime}`);
    const arrivee = new Date(`${arriveDate.split("T")[0]}T${arriveTime}`);
    const diffMs = arrivee.getTime() - depart.getTime();

    if (diffMs <= 0) return "??";

    const totalMinutes = Math.floor(diffMs / 1000 / 60);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    return `${hours}h${minutes.toString().padStart(2, "0")}`;
  }

  return (
    <div className="bg-[#A5D6A7] w-full h-[200px] p-[20px] text-[20px] mt-[90px] ">
      <div className="flex justify-between gap-[400px]">
        <div className="flex flex-col items-center justify-center">
          <img src={trip.photo} alt={trip.pseudo} className="rounded-full" />
          <p className="lato-bold">{trip.pseudo}</p>
          <div>{renderStars(Number(trip.note_moyenne))}</div>
        </div>
        <div>
          <p className="lato-bold">{trip.lieu_depart}</p>
          <p>{trip.heure_depart}</p>

          <p className="lato-bold">{trip.lieu_arrivee}</p>
          <p>{trip.arrive_heure}</p>
        </div>
        <div>
          <p className="lato-bold">{trip.prix} crédits</p>
        </div>
      </div>
      <div className="flex justify-around mt-[50px]">
        <p>
          {" "}
          {getTripDuration(
            trip.date_depart,
            trip.heure_depart,
            trip.arrive_date,
            trip.arrive_heure,
          )}
        </p>
        <p>
          {trip.est_ecologique
            ? "Véhicule électrique"
            : "Voiture non électrique"}
        </p>
        <p>{trip.nb_place} place restante</p>
        <button
          className="bg-[#2E7D32]  text-[#F5F5F5] px-[15px] py-[6px]"
          onClick={onClickDetail}
        >
          Détail
        </button>
      </div>
    </div>
  );
}
