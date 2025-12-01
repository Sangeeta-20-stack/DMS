export default function StatsCard({ title, value }) {
  return (
    <div className="bg-gray-800 p-4 rounded-lg shadow hover:shadow-lg transition">
      <h3 className="text-gray-400">{title}</h3>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
}
