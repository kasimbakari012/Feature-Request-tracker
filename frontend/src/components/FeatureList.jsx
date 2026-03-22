import {
  Pencil,
  Trash2,
  Clock,
  CheckCircle2,
  CircleDot,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Inbox,
} from "lucide-react";

function PriorityBadge({ priority }) {
  const map = {
    Low: {
      cls: "badge-low",
      icon: <ChevronDown size={14} />,
      color: "#64748b",
    },
    Medium: {
      cls: "badge-medium",
      icon: <ChevronUp size={14} />,
      color: "#2563eb",
    },
    High: {
      cls: "badge-high",
      icon: <AlertTriangle size={14} />,
      color: "#dc2626",
    },
  };

  const current = map[priority] || map.Low;

  return (
    <span
      className={`badge ${current.cls}`}
      title={`Priority: ${priority}`}
      aria-label={`Priority ${priority}`}
    >
      <span className="badge-icon" style={{ color: current.color }}>
        {current.icon}
      </span>
      <span>{priority}</span>
    </span>
  );
}

function StatusBadge({ status }) {
  const map = {
    Open: {
      cls: "badge-open",
      icon: <CircleDot size={14} />,
      color: "#ef4444",
    },
    "In Progress": {
      cls: "badge-progress",
      icon: <Clock size={14} />,
      color: "#f59e0b",
    },
    Completed: {
      cls: "badge-completed",
      icon: <CheckCircle2 size={14} />,
      color: "#16a34a",
    },
  };

  const current = map[status] || map.Open;

  return (
    <span
      className={`badge ${current.cls}`}
      title={`Status: ${status}`}
      aria-label={`Status ${status}`}
    >
      <span className="badge-icon" style={{ color: current.color }}>
        {current.icon}
      </span>
      <span>{status}</span>
    </span>
  );
}

function FeatureSkeleton() {
  return (
    <div className="feature-skeleton-card" aria-hidden="true">
      <div className="skeleton skeleton-title" />
      <div className="skeleton-row">
        <span className="skeleton skeleton-badge" />
        <span className="skeleton skeleton-badge short" />
      </div>
      <div className="skeleton skeleton-line full" />
      <div className="skeleton skeleton-line medium" />
      <div className="skeleton-footer">
        <span className="skeleton skeleton-line small" />
        <span className="skeleton skeleton-button" />
      </div>
    </div>
  );
}

export default function FeatureList({
  features,
  loading,
  onEdit,
  onDeleteRequest,
  onStatusChange,
}) {
  const total = features?.length || 0;

  if (loading) {
    return (
      <section className="card feature-list-card">
        <div className="section-header">
          <div>
            <h2 className="card-title">Feature Requests</h2>
            <p className="card-subtitle">Loading your feature requests...</p>
          </div>
          <span className="count-pill">Loading...</span>
        </div>

        <div className="skeleton-list">
          {Array.from({ length: 4 }).map((_, i) => (
            <FeatureSkeleton key={i} />
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="card feature-list-card" id="feature-list">
      <div className="section-header">
        <div>
          <h2 className="card-title">Requests</h2>
          <p className="card-subtitle">Review and manage incoming requests.</p>
        </div>

        <span className="count-pill">Total: {total}</span>
      </div>

      {!features || features.length === 0 ? (
        <div className="empty-state">
          <Inbox size={54} className="empty-icon" />
          <h3>No matching requests</h3>
          <p>Try adjusting your filter or adding a new feature request.</p>
        </div>
      ) : (
        <div className="feature-grid">
          {features.map((f) => {
            const updatedAt = f.updatedAt || f.updated_at || f.createdAt || f.created_at;
            const formattedDate = updatedAt
              ? new Date(updatedAt).toLocaleString(undefined, {
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : "-";

            return (
              <article
                key={f.id}
                className="feature-item"
                aria-labelledby={`feat-${f.id}-title`}
              >
                <div className="feature-top">
                  <div className="feature-title-wrap">
                    <h3 id={`feat-${f.id}-title`} className="feature-title">
                      {f.title}
                    </h3>

                    <div className="badge-row">
                      <PriorityBadge priority={f.priority} />
                      <StatusBadge status={f.status} />
                    </div>
                  </div>
                </div>

                {f.description ? (
                  <p className="feature-description">{f.description}</p>
                ) : (
                  <p className="feature-description muted">
                    No description provided.
                  </p>
                )}

                <div className="feature-footer">
                  <div className="feature-meta">
                    <span>
                      ID: <strong>#{f.id}</strong>
                    </span>
                    <span className="dot-separator">•</span>
                    <span>
                      Updated: <strong>{formattedDate}</strong>
                    </span>
                  </div>

                  <div className="feature-actions">
                    <select
                      className="status-select"
                      value={f.status}
                      onChange={(e) => onStatusChange(f.id, e.target.value)}
                      aria-label={`Change status for ${f.title}`}
                    >
                      <option>Open</option>
                      <option>In Progress</option>
                      <option>Completed</option>
                    </select>

                    <button
                      type="button"
                      className="icon-btn edit"
                      onClick={() => onEdit(f)}
                      title="Edit request"
                      aria-label={`Edit ${f.title}`}
                    >
                      <Pencil size={18} />
                    </button>

                    <button
                      type="button"
                      className="icon-btn delete"
                      onClick={() => onDeleteRequest(f)}
                      title="Delete request"
                      aria-label={`Delete ${f.title}`}
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}