import { useEffect, useState } from "react";

export default function AdminDashboard() {
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState({
    totalOrders: 0,
    ordersPerStage: {},
    avgDeliveryTime: 0,
  });

  // ---------------------------------------------
  // BACKEND URL (IMPORTANT)
  // ---------------------------------------------
  const API_BASE = "http://localhost:5000"; // change if deployed

  // ---------------------------------------------
  // Fetch All Orders
  // ---------------------------------------------
  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`${API_BASE}/api/orders`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const text = await res.text();
        console.error("ADMIN FETCH ERROR:", text);
        return;
      }

      const data = await res.json();
      setOrders(data);
      calculateStats(data);
    } catch (err) {
      console.error("FETCH ORDERS FAILED", err);
    }
  };

  // ---------------------------------------------
  // Stats
  // ---------------------------------------------
  const calculateStats = (ordersList) => {
    const totalOrders = ordersList.length;
    const ordersPerStage = {};
    let totalTime = 0;

    ordersList.forEach((o) => {
      ordersPerStage[o.stage] = (ordersPerStage[o.stage] || 0) + 1;

      if (o.stage === "Delivered" && o.timestamps) {
        totalTime +=
          new Date(o.timestamps.Delivered) -
          new Date(o.timestamps["Order Placed"]);
      }
    });

    const avgDeliveryTime =
      totalOrders > 0 ? (totalTime / totalOrders / 3600000).toFixed(2) : 0;

    setStats({ totalOrders, ordersPerStage, avgDeliveryTime });
  };

  // ---------------------------------------------
  // useEffect (Correct + Clean)
  // ---------------------------------------------
  useEffect(() => {
    fetchOrders();
  }, []);

  // ---------------------------------------------
  // Associate Buyer
  // ---------------------------------------------
  const associateBuyer = async (orderId) => {
    try {
      const token = localStorage.getItem("token");

      await fetch(`${API_BASE}/api/orders/${orderId}/associate`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      fetchOrders();
    } catch (err) {
      console.error("ASSOCIATE BUYER FAILED", err);
    }
  };

  // ---------------------------------------------
  // View Order Details
  // ---------------------------------------------
  const viewDetails = async (orderId) => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`${API_BASE}/api/orders/${orderId}/details`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      alert(JSON.stringify(data, null, 2));
    } catch (err) {
      console.error("VIEW DETAILS FAILED", err);
    }
  };

  // ---------------------------------------------
  // Delete Order
  // ---------------------------------------------
  const deleteOrder = async (orderId) => {
    try {
      const token = localStorage.getItem("token");

      await fetch(`${API_BASE}/api/orders/${orderId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      fetchOrders();
    } catch (err) {
      console.error("DELETE FAILED", err);
    }
  };

  // ---------------------------------------------
  // UI
  // ---------------------------------------------
  return (
    <div className="p-6 space-y-6 text-white">

      <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-gray-800 rounded-md">
          Total Orders: {stats.totalOrders}
        </div>

        {Object.entries(stats.ordersPerStage).map(([stage, count]) => (
          <div key={stage} className="p-4 bg-gray-800 rounded-md">
            {stage}: {count}
          </div>
        ))}

        <div className="p-4 bg-gray-800 rounded-md">
          Avg Delivery Time: {stats.avgDeliveryTime} hrs
        </div>
      </div>

      {/* ORDERS TABLE */}
      <table className="w-full bg-gray-900 border border-gray-700 rounded-md">
        <thead>
          <tr className="bg-gray-800 text-left">
            <th className="p-3">Order ID</th>
            <th className="p-3">Stage</th>
            <th className="p-3">Buyer</th>
            <th className="p-3">Actions</th>
          </tr>
        </thead>

        <tbody>
          {orders.length === 0 && (
            <tr>
              <td colSpan="4" className="text-center p-4 text-gray-400">
                No Orders Found
              </td>
            </tr>
          )}

          {orders.map((order) => (
            <tr key={order._id} className="border-t border-gray-700">
              <td className="p-3">{order._id}</td>
              <td className="p-3">{order.stage}</td>
              <td className="p-3">{order.buyer?.name || "Not Assigned"}</td>

              <td className="p-3 space-x-2">
                <button
                  className="px-3 py-1 bg-blue-500 text-white rounded"
                  onClick={() => associateBuyer(order._id)}
                >
                  Associate Buyer
                </button>

                <button
                  className="px-3 py-1 bg-green-500 text-white rounded"
                  onClick={() => viewDetails(order._id)}
                >
                  View Details
                </button>

                <button
                  className="px-3 py-1 bg-red-600 text-white rounded"
                  onClick={() => deleteOrder(order._id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

    </div>
  );
}
