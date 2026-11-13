import React from 'react';

export default function Sidebar({ activePage, setActivePage, docCount, mobileOpen, setMobileOpen }) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: 'bi-grid-1x2-fill', section: 'Main' },
    { id: 'upload', label: 'Upload Documents', icon: 'bi-cloud-arrow-up-fill', section: 'Documents' },
    { id: 'documents', label: 'My Documents', icon: 'bi-folder2-open', badge: docCount, section: 'Documents' },
    { id: 'ask-ai', label: 'Ask AI', icon: 'bi-robot', section: 'Intelligence' },
    { id: 'search', label: 'Search Documents', icon: 'bi-search', section: 'Intelligence' },
    { id: 'about', label: 'About Project', icon: 'bi-info-circle-fill', section: 'Information' },
  ];

  const handleSelect = (id) => {
    setActivePage(id);
    if (setMobileOpen) setMobileOpen(false);
  };

  let currentSection = '';

  return (
    <aside className={`app-sidebar ${mobileOpen ? 'show-mobile' : ''}`}>
      {/* Brand Header */}
      <div className="sidebar-brand">
        <div className="brand-icon-box">
          <i className="bi bi-file-earmark-text-fill"></i>
        </div>
        <div className="brand-info">
          <h4>DocuMind AI</h4>
          <span>THASMAI P07 &bull; v1.0</span>
        </div>
      </div>

      {/* Navigation List */}
      <nav className="sidebar-nav">
        {navItems.map((item) => {
          const showSection = item.section !== currentSection;
          if (showSection) {
            currentSection = item.section;
          }

          return (
            <React.Fragment key={item.id}>
              {showSection && <div className="nav-section-title">{item.section}</div>}
              <button
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
            </React.Fragment>
          );
        })}
      </nav>

      {/* Sidebar Footer */}
      <div className="sidebar-footer">
        <div className="d-flex align-items-center justify-content-between">
          <span className="fw-semibold text-white">Internship Assessment</span>
          <span className="badge bg-dark border border-secondary text-info">P07</span>
        </div>
        <div>THASMAI INFOTECH &bull; 2026</div>
      </div>
    </aside>
  );
}

