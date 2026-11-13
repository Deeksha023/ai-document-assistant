import React from 'react';

export default function Notification({ message, type = 'info', onClose }) {
  if (!message) return null;

  const bgClasses = {
    success: 'alert-success border-success-subtle text-success-emphasis',
    error: 'alert-danger border-danger-subtle text-danger-emphasis',
    warning: 'alert-warning border-warning-subtle text-warning-emphasis',
    info: 'alert-primary border-primary-subtle text-primary-emphasis',
  };

  const icons = {
    success: 'bi-check-circle-fill',
    error: 'bi-exclamation-triangle-fill',
    warning: 'bi-exclamation-circle-fill',
    info: 'bi-info-circle-fill',
  };

  return (
    <div
      className={`alert ${bgClasses[type] || bgClasses.info} alert-dismissible fade show d-flex align-items-center gap-3 shadow-sm rounded-3 mb-4`}
      role="alert"
    >
      <i className={`bi ${icons[type] || icons.info} fs-5`}></i>
      <div className="flex-grow-1 fw-medium" style={{ fontSize: '0.92rem' }}>
        {message}
      </div>
      {onClose && (
        <button
          type="button"
          className="btn-close"
          onClick={onClose}
          aria-label="Close"
        ></button>
      )}
    </div>
  );
}

