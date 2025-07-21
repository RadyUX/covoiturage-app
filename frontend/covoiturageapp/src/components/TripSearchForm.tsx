import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface Props {
  onSearch?: (criteria: {
    lieu_depart: string;
    lieu_arrivee: string;
    date: string;
  }) => void;
}
export default function TripSearchForm({ onSearch }: Props) {
  const navigate = useNavigate();
  const [formData, setformData] = useState({
    lieu_depart: "",
    lieu_arrivee: "",
    date: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(formData);
    } else {
      navigate("/covoiturage", { state: formData });
    }
  };
  return (
    <>
      <form
        className="flex justify-center gap-10 px-4 mt-16"
        onSubmit={handleSubmit}
      >
        <div className="mr-11">
          <input
            type="text"
            placeholder="Départ"
            value={formData.lieu_depart}
            onChange={(e) =>
              setformData({ ...formData, lieu_depart: e.target.value })
            }
            className="w-[245px] h[100px] px-[24px] py-[12px] placeholder-[#263238] outline-none  bg-[#A5D6A7] rounded-[6px] mr-[10px]"
          />
        </div>

        <div>
          <input
            type="text"
            placeholder="Destination"
            value={formData.lieu_arrivee}
            onChange={(e) =>
              setformData({ ...formData, lieu_arrivee: e.target.value })
            }
            className="w-[245px] h[100px] px-[24px] py-[12px] placeholder-[#263238] outline-none  bg-[#A5D6A7] rounded-[6px] mr-[10px]"
          />
        </div>

        <div>
          <input
            type="date"
            placeholder="date"
            value={formData.date}
            onChange={(e) => setformData({ ...formData, date: e.target.value })}
            className="w-[245px] h[100px]  px-[24px] py-[12px] placeholder-[#263238] outline-none  bg-[#A5D6A7] rounded-[6px] mr-[10px]"
          />
        </div>

        <div>
          <button
            type="submit"
            className="w-[142px] px-[24px] py-[12px] text-[#F5F5F5] bg-[#2E7D32] hover:bg-[#A5D6A7] cursor-pointer rounded-[6px] transition"
          >
            Rechercher
          </button>
        </div>
      </form>
    </>
  );
}
