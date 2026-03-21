export default function EmptyState({
  title = "No requests yet",
  message = "Create your first feature request to get started.",
}) {
  return (
    <div className="empty" role="status" aria-live="polite">
      <h3 style={{ margin: 0, fontSize: "1rem" }}>{title}</h3>
      <p style={{ margin: "8px 0 0" }}>{message}</p>
    </div>
  );
}