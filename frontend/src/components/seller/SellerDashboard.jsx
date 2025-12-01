import { useState, useEffect } from "react";

export default function SellerDashboard() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [nextStageLoadingId, setNextStageLoadingId] = useState(null);

  const token = localStorage.getItem("token");

  // Fetch seller's orders
  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/orders/seller/orders", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to fetch orders");
      setOrders(data);
    } catch (err) {
      console.error("Error fetching orders:", err);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 5000); // refresh every 5 seconds
    return () => clearInterval(interval);
  }, []);

  // Move order to next stage
  const moveNextStage = async (id) => {
    try {
      setNextStageLoadingId(id);
      const res = await fetch(`http://localhost:5000/api/orders/seller/orders/${id}/advance`, {
        method: "PATCH", // PATCH matches backend route
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to move order");
      fetchOrders();
    } catch (err) {
      console.error(err);
      alert(err.message);
    } finally {
      setNextStageLoadingId(null);
    }
  };

  return (
    <div className="p-6 text-white bg-[#0A0A0A] min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Seller Dashboard</h1>

      {loading && <p>Loading orders...</p>}
      {!loading && orders.length === 0 && <p>No orders assigned yet.</p>}

      {orders.map((order) => (
        <div key={order._id} className="p-4 mb-4 bg-gray-800 rounded">
          <p><strong>Order ID:</strong> {order._id}</p>
          <p>
            <strong>Buyer:</strong>{" "}
            {order.buyer ? `${order.buyer.name} (${order.buyer.email})` : "Not associated"}
          </p>
          <p><strong>Items:</strong> {order.items.join(", ")}</p>
          <p><strong>Stage:</strong> {order.stage}</p>

          <button
            onClick={() => moveNextStage(order._id)}
            disabled={nextStageLoadingId === order._id || order.stage === "Delivered"}
            className="mt-2 px-3 py-1 bg-blue-500 rounded hover:bg-blue-600 transition"
          >
            {nextStageLoadingId === order._id ? "Updating..." : "Move to Next Stage"}
          </button>
        </div>
      ))}
    </div>
  );
}
