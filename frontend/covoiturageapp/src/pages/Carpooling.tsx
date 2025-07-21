import { FaFilter } from "react-icons/fa";
import TripSearchForm from "../components/TripSearchForm";
import star from "../assets/star.svg";
import { useTrips } from "../hooks/useTrips";
import CarpoolingList from "../components/CarpoolingList";
import { useState } from "react";
import { useLocation } from "react-router-dom";
interface Filter {
  est_ecologique: boolean;
  prix_max?: number;
  duree_max?: number;
  note_min?: number;
}

export default function Carpooling() {
  const [filters, setFilters] = useState<Filter>({
    est_ecologique: false,
    prix_max: undefined,
    duree_max: undefined,
    note_min: undefined,
  });
  const location = useLocation();
  const initialCriteria = location.state || {
    lieu_depart: "",
    lieu_arrivee: "",
    date: "",
  };
  const [criteria, setCriteria] = useState(initialCriteria);

  const { data: trips, isLoading, error } = useTrips(criteria, filters);
  return (
    <div className="ml-[169px] :mr-[169px] flex flex-col items-center h-screen ">
      <h1 className="text-center mb-[40px]">Covoiturage</h1>
      <TripSearchForm onSearch={setCriteria} />

      <div className="w-[1107px] h-[200px] bg-[#A5D6A7] mt-[90px] ">
        <div className="flex items-center justify-center gap-2 mb-[44px]">
          <FaFilter />
          <h2 className="text-xl font-semibold">Filtrer</h2>
        </div>

        <div className="flex flex-wrap items-center gap-6 justify-evenly">
          {/* Checkbox */}
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={filters.est_ecologique}
              onChange={(e) =>
                setFilters({ ...filters, est_ecologique: e.target.checked })
              }
            />
            <span className="text-sm">voiture électrique</span>
          </label>

          {/* Note min */}
          <div className="flex items-center gap-2">
            <span className="text-sm">note min</span>
            {/* Note min */}
            {[...Array(5)].map((_, i) => (
              <img
                key={i}
                src={star}
                alt="star"
                className="cursor-pointer"
                width={20}
                height={20}
                onClick={() => setFilters({ ...filters, note_min: i + 1 })}
                style={{
                  backgroundColor: filters.note_min > i ? "yellow" : "gray",
                }}
              />
            ))}
          </div>

          {/* Durée max */}
          <label className="flex items-center gap-2">
            <span className="text-sm">durée max</span>
            <input
              type="text"
              min="1"
              placeholder="ex: 3h"
              className="w-20 p-1 border border-gray-300 rounded"
              value={filters.duree_max || ""}
              onChange={(e) =>
                setFilters({
                  ...filters,
                  duree_max: Number(e.target.value) || undefined,
                })
              }
            />
          </label>

          {/* Prix max */}
          <label className="flex items-center gap-2">
            <span className="text-sm">prix max</span>
            <input
              type="text"
              placeholder="ex: 3 crédits"
              className="w-20 p-1 border border-gray-300 rounded"
              value={filters.prix_max || ""}
              onChange={(e) =>
                setFilters({
                  ...filters,
                  prix_max: Number(e.target.value) || undefined,
                })
              }
            />
          </label>
        </div>
      </div>

      <div className=" mt-[90px]"></div>
      <CarpoolingList trips={trips} isLoading={isLoading} error={error} />
    </div>
  );
}
