export default function OrdersTable({ orders, onAssociateBuyer, onViewDetails }) {
  return (
    <div className="overflow-x-auto bg-gray-800 p-4 rounded-lg shadow">
      <table className="min-w-full text-left">
        <thead>
          <tr className="border-b border-gray-700">
            <th className="px-4 py-2">Order ID</th>
            <th className="px-4 py-2">Buyer</th>
            <th className="px-4 py-2">Seller</th>
            <th className="px-4 py-2">Items</th>
            <th className="px-4 py-2">Stage</th>
            <th className="px-4 py-2">Created At</th>
            <th className="px-4 py-2">Updated At</th>
            <th className="px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order._id} className="border-b border-gray-700 hover:bg-gray-700">
              <td className="px-4 py-2">{order._id}</td>
              <td className="px-4 py-2">{order.buyer?.name || "Unassigned"}</td>
              <td className="px-4 py-2">{order.seller?.name || "Unassigned"}</td>
              <td className="px-4 py-2">{order.items.join(", ")}</td>
              <td className="px-4 py-2">{order.stage}</td>
              <td className="px-4 py-2">{new Date(order.createdAt).toLocaleString()}</td>
              <td className="px-4 py-2">{new Date(order.updatedAt).toLocaleString()}</td>
              <td className="px-4 py-2 space-x-2">
                {order.stage === "Order Placed" && (
                  <button
                    onClick={() => onAssociateBuyer(order)}
                    className="bg-blue-600 px-2 py-1 rounded hover:bg-blue-500"
                  >
                    Associate Buyer
                  </button>
                )}
                <button
                  onClick={() => onViewDetails(order)}
                  className="bg-green-600 px-2 py-1 rounded hover:bg-green-500"
                >
                  View Details
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
