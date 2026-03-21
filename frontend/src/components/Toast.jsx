import { useEffect } from "react";

export default function Toast({ toasts, remove }) {
  useEffect(() => {
    if (!toasts.length) return;

    const timers = toasts.map((t) =>
      setTimeout(() => remove(t.id), t.timeout ?? 3500)
    );

    return () => timers.forEach(clearTimeout);
  }, [toasts, remove]);

  if (!toasts.length) return null;

  return (
    <div className="toast-wrap" role="status" aria-live="polite">
      {toasts.map((t) => (
        <div key={t.id} className={`toast ${t.variant || "success"}`}>
          <div>
            <div className="title">{t.title}</div>
            {t.message && <div className="msg">{t.message}</div>}
          </div>

          <button
            type="button"
            className="btn btn-ghost"
            onClick={() => remove(t.id)}
            aria-label="Dismiss notification"
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  );
}