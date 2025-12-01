import { useEffect, useState } from "react";
import StatsCard from "./StatsCard";
import OrdersTable from "./OrdersTable";
import AssociateBuyerModal from "./AssociateBuyerModal";
import ViewDetailsModal from "./ViewDetailsModal";

export default function AdminDashboard() {
  const [orders, setOrders] = useState([]);
  const [showAssociateModal, setShowAssociateModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Example stats data
  const [stats, setStats] = useState({
    totalOrders: 0,
    ordersPerStage: {},
    avgDeliveryTime: 0,
  });

  // Fetch orders from backend
  const fetchOrders = async () => {
    try {
      const res = await fetch("/api/orders"); // replace with your backend route
      const data = await res.json();
      setOrders(data);
      calculateStats(data);
    } catch (err) {
      console.error(err);
    }
  };

  const calculateStats = (orders) => {
    const totalOrders = orders.length;
    const ordersPerStage = {};
    let totalTime = 0;
    orders.forEach((o) => {
      ordersPerStage[o.stage] = (ordersPerStage[o.stage] || 0) + 1;
      if (o.stage === "Delivered" && o.timestamps) {
        totalTime += new Date(o.timestamps.Delivered) - new Date(o.timestamps["Order Placed"]);
      }
    });
    const avgDeliveryTime = totalOrders ? totalTime / totalOrders / 3600000 : 0; // in hours
    setStats({ totalOrders, ordersPerStage, avgDeliveryTime: avgDeliveryTime.toFixed(2) });
  };

  useEffect(() => {
  const fetchOrders = async () => {
    try {
      const res = await fetch("/api/orders");
      const data = await res.json();
      setOrders(data);
      calculateStats(data);
    } catch (err) {
      console.error(err);
    }
  };

  fetchOrders();
}, []);


  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatsCard title="Total Orders" value={stats.totalOrders} />
        {Object.entries(stats.ordersPerStage).map(([stage, count]) => (
          <StatsCard key={stage} title={`Orders: ${stage}`} value={count} />
        ))}
        <StatsCard title="Avg Delivery Time (hrs)" value={stats.avgDeliveryTime} />
      </div>

      {/* Orders Table */}
      <OrdersTable
        orders={orders}
        onAssociateBuyer={(order) => {
          setSelectedOrder(order);
          setShowAssociateModal(true);
        }}
        onViewDetails={(order) => {
          setSelectedOrder(order);
          setShowDetailsModal(true);
        }}
      />

      {showAssociateModal && selectedOrder && (
        <AssociateBuyerModal
          order={selectedOrder}
          onClose={() => setShowAssociateModal(false)}
          onUpdated={fetchOrders}
        />
      )}

      {showDetailsModal && selectedOrder && (
        <ViewDetailsModal order={selectedOrder} onClose={() => setShowDetailsModal(false)} />
      )}
    </div>
  );
}
