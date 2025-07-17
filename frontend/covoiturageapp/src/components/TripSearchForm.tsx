export default function TripSearchForm() {
  return (
    <form className="flex justify-center gap-10 px-4 mt-16">
      <div className="mr-11">
        <input
          type="text"
          placeholder="Départ"
          className="w-[245px] h[100px] px-[24px] py-[12px] placeholder-[#263238] outline-none  bg-[#A5D6A7] rounded-[6px] mr-[10px]"
        />
      </div>

      <div>
        <input
          type="text"
          placeholder="Destination"
          className="w-[245px] h[100px] px-[24px] py-[12px] placeholder-[#263238] outline-none  bg-[#A5D6A7] rounded-[6px] mr-[10px]"
        />
      </div>

      <div>
        <input
          type="date"
          placeholder="date"
          className="w-[245px] h[100px]  px-[24px] py-[12px] placeholder-[#263238] outline-none  bg-[#A5D6A7] rounded-[6px] mr-[10px]"
        />
      </div>

      <div>
        <button
          type="submit"
          className="w-[142px] px-[24px] py-[12px] text-[#F5F5F5] bg-[#2E7D32] hover:bg-[#A5D6A7] cursor-pointer rounded-[6px] transition"
        >
          Recherche
        </button>
      </div>
    </form>
  );
}
