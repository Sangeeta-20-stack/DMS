import { useState, useEffect } from "react";

export default function BuyerDashboard() {
  const [activeOrder, setActiveOrder] = useState(null);
  const [orderHistory, setOrderHistory] = useState([]);
  const [items, setItems] = useState([""]);
  const [loading, setLoading] = useState(false);
  const [nextStageLoading, setNextStageLoading] = useState(false);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  // -----------------------
  // Fetch all orders
const fetchOrders = async () => {
  try {
    const [activeRes, historyRes] = await Promise.all([
     // fetch("http://localhost:5000/api/orders/active", { headers: { Authorization: `Bearer ${token}` } }),
      fetch("http://localhost:5000/api/orders/history", { headers: { Authorization: `Bearer ${token}` } }),
    ]);

    const activeData = await activeRes.json();
    const historyData = await historyRes.json();

    setActiveOrder(activeRes.ok ? activeData : null);
    setOrderHistory(historyRes.ok ? historyData : []);
  } catch (err) {
    console.error(err);
    setActiveOrder(null);
    setOrderHistory([]);
  }
};

  // -----------------------
  // Create Order
  // -----------------------
  const createOrder = async () => {
    try {
      setLoading(true);
      const res = await fetch("http://localhost:5000/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ items: items.filter((i) => i.trim() !== "") }),
      });
      const data = await res.json();
      if (res.ok) {
        alert("Order created successfully!");
        setItems([""]);
        fetchOrders();
      } else {
        alert(data.message || "Failed to create order");
      }
      setLoading(false);
    } catch (err) {
      console.error("Error creating order:", err);
      setLoading(false);
    }
  };

  // -----------------------
  // Cancel Order
  // -----------------------
  const cancelOrder = async (id) => {
    try {
      const res = await fetch(`http://localhost:5000/api/orders/${id}/cancel`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        alert("Order cancelled successfully!");
        fetchOrders();
      } else {
        alert(data.message || "Failed to cancel order");
      }
    } catch (err) {
      console.error("Error cancelling order:", err);
    }
  };

  // -----------------------
  // Move to Next Stage
  // -----------------------
  const moveNextStage = async (id) => {
    try {
      setNextStageLoading(true);
      const res = await fetch(`http://localhost:5000/api/orders/${id}/next`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        alert(`Order moved to next stage: ${data.stage}`);
        fetchOrders();
      } else {
        alert(data.message || "Failed to move order to next stage");
      }
      setNextStageLoading(false);
    } catch (err) {
      console.error("Error moving order to next stage:", err);
      setNextStageLoading(false);
    }
  };

  const stages = [
    "Order Placed",
    "Buyer Associated",
    "Processing",
    "Packed",
    "Shipped",
    "Out for Delivery",
    "Delivered",
  ];

  const renderProgress = () => {
    if (!activeOrder) return null;
    const currentIndex = stages.indexOf(activeOrder.stage);
    return (
      <div className="flex gap-2 my-4">
        {stages.map((stage, idx) => (
          <div
            key={stage}
            className={`flex-1 p-2 text-center rounded ${
              idx <= currentIndex
                ? "bg-green-500 text-white"
                : "bg-gray-700 text-gray-300"
            }`}
          >
            {stage}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="p-6 text-white bg-[#0A0A0A] min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Buyer Dashboard</h1>
      {error && (
        <p className="text-red-500 mb-4 font-semibold text-center">{error}</p>
      )}

      {/* Create Order */}
      {!activeOrder && (
        <div className="p-4 bg-gray-800 rounded-md mb-6">
          <h2 className="text-xl font-semibold mb-2">Create New Order</h2>
          {items.map((item, idx) => (
            <input
              key={idx}
              type="text"
              value={item}
              onChange={(e) => {
                const newItems = [...items];
                newItems[idx] = e.target.value;
                setItems(newItems);
              }}
              className="w-full mb-2 p-2 rounded bg-gray-700 text-white"
              placeholder={`Item ${idx + 1}`}
            />
          ))}
          <button
            onClick={() => setItems([...items, ""])}
            className="mb-2 px-3 py-1 bg-blue-500 rounded"
          >
            Add Another Item
          </button>
          <br />
          <button
            onClick={createOrder}
            disabled={loading}
            className="px-4 py-2 bg-green-500 rounded"
          >
            {loading ? "Creating..." : "Make an Order"}
          </button>
        </div>
      )}

      {/* Active Order */}
      {activeOrder && (
        <div className="p-4 bg-gray-800 rounded-md mb-6">
          <h2 className="text-xl font-semibold mb-2">Active Order</h2>
          <p>
            <strong>Order ID:</strong> {activeOrder._id}
          </p>
          <p>
            <strong>Items:</strong> {activeOrder.items.join(", ")}
          </p>
          <p>
            <strong>Stage:</strong> {activeOrder.stage}
          </p>

          {renderProgress()}

          <div className="flex gap-2 mt-2">
            <button
              onClick={() => cancelOrder(activeOrder._id)}
              className="px-3 py-1 bg-red-600 rounded"
            >
              Cancel Order
            </button>
            {activeOrder.stage !== "Delivered" && (
              <button
                onClick={() => moveNextStage(activeOrder._id)}
                disabled={nextStageLoading}
                className="px-3 py-1 bg-blue-500 rounded"
              >
                {nextStageLoading ? "Updating..." : "Move to Next Stage"}
              </button>
            )}
          </div>
        </div>
      )}

      {/* Order History */}
      <div className="p-4 bg-gray-800 rounded-md">
        <h2 className="text-xl font-semibold mb-2">Order History</h2>
        {orderHistory.length === 0 && <p>No past orders found.</p>}
        {orderHistory.map((order) => (
          <div
            key={order._id}
            className="p-2 mb-2 border border-gray-700 rounded"
          >
            <p>
              <strong>Order ID:</strong> {order._id}
            </p>
            <p>
              <strong>Items:</strong> {order.items.join(", ")}
            </p>
            <p>
              <strong>Status:</strong>{" "}
              {order.deleted ? "Cancelled" : order.stage}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
