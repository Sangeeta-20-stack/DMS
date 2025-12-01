export default function ViewDetailsModal({ order, onClose }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
      <div className="bg-gray-900 p-6 rounded-lg w-96 overflow-y-auto max-h-[80vh]">
        <h2 className="text-xl font-bold mb-4">Order Details</h2>
        <p><strong>Order ID:</strong> {order._id}</p>
        <p><strong>Stage:</strong> {order.stage}</p>
        <p><strong>Buyer:</strong> {order.buyer?.name || "Unassigned"}</p>
        <p><strong>Seller:</strong> {order.seller?.name || "Unassigned"}</p>
        <p><strong>Items:</strong> {order.items.join(", ")}</p>
        <p><strong>Created At:</strong> {new Date(order.createdAt).toLocaleString()}</p>
        <p><strong>Updated At:</strong> {new Date(order.updatedAt).toLocaleString()}</p>

        <h3 className="mt-4 font-semibold">Stage Durations</h3>
        <ul className="list-disc list-inside">
          {order.timestamps &&
            Object.entries(order.timestamps).map(([stage, time]) => (
              <li key={stage}>
                {stage}: {new Date(time).toLocaleString()}
              </li>
            ))}
        </ul>

        <h3 className="mt-4 font-semibold">Action Log</h3>
        <ul className="list-disc list-inside">
          {order.logs &&
            order.logs.map((log, idx) => (
              <li key={idx}>
                [{new Date(log.time).toLocaleString()}] {log.actor}: {log.action}
              </li>
            ))}
        </ul>

        <div className="flex justify-end mt-4">
          <button onClick={onClose} className="px-3 py-1 bg-gray-700 rounded hover:bg-gray-600">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
