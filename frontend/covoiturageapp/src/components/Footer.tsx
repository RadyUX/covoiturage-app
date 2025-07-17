import { Link } from "react-router-dom";
export default function Footer() {
  return (
    <footer className="bg-[#2E7D32] text-[#F5F5F5] text-center flex justify-center flex-col text-[20px] py-10 mt-20 h-[390px]">
      <p className="mb-2">
        <p className="underline hover:text-gray-200">
          covoiturageapp@gmail.com
        </p>
      </p>
      <Link to="mentionlegal" className="cursor-pointer hover:underline">
        Mention Légal
      </Link>
    </footer>
  );
}
