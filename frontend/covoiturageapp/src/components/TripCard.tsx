import star from "../assets/star.svg";

export default function TripCard() {
  return (
    <div className="bg-[#A5D6A7] w-full h-[200px] p-[20px] text-[20px] mt-[90px] ">
      <div className="flex justify-between gap-[400px]">
        <div className="flex flex-col items-center justify-center">
          <img
            src="../../public/vite.svg"
            alt="photo"
            className="rounded-full"
          />
          <p className="lato-bold">pseudo</p>
          <div>
            <img
              src={star}
              alt="star"
              className="bg-[#234676]"
              width={15}
              height={15}
            />
            <img src={star} alt="star" width={15} height={15} />
            <img src={star} alt="star" width={15} height={15} />
            <img src={star} alt="star" width={15} height={15} />
            <img src={star} alt="star" width={15} height={15} />
          </div>
        </div>
        <div>
          <p className="lato-bold">Paris</p>
          <p>18h00</p>

          <p className="lato-bold">Marseille</p>
          <p>19h</p>
        </div>
        <div>
          <p className="lato-bold">2 credits</p>
        </div>
      </div>
      <div className="flex justify-around mt-[50px]">
        <p>1h50</p>
        <p>véhicule non électrique</p>
        <p>2 place restantes</p>
        <button className="bg-[#2E7D32]  text-[#F5F5F5] px-[15px] py-[6px]">
          Détail
        </button>
      </div>
    </div>
  );
}
