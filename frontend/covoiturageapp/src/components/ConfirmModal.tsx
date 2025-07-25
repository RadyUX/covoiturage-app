// components/ConfirmModal.tsx
type ConfirmModalProps = {
  tripCredit: number;
  onConfirm: () => void;
  onCancel: () => void;
};

export default function ConfirmModal({
  tripCredit,
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
      <div className="bg-white rounded-lg p-6 max-w-sm w-full text-gray-800">
        <h2 className="text-lg font-semibold mb-4">Confirmation</h2>
        <p className="mb-6">
          Voulez-vous vraiment participer à ce trajet pour{" "}
          <span className="text-blue-600 font-bold">{tripCredit}</span> crédits
          ?
        </p>
        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300"
          >
            Annuler
          </button>
          <button
            onClick={onConfirm}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Confirmer
          </button>
        </div>
      </div>
    </div>
  );
}
