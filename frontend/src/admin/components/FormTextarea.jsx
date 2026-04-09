import './FormTextarea.css';

export default function FormTextarea({
  label,
  value = '',
  onChange,
  onBlur,
  error,
  required = false,
  disabled = false,
  hint,
  rows = 4,
  placeholder = '',
}) {
  return (
    <div className="form-input-group">
      {label && (
        <label className="form-input-label">
          {label}
          {required && <span className="required-asterisk">*</span>}
        </label>
      )}
      <textarea
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        disabled={disabled}
        placeholder={placeholder}
        rows={rows}
        className={`form-textarea ${error ? 'textarea-error' : ''}`}
      />
      {error && (
        <p className="form-input-error">{error}</p>
      )}
      {!error && hint && (
        <p className="form-input-hint">{hint}</p>
      )}
    </div>
  );
}
