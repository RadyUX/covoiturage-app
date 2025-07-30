import { Link } from "react-router-dom";
import logo from "../assets/feuille.png";
import { useAuth } from "../hooks/useAuth";
import { useCredits } from "../hooks/useCredits";
import { useUser } from "../context/UserContext";

export default function Navbar() {
  const { logout } = useAuth();
  const { user, isAuthenticated } = useUser();
  const creditQuery = useCredits(user?.id ?? null);
  console.log("Utilisateur dans le contexte :", user);
  console.log("ID utilisateur :", user?.id);
  console.log("Crédits récupérés :", creditQuery.data);
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
      {isAuthenticated ? (
        <>
          <Link
            to="/profil"
            className="no-underline text-[#F5F5F5] hover:bg-[#A5D6A7] px-4 py-2 rounded"
          >
            Profil
          </Link>
          <div className="text-[#F5F5F5] bg-[#388E3C] px-4 py-2 rounded">
            💰 {creditQuery.data ?? 0} crédits
          </div>
          <button
            onClick={logout}
            className="text-[#F5F5F5] hover:bg-red-500 px-4 py-2 rounded"
          >
            Déconnexion
          </button>
        </>
      ) : (
        <>
          <Link
            to="/login"
            className="no-underline text-[#F5F5F5] hover:bg-[#A5D6A7] px-4 py-2 rounded"
          >
            Connexion
          </Link>
          <Link
            to="/contact"
            className="no-underline text-[#F5F5F5] hover:bg-[#A5D6A7] px-4 py-2 rounded"
          >
            Contact
          </Link>
        </>
      )}
    </div>
  );
}
