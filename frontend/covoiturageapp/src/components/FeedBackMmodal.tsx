import { useState } from "react";

type FeedbackModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (note: number, commentaire: string) => void;
};

export default function FeedbackModal({
  isOpen,
  onClose,
  onSubmit,
}: FeedbackModalProps) {
  const [note, setNote] = useState(5);
  const [commentaire, setCommentaire] = useState("");

  if (!isOpen) return null;
  console.log("FeedbackModal isOpen:", isOpen);
  return (
    <div className="fixed left-[0px] right-[0px] bg-[#2e7d32] bg-opacity-50 flex justify-center items-center z-50 ">
      <div className="bg-white p-6 rounded-xl w-[90%] max-w-md shadow-xl">
        <h2 className="text-xl font-bold mb-4">Laissez un avis</h2>

        <label className="block mb-2 font-medium">Note (1 à 5)</label>
        <input
          type="number"
          value={note}
          onChange={(e) => setNote(Number(e.target.value))}
          min={1}
          max={5}
          className="w-full mb-4 border rounded px-3 py-2"
        />

        <label className="block mb-2 font-medium">Commentaire</label>
        <textarea
          value={commentaire}
          onChange={(e) => setCommentaire(e.target.value)}
          rows={4}
          className="w-full border rounded px-3 py-2 mb-4"
          placeholder="Partagez votre expérience..."
        />

        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="bg-gray-300 hover:bg-gray-400 text-black px-4 py-2 rounded"
          >
            Annuler
          </button>
          <button
            onClick={() => onSubmit(note, commentaire)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          >
            Envoyer
          </button>
        </div>
      </div>
    </div>
  );
}
