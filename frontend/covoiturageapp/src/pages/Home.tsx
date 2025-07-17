import highway from "../assets/highway.jpg";
import carpooling from "../assets/carpooling.jpg";
import TripSearchForm from "../components/TripSearchForm";
export default function Home() {
  return (
    <>
      <div className=" relative w-screen h-[387px]">
        <img
          src={highway}
          alt="highway"
          className="object-cover w-full h-full"
        />

        <div className="absolute text-center text-[#F5F5F5] transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
          <h1 className="text-5xl font-bold lato-bold">COVOITURAGE APP</h1>
          <h2 className="mt-2 text-xl">Roulez ensemble, roulez mieux</h2>
        </div>
      </div>

      <div className="ml-[169px] mr-[169px] mt-[90px] flex justify-around items-center">
        <p className="w-[500px] text-[20px]">
          {" "}
          votre partenaire de mobilité durable. Rejoignez une communauté engagée
          pour un avenir plus vert. En optant pour le covoiturage, vous réduisez
          vos frais de transport, rencontrez d’autres voyageurs, et agissez
          concrètement pour la planète. <br />
          <br />
          Notre plateforme simple et intuitive vous accompagne à chaque étape :
          de la recherche de trajet à la mise en relation avec des conducteurs
          fiables. Passez à l’action, partagez vos trajets, économisez du temps
          et de l’énergie
        </p>

        <img src={carpooling} alt="carpooling" width={400} height={500} />
      </div>
      <div className="lg:ml-[169px] lg:mr-[169px] mt-[90px]">
        <h1 className="text-center">chercher un itinéraire</h1>
        <TripSearchForm />
      </div>
      <div className="px-6 my-20  mt-[90px] ml-[169px] mr-[169px] flex flex-col justify-center items-center">
        <h2 className="mb-6 text-3xl font-semibold text-center text-gray-800">
          Pourquoi nous choisir ?
        </h2>
        <p className="w-[500px] text-[20px] mx-autod text-gray-700  mt-[60px] mb-[90px]">
          votre partenaire pour une mobilité responsable. En choisissant notre
          plateforme, vous rejoignez une communauté soucieuse de l’environnement
          et économisez sur vos trajets quotidiens. Notre système met en
          relation passagers et conducteurs de façon simple, sécurisée et
          rapide. Chaque trajet est une opportunité de partage, d’économie et
          d’impact positif sur la planète.
        </p>
      </div>
    </>
  );
}
