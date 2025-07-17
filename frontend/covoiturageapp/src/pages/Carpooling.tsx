import TripCard from "../components/TripCard";
import { FaFilter } from "react-icons/fa";
import TripSearchForm from "../components/TripSearchForm";
import star from "../assets/star.svg";
export default function Carpooling() {
  return (
    <div className="ml-[169px] :mr-[169px] flex flex-col items-center">
      <h1 className="text-center mb-[40px]">Covoiturage</h1>
      <TripSearchForm />

      <div className="w-[1107px] h-[200px] bg-[#A5D6A7] mt-[90px] ">
        <div className="flex items-center justify-center gap-2 mb-[44px]">
          <FaFilter />
          <h2 className="text-xl font-semibold">Filtrer</h2>
        </div>
        {/* Filtres */}
        <div className="flex flex-wrap items-center gap-6 justify-evenly">
          {/* Checkbox */}
          <label className="flex items-center gap-2">
            <input type="checkbox" />
            <span className="text-sm">voiture électrique</span>
          </label>

          {/* Note min */}
          <div className="flex items-center gap-2">
            <span className="text-sm">note min</span>
            {[...Array(5)].map((_, i) => (
              <img
                src={star}
                key={i}
                alt="star"
                className="cursor-pointer"
                width={20}
                height={20}
              />
            ))}
          </div>

          {/* Durée max */}
          <label className="flex items-center gap-2">
            <span className="text-sm">durée max</span>
            <input
              type="text"
              placeholder="ex: 3h"
              className="w-20 p-1 border border-gray-300 rounded"
            />
          </label>

          {/* Prix max */}
          <label className="flex items-center gap-2">
            <span className="text-sm">prix max</span>
            <input
              type="text"
              placeholder="ex: 3 crédits"
              className="w-20 p-1 border border-gray-300 rounded"
            />
          </label>
        </div>
      </div>

      <div className=" mt-[90px]">
        <TripCard />
        <TripCard />
        <TripCard />
        <TripCard />
        <TripCard />
      </div>
    </div>
  );
}
