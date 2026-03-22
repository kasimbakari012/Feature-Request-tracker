export default function Sidebar({ open, setOpen, active, onNavigate }) {
  const navItems = [
    { id: "dashboard", label: "Dashboard" },
    { id: "create", label: "Add Feature" },
    { id: "features", label: "Feature List" },
  ];

  return (
    <>
      {/* Overlay (mobile) */}
      {open && (
        <div
          className="sidebar-overlay"
          onClick={() => setOpen(false)}
        />
      )}

      <aside className={`sidebar ${open ? "open" : ""}`}>
        <div className="sidebar-header">
          <h2>Feature Tracker</h2>
          <button
            className="btn btn-ghost"
            onClick={() => setOpen(false)}
          >
            ✕
          </button>
        </div>

        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <button
              key={item.id}
              className={`nav-item ${
                active === item.id ? "active" : ""
              }`}
              onClick={() => onNavigate(item.id)}
            >
              {item.label}
            </button>
          ))}
        </nav>
      </aside>
    </>
  );
}