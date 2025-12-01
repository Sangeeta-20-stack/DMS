export default function SellerDashboard({ user }) {
  return (
    <div className="p-6 text-white">
      <h1 className="text-2xl font-bold">Seller Dashboard</h1>
      <p>Welcome, {user?.name || "Seller"}.</p>
      <p>This dashboard is not implemented yet.</p>
    </div>
  );
}
