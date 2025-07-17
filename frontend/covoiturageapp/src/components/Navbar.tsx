import { Link } from "react-router-dom";
import logo from "../assets/feuille.png";
export default function Navbar() {
  return (
    <div className="w-screen text-[24px] h-[175px] bg-[#2e7d32] flex justify-around items-center ">
      <Link to="/">
        <img src={logo} alt="logo" width={115} height={115} />
      </Link>

      <Link
        to="covoiturage"
        className="no-underline text-[#F5F5F5] hover:bg-[#A5D6A7]  px-4 py-4 rounded"
      >
        Covoiturage
      </Link>
      <Link
        to="login"
        className="no-underline text-[#F5F5F5] hover:bg-[#A5D6A7]  px-4 py-2 rounded"
      >
        Connexion
      </Link>
      <Link
        to="contact"
        className="no-underline text-[#F5F5F5] hover:bg-[#A5D6A7]  px-4 py-2 rounded"
      >
        Contact
      </Link>
    </div>
  );
}
