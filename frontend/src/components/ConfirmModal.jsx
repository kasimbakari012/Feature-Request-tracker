export default function ConfirmModal({
  open,
  title,
  message,
  onCancel,
  onConfirm,
}) {
  if (!open) return null;

  return (
    <div
      className="overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-title"
    >
      <div className="modal">
        <h3 id="confirm-title">{title}</h3>
        <p>{message}</p>

        <div className="modal-actions">
          <button type="button" className="btn btn-ghost" onClick={onCancel} autoFocus>
            Cancel
          </button>
          <button type="button" className="btn btn-danger" onClick={onConfirm}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}