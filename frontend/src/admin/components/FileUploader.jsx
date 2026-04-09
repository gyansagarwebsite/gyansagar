import { useState } from 'react';
import { Upload, X } from 'lucide-react';
import './FileUploader.css';

export default function FileUploader({
  label,
  accept = '*',
  maxSize = 5 * 1024 * 1024, // 5MB default
  onFile,
  multiple = false,
  required = false,
  hint,
  error,
}) {
  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const validateFile = (uploadedFile) => {
    if (uploadedFile.size > maxSize) {
      return `File size must be less than ${(maxSize / (1024 * 1024)).toFixed(1)}MB`;
    }
    return null;
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const droppedFiles = e.dataTransfer.files;
    if (droppedFiles.length > 0) {
      const uploadedFile = droppedFiles[0];
      const fileError = validateFile(uploadedFile);
      if (fileError) {
        console.error(fileError);
        return;
      }
      setFile(uploadedFile);
      onFile?.(uploadedFile);
    }
  };

  const handleInputChange = (e) => {
    const uploadedFile = e.target.files?.[0];
    if (uploadedFile) {
      const fileError = validateFile(uploadedFile);
      if (fileError) {
        console.error(fileError);
        return;
      }
      setFile(uploadedFile);
      onFile?.(uploadedFile);
    }
  };

  const clearFile = () => {
    setFile(null);
    onFile?.(null);
  };

  return (
    <div className="form-input-group">
      {label && (
        <label className="form-input-label">
          {label}
          {required && <span className="required-asterisk">*</span>}
        </label>
      )}

      <div
        className={`file-upload-zone ${isDragging ? 'dragging' : ''} ${error ? 'zone-error' : ''}`}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <input
          type="file"
          accept={accept}
          onChange={handleInputChange}
          className="file-input-hidden"
          id={`file-upload-${Date.now()}`}
        />
        <label htmlFor={`file-upload-${Date.now()}`} className="file-upload-label">
          <Upload className="upload-icon" size={32} />
          {file ? (
            <>
              <p className="file-name">{file.name}</p>
              <p className="file-size">
                {(file.size / 1024).toFixed(1)} KB
              </p>
            </>
          ) : (
            <>
              <p className="drag-text">Drag and drop your file here</p>
              <p className="or-text">or click to select</p>
            </>
          )}
        </label>
      </div>

      {file && (
        <button
          type="button"
          onClick={clearFile}
          className="file-clear-btn"
          title="Remove file"
        >
          <X size={16} />
          Clear
        </button>
      )}

      {error && (
        <p className="form-input-error">{error}</p>
      )}
      {!error && hint && (
        <p className="form-input-hint">{hint}</p>
      )}
    </div>
  );
}
