export default function FeatureFilter({ filter, setFilter }) {
  const options = ["All", "Open", "In Progress", "Completed"];

  return (
    <div className="card" role="group" aria-label="Filter by status">
      <div className="toolbar" style={{ marginBottom: 0 }}>
        <div>
          <h2 className="card-title">Filters</h2>
          <p className="card-subtitle">Quickly narrow down by status.</p>
        </div>
      </div>

      <div className="pills" style={{ marginTop: 6 }}>
        {options.map((opt) => (
          <button
            key={opt}
            className={`pill ${filter === opt ? "active" : ""}`}
            onClick={() => setFilter(opt)}
            aria-pressed={filter === opt}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}