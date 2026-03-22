export default function Topbar({ search, setSearch }) {
  return (
    <header className="topbar" id="dashboard">
      <div>
        <h1>Dashboard</h1>
        <p>Manage requests, statuses, and progress in one place.</p>
      </div>

      <div className="topbar-actions">
        <label className="topbar-search">
          <span className="sr-only">Search feature requests</span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search requests..."
          />
        </label>

        <div className="profile-chip" title="Admin profile">
          <span>KB</span>
        </div>
      </div>
    </header>
  );
}