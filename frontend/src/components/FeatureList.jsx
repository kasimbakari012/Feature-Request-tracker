import { 
  Pencil, 
  Trash2, 
  Clock, 
  CheckCircle2, 
  CircleDot, 
  AlertTriangle, 
  ChevronDown, 
  ChevronUp,
  Inbox
} from "lucide-react";

function PriorityBadge({ priority }) {
  const map = {
    Low: { cls: "badge-low", icon: <ChevronDown size={14} />, color: "#64748b" },
    Medium: { cls: "badge-medium", icon: <ChevronUp size={14} />, color: "#2563eb" },
    High: { cls: "badge-high", icon: <AlertTriangle size={14} />, color: "#dc2626" },
  };
  const { cls, icon, color } = map[priority] || map.Low;
  
  return (
    <span className={`badge ${cls}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
      <span style={{ color }}>{icon}</span>
      {priority}
    </span>
  );
}

function StatusBadge({ status }) {
  const map = {
    Open: { cls: "badge-open", icon: <CircleDot size={14} />, color: "#ef4444" },
    "In Progress": { cls: "badge-progress", icon: <Clock size={14} />, color: "#f59e0b" },
    Completed: { cls: "badge-completed", icon: <CheckCircle2 size={14} />, color: "#16a34a" },
  };
  const { cls, icon, color } = map[status] || map.Open;

  return (
    <span className={`badge ${cls}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
      <span style={{ color }}>{icon}</span>
      {status}
    </span>
  );
}

export default function FeatureList({
  features,
  loading,
  onEdit,
  onDeleteRequest,
  onStatusChange,
}) {
  
  // --- Loading State (Skeleton) ---
  if (loading) {
    return (
      <div className="card shadow-sm">
        <div className="toolbar border-b pb-4 mb-4">
          <h2 className="card-title text-xl font-bold">Feature Requests</h2>
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse bg-gray-50 p-4 rounded-lg">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <section className="card shadow-sm">
      <div className="toolbar flex justify-between items-center border-b pb-4 mb-6">
        <div>
          <h2 className="card-title text-xl font-bold text-gray-800">Requests</h2>
          <p className="card-subtitle text-sm text-gray-500">Review and manage incoming requests.</p>
        </div>
        <span className="text-xs font-medium px-2 py-1 bg-gray-100 rounded-full text-gray-600">
          Total: {features?.length || 0}
        </span>
      </div>

      {(!features || features.length === 0) ? (
        <div className="empty py-12 text-center flex flex-col items-center justify-center border-2 border-dashed border-gray-100 rounded-xl">
          <Inbox size={48} className="text-gray-300 mb-4" />
          <h3 className="text-gray-900 font-semibold">No matching requests</h3>
          <p className="text-gray-500 text-sm mt-1">Try adjusting your filter or adding a new feature.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {features.map((f) => (
            <article 
              key={f.id} 
              className="item hover:border-blue-200 transition-colors p-5 border border-gray-200 rounded-xl bg-white" 
              aria-labelledby={`feat-${f.id}-title`}
            >
              <div className="item-top flex justify-between items-start mb-3">
                <h3 id={`feat-${f.id}-title`} className="text-lg font-semibold text-gray-900">
                  {f.title}
                </h3>
                <div className="flex gap-2">
                  <PriorityBadge priority={f.priority} />
                  <StatusBadge status={f.status} />
                </div>
              </div>

              {!!f.description && (
                <p className="text-gray-600 text-sm leading-relaxed mb-4">
                  {f.description}
                </p>
              )}

              <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-gray-50">
                <div className="text-xs text-gray-400 font-medium">
                  ID: <span className="text-gray-600">#{f.id}</span> 
                  <span className="mx-2">•</span> 
                  Updated: <span className="text-gray-600">
                    {new Date(f.updatedAt || f.createdAt).toLocaleDateString(undefined, {
                      month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                    })}
                  </span>
                </div>
                
                <div className="flex items-center gap-2">
                  <select
                    className="select-sm bg-gray-50 border border-gray-200 rounded-md text-sm p-1 focus:ring-2 focus:ring-blue-500"
                    value={f.status}
                    onChange={(e) => onStatusChange(f.id, e.target.value)}
                  >
                    <option>Open</option>
                    <option>In Progress</option>
                    <option>Completed</option>
                  </select>

                  <button 
                    className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" 
                    onClick={() => onEdit(f)}
                    title="Edit Request"
                  >
                    <Pencil size={18} />
                  </button>

                  <button 
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" 
                    onClick={() => onDeleteRequest(f)}
                    title="Delete Request"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}