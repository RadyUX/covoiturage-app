import { useUser } from "../context/UserContext";

export default function Profile() {
  const { user } = useUser();

  return (
    <div className="bg-[#E8F5E9] min-h-screen font-sans">
      {/* Header */}
      <header className="bg-[#A5D6A7] text-white py-6 text-center text-lg">
        Bonjour {user?.pseudo || "Utilisateur"}
        <div className="flex justify-center gap-4 mt-2">
          <label className="flex items-center gap-2">
            <input type="checkbox" />
            chauffeur
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" />
            passager
          </label>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-10 space-y-10">
        {/* Véhicules */}
        <section>
          <h2 className="text-xl font-semibold mb-2">Mes véhicules 🚗</h2>
          <button className="bg-green-700 text-white px-4 py-2 rounded hover:bg-green-800">
            ajouter un véhicule
          </button>
          <div className="bg-green-300 mt-4 p-4 rounded shadow flex flex-wrap justify-between items-center gap-2">
            <p>
              <strong>Voiture 1</strong> - AA-000-AA - 09/10/11 - Ford - grise -
              électrique - 8 places
            </p>
            <div className="flex gap-2 text-xl">
              <button>✏️</button>
              <button>🗑️</button>
            </div>
          </div>
        </section>

        {/* Préférences */}
        <section>
          <h2 className="text-xl font-semibold mb-2">Mes Préférences ⚙️</h2>
          <div className="bg-green-300 p-4 rounded shadow flex items-center justify-between">
            <div className="flex gap-6">
              <label className="flex items-center gap-2">
                <input type="checkbox" checked />
                accepte les fumeurs
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" checked />
                accepte les animaux
              </label>
            </div>
            <button className="bg-green-700 text-white px-3 py-2 rounded hover:bg-green-800">
              ajouter une préférence
            </button>
          </div>
        </section>

        {/* Créer un voyage */}
        <section>
          <h2 className="text-xl font-semibold mb-2">Créer un voyage 🧭</h2>
          <div className="bg-green-300 p-4 rounded shadow space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              <input
                type="text"
                placeholder="Départ"
                className="px-2 py-1 rounded border"
              />
              <input
                type="text"
                placeholder="Destination"
                className="px-2 py-1 rounded border"
              />
              <input type="date" className="px-2 py-1 rounded border" />
              <input type="time" className="px-2 py-1 rounded border" />
              <select className="px-2 py-1 rounded border">
                <option>Voiture 1</option>
              </select>
              <input
                type="number"
                placeholder="Prix"
                className="px-2 py-1 rounded border"
              />
              <input
                type="number"
                placeholder="Place"
                className="px-2 py-1 rounded border"
              />
            </div>
            <button className="bg-green-700 text-white px-4 py-2 rounded hover:bg-green-800">
              Créer
            </button>
          </div>
        </section>

        {/* Historique */}
        <section>
          <h2 className="text-xl font-semibold mb-2">
            Historique et trajet à venir 🕐
          </h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center bg-green-300 p-3 rounded">
              <p>
                <strong>Trajet 1</strong> — Paris &gt; Marseille, le 20/10/2025
              </p>
              <button className="bg-green-800 text-white px-3 py-1 rounded hover:bg-green-900">
                Annuler
              </button>
            </div>
            <div className="flex justify-between items-center bg-green-300 p-3 rounded">
              <p>
                <strong>Trajet 2</strong> — Paris &gt; Marseille, le 12/01/2025
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
