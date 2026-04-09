import './FormInput.css';
import { AlertCircle, CheckCircle } from 'lucide-react';

const FormInput = ({
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  onBlur,
  error,
  required = false,
  disabled = false,
  hint,
  success = false,
  ...props
}) => {
  return (
    <div className="form-input-group">
      {label && (
        <label className="form-input-label">
          {label}
          {required && <span className="required-asterisk">*</span>}
        </label>
      )}
      <div className="input-wrapper">
        <input
          type={type}
          className={`form-input ${error ? 'input-error' : ''} ${success && !error ? 'input-success' : ''}`}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          disabled={disabled}
          {...props}
        />
        {error && <AlertCircle className="input-icon error-icon" size={18} />}
        {success && !error && <CheckCircle className="input-icon success-icon" size={18} />}
      </div>
      {error && (
        <p className="form-input-error">
          <AlertCircle size={14} />
          {error}
        </p>
      )}
      {hint && !error && <p className="form-input-hint">{hint}</p>}
      {success && !error && (
        <p className="form-input-success">✓ Looks good!</p>
      )}
    </div>
  );
};

export default FormInput;
