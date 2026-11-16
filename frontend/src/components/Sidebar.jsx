import React from 'react';

export default function Sidebar({ activePage, setActivePage, docCount, mobileOpen, setMobileOpen }) {
  const navSections = [
    {
      title: 'MAIN',
      items: [
        { id: 'dashboard', label: 'Dashboard', icon: 'bi-grid-1x2-fill' },
      ],
    },
    {
      title: 'DOCUMENTS',
      items: [
        { id: 'upload', label: 'Upload Documents', icon: 'bi-cloud-arrow-up-fill' },
        { id: 'documents', label: 'My Documents', icon: 'bi-folder2-open', badge: docCount },
      ],
    },
    {
      title: 'INTELLIGENCE',
      items: [
        { id: 'ask-ai', label: 'Ask AI', icon: 'bi-robot' },
        { id: 'search', label: 'Search Documents', icon: 'bi-search' },
      ],
    },
    {
      title: 'INFORMATION',
      items: [
        { id: 'about', label: 'About Project', icon: 'bi-info-circle-fill' },
      ],
    },
  ];

  const handleSelect = (id) => {
    setActivePage(id);
    if (setMobileOpen) setMobileOpen(false);
  };

  return (
    <>
      {/* Mobile backdrop */}
      <div
        className={`sidebar-backdrop ${mobileOpen ? 'show-mobile' : ''}`}
        onClick={() => setMobileOpen(false)}
      />

      <aside className={`app-sidebar ${mobileOpen ? 'show-mobile' : ''}`}>
        {/* Brand Header */}
        <div className="sidebar-brand">
          <div className="brand-icon-box">
            <i className="bi bi-cpu-fill"></i>
          </div>
          <div className="brand-info">
            <h4>DocuMind AI</h4>
            <span>THASMAI P07 &bull; v1.0</span>
          </div>
        </div>

        {/* Navigation Sections */}
        <nav className="sidebar-nav">
          {navSections.map((sec, sIdx) => (
            <div key={sIdx} className="mb-2">
              <div className="nav-section-title">{sec.title}</div>
              {sec.items.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className={`nav-item-btn ${activePage === item.id ? 'active' : ''}`}
                  onClick={() => handleSelect(item.id)}
                >
                  <i className={`bi ${item.icon}`}></i>
                  <span className="flex-grow-1">{item.label}</span>
                  {item.badge !== undefined && item.badge > 0 && (
                    <span className="badge bg-primary rounded-pill px-2 py-1" style={{ fontSize: '0.72rem' }}>
                      {item.badge}
                    </span>
                  )}
                </button>
              ))}
            </div>
          ))}
        </nav>

        {/* Sidebar Footer */}
        <div className="sidebar-footer">
          <div className="d-flex align-items-center justify-content-between mb-1">
            <span className="fw-semibold text-white">Internship Assessment</span>
            <span className="badge bg-dark border border-secondary text-info">P07</span>
          </div>
          <div className="text-secondary small">THASMAI INFOTECH &bull; 2026</div>
        </div>
      </aside>
    </>
  );
}
