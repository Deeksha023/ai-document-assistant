import React from 'react';

export default function StatCard({ label, value, desc, icon, variant = 'blue' }) {
  const iconClasses = {
    blue: 'stat-icon-blue',
    purple: 'stat-icon-purple',
    emerald: 'stat-icon-emerald',
    amber: 'stat-icon-amber',
  };

  return (
    <div className="stat-card-redesigned">
      <div className="stat-card-body">
        <div className="stat-label-text">{label}</div>
        <div className="stat-value-text" title={String(value)}>
          {typeof value === 'number' ? value.toLocaleString() : value}
        </div>
        {desc && <div className="stat-desc-text">{desc}</div>}
      </div>
      <div className={`stat-icon-wrapper ${iconClasses[variant] || 'stat-icon-blue'}`}>
        <i className={`bi ${icon}`}></i>
      </div>
    </div>
  );
}
