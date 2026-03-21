import { useCallback, useEffect, useState } from "react";
import api from "./services/api";

import FeatureForm from "./components/FeatureForm";
import FeatureFilter from "./components/FeatureFilter";
import FeatureList from "./components/FeatureList";
import ConfirmModal from "./components/ConfirmModal";
import Toast from "./components/Toast";

function App() {
  // Feature state
  const [features, setFeatures] = useState([]);
  const [filter, setFilter] = useState("All");
  const [editingFeature, setEditingFeature] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  // Toast notifications
  const [toasts, setToasts] = useState([]);

  // Global error display
  const [error, setError] = useState("");

  // Toast helpers
  const pushToast = useCallback((t) => {
    const id = Math.random().toString(36).slice(2);
    setToasts((prev) => [...prev, { id, ...t }]);
    return id;
  }, []);
  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Fetch features (with optional filter)
  const fetchFeatures = useCallback(
    async (status = "All") => {
      setLoading(true);
      setError("");

      try {
        const params = status !== "All" ? { status } : {};
        const res = await api.get("/", { params });
        setFeatures(res.data);
      } catch (err) {
        const msg = err?.response?.data?.message || "Failed to load features";
        setError(msg);
        pushToast({ variant: "error", title: "Load failed", message: msg, timeout: 4500 });
      } finally {
        setLoading(false);
      }
    },
    [pushToast]
  );

  useEffect(() => {
    fetchFeatures(filter);
  }, [filter, fetchFeatures]);

  // Save feature (create or update)
  const handleSave = async (form) => {
    setSaving(true);
    setError("");

    try {
      if (editingFeature) {
        // Update
        const res = await api.put(`/${editingFeature.id}`, form);
        setFeatures((prev) =>
          prev.map((f) => (f.id === editingFeature.id ? res.data.data : f))
        );
        setEditingFeature(null);
        pushToast({ variant: "success", title: "Feature updated" });
      } else {
        // Create
        const res = await api.post("/", form);
        setFeatures((prev) => [res.data.data, ...prev]);
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

  // Delete feature
  const handleDelete = async () => {
    if (!deleteTarget) return;
    setError("");

    try {
      await api.delete(`/${deleteTarget.id}`);
      setFeatures((prev) => prev.filter((f) => f.id !== deleteTarget.id));
      setDeleteTarget(null);
      pushToast({ variant: "success", title: "Feature deleted" });
    } catch (err) {
      const msg = err?.response?.data?.message || "Failed to delete feature";
      setError(msg);
      pushToast({ variant: "error", title: "Delete failed", message: msg });
    }
  };

  // Change status inline
  const handleStatusChange = async (id, status) => {
    setError("");

    try {
      const res = await api.patch(`/${id}/status`, { status });
      setFeatures((prev) =>
        prev.map((f) => (f.id === id ? res.data.data : f))
      );
      pushToast({ variant: "success", title: "Status updated" });
    } catch (err) {
      const msg = err?.response?.data?.message || "Failed to update status";
      setError(msg);
      pushToast({ variant: "error", title: "Update failed", message: msg });
    }
  };

  return (
    <div className="container">
      {/* Hero */}
      <section className="hero">
        <h1>Feature Request Tracker</h1>
        <p>Manage feature requests with CRUD operations, status workflow and filters.</p>
      </section>

      {/* Global error */}
      {error && (
        <div
          className="card"
          role="alert"
          style={{
            borderLeft: "6px solid var(--danger)",
            background: "#fff7f7",
          }}
        >
          <strong style={{ display: "block", marginBottom: 6 }}>Something went wrong</strong>
          <span className="small">{error}</span>
        </div>
      )}

      {/* Main grid */}
      <div className="grid">
        {/* Form */}
        <div>
          <FeatureForm
            editingFeature={editingFeature}
            onCancelEdit={() => setEditingFeature(null)}
            onSave={handleSave}
            saving={saving}
          />
        </div>

        {/* Filter + List */}
        <div>
          <FeatureFilter filter={filter} setFilter={setFilter} />
          <div style={{ height: 16 }} />
          <FeatureList
            features={features}
            loading={loading}
            onEdit={(feature) => setEditingFeature(feature)}
            onDeleteRequest={(feature) => setDeleteTarget(feature)}
            onStatusChange={handleStatusChange}
          />
        </div>
      </div>

      {/* Delete confirmation */}
      <ConfirmModal
        open={!!deleteTarget}
        title="Delete feature request?"
        message={`This will permanently delete "${deleteTarget?.title || ""}".`}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
      />

      {/* Toast notifications */}
      <Toast toasts={toasts} remove={removeToast} />
    </div>
  );
}

export default App;