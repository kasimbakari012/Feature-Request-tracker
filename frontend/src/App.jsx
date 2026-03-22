import { useCallback, useEffect, useMemo, useState } from "react";
import api from "./services/api";

import FeatureForm from "./components/FeatureForm";
import FeatureFilter from "./components/FeatureFilter";
import FeatureList from "./components/FeatureList";
import ConfirmModal from "./components/ConfirmModal";
import Toast from "./components/Toast";

function App() {
  // STATE
  const [features, setFeatures] = useState([]);
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const [editingFeature, setEditingFeature] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [error, setError] = useState("");

  const [toasts, setToasts] = useState([]);

  // Pagination, Sorting and Dark Mode State
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortBy, setSortBy] = useState("date_desc"); // date_desc, date_asc, priority_desc, priority_asc
  const [isDarkMode, setIsDarkMode] = useState(false);

  const currentYear = new Date().getFullYear();

  // Toggle dark mode class on the document body
  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }
  }, [isDarkMode]);

  // TOAST
  const pushToast = useCallback((t) => {
    const id = Math.random().toString(36).slice(2);
    setToasts((prev) => [...prev, { id, ...t }]);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // DEBOUNCE SEARCH
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 400);

    return () => clearTimeout(timer);
  }, [search]);

  // Reset to page 1 whenever filters, search, or sort changes
  useEffect(() => {
    setPage(1);
  }, [filter, debouncedSearch, sortBy]);

  // FETCH
  const fetchFeatures = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const params = {
        page,
        limit: 10,
      };

      if (filter !== "All") params.status = filter;
      if (debouncedSearch) params.search = debouncedSearch;

      if (sortBy) {
        const [sortField, sortOrder] = sortBy.split("_");
        params.sortBy = sortField === "date" ? "createdAt" : sortField;
        params.sortOrder = sortOrder;
      }

      const res = await api.get("/", { params });

      const fetchedData = Array.isArray(res.data)
        ? res.data
        : res.data.data || res.data.features || [];

      setFeatures(fetchedData);
      setTotalPages(res.data.totalPages || res.data.meta?.totalPages || 1);
    } catch (err) {
      const msg = err?.response?.data?.message || "Failed to load features";
      setError(msg);
      pushToast({ variant: "error", title: "Load failed", message: msg });
    } finally {
      setLoading(false);
    }
  }, [filter, debouncedSearch, page, sortBy, pushToast]);

  useEffect(() => {
    fetchFeatures();
  }, [fetchFeatures]);

  // STATS
  const stats = useMemo(() => {
    const total = features.length;

    const status = {
      Open: 0,
      "In Progress": 0,
      Completed: 0,
    };

    const priority = {
      Low: 0,
      Medium: 0,
      High: 0,
    };

    features.forEach((f) => {
      if (status[f.status] !== undefined) status[f.status]++;
      if (priority[f.priority] !== undefined) priority[f.priority]++;
    });

    return { total, status, priority };
  }, [features]);

  // SAVE
  const handleSave = async (form) => {
    setSaving(true);
    setError("");

    try {
      if (editingFeature) {
        const res = await api.put(`/${editingFeature.id}`, form);

        setFeatures((prev) =>
          prev.map((f) =>
            f.id === editingFeature.id ? res.data.data || res.data : f
          )
        );

        setEditingFeature(null);
        pushToast({ variant: "success", title: "Feature updated" });
      } else {
        const res = await api.post("/", form);

        setFeatures((prev) => [res.data.data || res.data, ...prev]);

        pushToast({ variant: "success", title: "Feature added" });
      }
    } catch (err) {
      const msg = err?.response?.data?.message || "Failed to save feature";
      setError(msg);
      pushToast({ variant: "error", title: "Save failed", message: msg });
    } finally {
      setSaving(false);
    }
  };

  // DELETE
  const handleDelete = async () => {
    if (!deleteTarget) return;

    try {
      await api.delete(`/${deleteTarget.id}`);

      setFeatures((prev) => prev.filter((f) => f.id !== deleteTarget.id));

      setDeleteTarget(null);
      pushToast({ variant: "success", title: "Feature deleted" });
    } catch (err) {
      const msg = err?.response?.data?.message || "Delete failed";
      setError(msg);
      pushToast({ variant: "error", title: "Delete failed", message: msg });
    }
  };

  // STATUS
  const handleStatusChange = async (id, status) => {
    try {
      const res = await api.patch(`/${id}/status`, { status });

      setFeatures((prev) =>
        prev.map((f) => (f.id === id ? res.data.data || res.data : f))
      );

      pushToast({ variant: "success", title: "Status updated" });
    } catch (err) {
      const msg = err?.response?.data?.message || "Update failed";
      setError(msg);
      pushToast({ variant: "error", title: "Update failed", message: msg });
    }
  };

  return (
    <div className="container">
      {/* HERO & DARK MODE TOGGLE */}
      <section
        className="hero"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div>
          <h1>Feature Request Tracker</h1>
          <p>Manage requests with search, filters and real-time updates.</p>
        </div>

        <button
          onClick={() => setIsDarkMode(!isDarkMode)}
          className="btn"
          style={{ padding: "8px 16px", cursor: "pointer" }}
        >
          {isDarkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
        </button>
      </section>

      {/* STATS DASHBOARD */}
      <section
        className="grid"
        style={{ gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))" }}
      >
        <div className="card">
          <h3>Total </h3>
          <strong>{stats.total}</strong>
        </div>
        <div className="card">
          <h3>Open</h3>
          <strong>{stats.status.Open}</strong>
        </div>
        <div className="card">
          <h3>In Progress</h3>
          <strong>{stats.status["In Progress"]}</strong>
        </div>
        <div className="card">
          <h3>Completed</h3>
          <strong>{stats.status.Completed}</strong>
        </div>
      </section>

      {/* SEARCH AND SORT BAR */}
      <div
        className="card grid"
        style={{
          marginTop: 16,
          gridTemplateColumns: "1fr auto",
          gap: "16px",
          alignItems: "center",
        }}
      >
        <input
          type="text"
          className="input"
          placeholder="Search features (title or description)..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ width: "100%" }}
        />

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="input"
          style={{ padding: "8px" }}
        >
          <option value="date_desc">Newest First</option>
          <option value="date_asc">Oldest First</option>
          <option value="priority_desc">Highest Priority First</option>
          <option value="priority_asc">Lowest Priority First</option>
        </select>
      </div>

      {/* ERROR */}
      {error && (
        <div className="card" style={{ borderLeft: "6px solid red", marginTop: 16 }}>
          {error}
        </div>
      )}

      {/* MAIN GRID */}
      <div className="grid" style={{ marginTop: 16 }}>
        {/* FORM */}
        <FeatureForm
          editingFeature={editingFeature}
          onCancelEdit={() => setEditingFeature(null)}
          onSave={handleSave}
          saving={saving}
        />

        {/* LIST & PAGINATION */}
        <div>
          <FeatureFilter filter={filter} setFilter={setFilter} />

          <FeatureList
            features={features}
            loading={loading}
            onEdit={setEditingFeature}
            onDeleteRequest={setDeleteTarget}
            onStatusChange={handleStatusChange}
          />

          {/* Server-Side Pagination Controls */}
          {totalPages > 1 && (
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginTop: "16px",
                padding: "16px",
                background: "var(--card-bg, #fff)",
                borderRadius: "8px",
              }}
            >
              <button
                className="btn"
                disabled={page === 1 || loading}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                Previous
              </button>
              <span>
                Page {page} of {totalPages}
              </span>
              <button
                className="btn"
                disabled={page === totalPages || loading}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>

      {/* FOOTER */}
      <footer
        style={{
          marginTop: "32px",
          padding: "18px 16px",
          textAlign: "center",
          borderTop: "1px solid rgba(0,0,0,0.08)",
          fontSize: "14px",
          opacity: 0.85,
        }}
      >
        <strong>Feature Request Tracker</strong> &copy; {currentYear} All Rights Reserved
      </footer>

      {/* MODAL */}
      <ConfirmModal
        open={!!deleteTarget}
        title="Delete feature?"
        message={`Delete "${deleteTarget?.title}" permanently`}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
      />

      {/* TOAST */}
      <Toast toasts={toasts} remove={removeToast} />
    </div>
  );
}

export default App;
