import React from 'react';

export default function StatCard({ label, value, desc, icon, variant = 'blue' }) {
  const iconClasses = {
    blue: 'stat-icon-blue',
    purple: 'stat-icon-purple',
    emerald: 'stat-icon-emerald',
    amber: 'stat-icon-amber',
  };

  return (
    <div className="stat-card">
      <div className="stat-content">
        <div className="stat-label">{label}</div>
        <div className="stat-value">{value}</div>
        {desc && <div className="stat-desc">{desc}</div>}
      </div>
      <div className={`stat-icon ${iconClasses[variant] || 'stat-icon-blue'}`}>
        <i className={`bi ${icon}`}></i>
      </div>
    </div>
  );
}

