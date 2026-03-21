import { useEffect, useMemo, useState } from "react";

const initialForm = {
  title: "",
  description: "",
  priority: "Low",
  status: "Open",
};

export default function FeatureForm({
  editingFeature,
  onCancelEdit,
  onSave,
  saving,
}) {
  const [form, setForm] = useState(() => (editingFeature ? {
    title: editingFeature.title || "",
    description: editingFeature.description || "",
    priority: editingFeature.priority || "Low",
    status: editingFeature.status || "Open",
  } : initialForm));

  const [touched, setTouched] = useState({});
  const titleMax = 120;
  const descMax = 2000;

  useEffect(() => {
    if (editingFeature) {
      setForm({
        title: editingFeature.title || "",
        description: editingFeature.description || "",
        priority: editingFeature.priority || "Low",
        status: editingFeature.status || "Open",
      });
    } else {
      setForm(initialForm);
    }
    setTouched({});
  }, [editingFeature]);

  const errors = useMemo(() => {
    const e = {};
    if (!form.title.trim()) e.title = "Title is required.";
    if (form.title.length > titleMax) e.title = `Max ${titleMax} characters.`;
    
    if (!form.description.trim()) e.description = "Description is required.";
    if (form.description.length > descMax) e.description = `Max ${descMax} characters.`;
    
    if (!["Low", "Medium", "High"].includes(form.priority)) {
      e.priority = "Invalid priority.";
    }
    if (!["Open", "In Progress", "Completed"].includes(form.status)) {
      e.status = "Invalid status.";
    }
    
    return e;
  }, [form.title, form.description, form.priority, form.status]);

  const isValid = Object.keys(errors).length === 0;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((t) => ({ ...t, [name]: true }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isValid) {
      setTouched({ title: true, description: true, priority: true, status: true });
      return;
    }
    onSave({
      title: form.title.trim(),
      description: form.description.trim(),
      priority: form.priority,
      status: form.status,
    });
  };

  return (
    <section className="card" aria-labelledby="form-title">
      <div className="toolbar">
        <div>
          <h2 id="form-title" className="card-title">
            {editingFeature ? "Edit Feature" : "Add Feature"}
          </h2>
          <p className="card-subtitle">
            {editingFeature ? "Update the selected request." : "Create a new feature request."}
          </p>
        </div>

        {editingFeature && (
          <button
            type="button"
            className="btn btn-ghost"
            onClick={onCancelEdit}
            aria-label="Cancel editing"
          >
            Cancel
          </button>
        )}
      </div>

      <form className="form" onSubmit={handleSubmit} noValidate>
        <div className="field">
          <label className="label" htmlFor="title">Title</label>
          <input
            id="title"
            className="input"
            name="title"
            value={form.title}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Short, descriptive title"
            maxLength={titleMax}
            aria-invalid={!!errors.title && touched.title}
            aria-describedby="title-help"
          />
          <div className="helper" id="title-help">
            <span className={errors.title && touched.title ? "error-text" : ""}>
              {touched.title && errors.title ? errors.title : "E.g., Allow exporting reports"}
            </span>
            <span>{form.title.length}/{titleMax}</span>
          </div>
        </div>

        <div className="field">
          <label className="label" htmlFor="description">Description</label>
          <textarea
            id="description"
            className="textarea"
            name="description"
            value={form.description}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Describe the feature briefly"
            rows={6}
            maxLength={descMax}
            aria-invalid={!!errors.description && touched.description}
            aria-describedby="desc-help"
          />
          <div className="helper" id="desc-help">
            <span className={errors.description && touched.description ? "error-text" : ""}>
              {touched.description && errors.description
                ? errors.description
                : "Tip: Include acceptance criteria or a simple example"}
            </span>
            <span>{form.description.length}/{descMax}</span>
          </div>
        </div>

        <div className="row two">
          <div className="field">
            <label className="label" htmlFor="priority">Priority</label>
            <select
              id="priority"
              className="select"
              name="priority"
              value={form.priority}
              onChange={handleChange}
              onBlur={handleBlur}
            >
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
            </select>
            {touched.priority && errors.priority && (
              <span className="error-text" style={{ fontSize: "0.875rem", marginTop: "4px" }}>
                {errors.priority}
              </span>
            )}
          </div>

          <div className="field">
            <label className="label" htmlFor="status">Status</label>
            <select
              id="status"
              className="select"
              name="status"
              value={form.status}
              onChange={handleChange}
              onBlur={handleBlur}
            >
              <option>Open</option>
              <option>In Progress</option>
              <option>Completed</option>
            </select>
            {touched.status && errors.status && (
              <span className="error-text" style={{ fontSize: "0.875rem", marginTop: "4px" }}>
                {errors.status}
              </span>
            )}
          </div>
        </div>

        <div className="actions">
          {/* disabled when saving or invalid */}
          <button className="btn btn-primary" type="submit" disabled={saving || !isValid}>
            {saving ? (
              <>
                <span className="spinner" aria-hidden="true" />
                Saving...
              </>
            ) : editingFeature ? "Update Feature" : "Add Feature"}
          </button>
          {!editingFeature && (
            <button
              className="btn btn-secondary"
              type="button"
              onClick={() => {
                setForm(initialForm);
                setTouched({});
              }}
              disabled={saving}
            >
              Reset
            </button>
          )}
        </div>
      </form>
    </section>
  );
}