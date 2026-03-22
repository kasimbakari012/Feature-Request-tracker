export default function StatCard({ title, value, tone = "blue" }) {
  const toneMap = {
    blue: "#3b82f6",
    red: "#ef4444",
    yellow: "#facc15",
    green: "#22c55e",
  };

  return (
    <div className="card stat-card">
      <div className="stat-content">
        <span className="stat-title">{title}</span>
        <span className="stat-value" style={{ color: toneMap[tone] }}>
          {value}
        </span>
      </div>
    </div>
  );
}