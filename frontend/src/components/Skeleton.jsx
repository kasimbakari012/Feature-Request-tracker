export function ListSkeleton({ count = 4 }) {
  return (
    <div className="list" aria-hidden="true">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="item">
          <div className="item-top">
            <span className="skeleton skeleton-title" />
            <span className="skeleton skeleton-badge" />
          </div>

          <div style={{ marginTop: 10 }}>
            <span className="skeleton" style={{ width: "90%" }} />
          </div>

          <div style={{ marginTop: 8 }}>
            <span className="skeleton" style={{ width: "70%" }} />
          </div>

          <div className="item-footer" style={{ marginTop: 14 }}>
            <span className="skeleton" style={{ width: "40%" }} />
            <span className="skeleton" style={{ width: 120 }} />
          </div>
        </div>
      ))}
    </div>
  );
}