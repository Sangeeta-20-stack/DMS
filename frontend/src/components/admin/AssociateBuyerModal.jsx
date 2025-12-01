import { useEffect, useState } from "react";

export default function AssociateBuyerModal({ order, onClose, onUpdated }) {
  const [buyers, setBuyers] = useState([]);
  const [selectedBuyer, setSelectedBuyer] = useState("");

  useEffect(() => {
    fetch("/api/buyers") // replace with your backend route
      .then((res) => res.json())
      .then(setBuyers);
  }, []);

  const handleAssociate = async () => {
    await fetch(`/api/orders/${order._id}/associate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ buyerId: selectedBuyer }),
    });
    onUpdated();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
      <div className="bg-gray-900 p-6 rounded-lg w-96">
        <h2 className="text-xl font-bold mb-4">Associate Buyer</h2>
        <select
          className="w-full p-2 mb-4 bg-gray-800 rounded"
          value={selectedBuyer}
          onChange={(e) => setSelectedBuyer(e.target.value)}
        >
          <option value="">Select Buyer</option>
          {buyers.map((b) => (
            <option key={b._id} value={b._id}>
              {b.name} ({b._id})
            </option>
          ))}
        </select>
        <div className="flex justify-end space-x-2">
          <button onClick={onClose} className="px-3 py-1 bg-gray-700 rounded hover:bg-gray-600">
            Cancel
          </button>
          <button
            onClick={handleAssociate}
            className="px-3 py-1 bg-blue-600 rounded hover:bg-blue-500"
            disabled={!selectedBuyer}
          >
            Associate
          </button>
        </div>
      </div>
    </div>
  );
}
