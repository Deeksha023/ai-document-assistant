import React, { useState, useEffect, useCallback } from 'react';
import './App.css';
import api from './services/api';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import Notification from './components/Notification';
import DocumentModal from './components/DocumentModal';

import Dashboard from './pages/Dashboard';
import UploadDocuments from './pages/UploadDocuments';
import MyDocuments from './pages/MyDocuments';
import AskAI from './pages/AskAI';
import SearchDocuments from './pages/SearchDocuments';
import AboutProject from './pages/AboutProject';

export default function App() {
  const [activePage, setActivePage] = useState('dashboard');
  const [documents, setDocuments] = useState([]);
  const [stats, setStats] = useState({
    total_documents: 0,
    total_pages: 0,
    total_words: 0,
    total_queries: 0,
  });
  const [recentDocs, setRecentDocs] = useState([]);
  const [recentQueries, setRecentQueries] = useState([]);
  const [isOnline, setIsOnline] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Notifications
  const [notification, setNotification] = useState(null);

  // Document Inspection Modal
  const [modalDoc, setModalDoc] = useState(null);
  const [modalInitialPage, setModalInitialPage] = useState(1);

  // Selected document context for Ask AI
  const [selectedDocForQA, setSelectedDocForQA] = useState(null);

  // Sample import loading state
  const [importingSamples, setImportingSamples] = useState(false);

  const showNotification = (message, type = 'info') => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification((curr) => (curr && curr.message === message ? null : curr));
    }, 6000);
  };

  const loadData = useCallback(async () => {
    try {
      // Check health
      await api.checkHealth();
      setIsOnline(true);

      // Fetch Stats
      const statsRes = await api.getDashboardStats();
      if (statsRes.success) {
        setStats(statsRes.stats);
        setRecentDocs(statsRes.recent_documents || []);
        setRecentQueries(statsRes.recent_queries || []);
      }

      // Fetch Documents
      const docsRes = await api.getDocuments();
      if (docsRes.success) {
        setDocuments(docsRes.documents);
      }
    } catch (err) {
      console.warn('Backend sync failed:', err.message);
      setIsOnline(false);
    }
  }, []);

  useEffect(() => {
    loadData();
    // Poll sync every 30 seconds
    const interval = setInterval(loadData, 30000);
    return () => clearInterval(interval);
  }, [loadData]);

  // Handle document inspection
  const handleInspectDoc = async (docId, initialPage = 1) => {
    try {
      const res = await api.getDocumentDetails(docId);
      if (res.success) {
        setModalDoc(res.document);
        setModalInitialPage(initialPage);
      } else {
        showNotification(res.error || 'Unable to load document details.', 'error');
      }
    } catch (err) {
      showNotification(err.message, 'error');
    }
  };

  // Handle document deletion
  const handleDeleteDoc = async (docId, docName) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${docName}"? This will permanently remove its extracted pages and search index.`
    );
    if (!confirmed) return;

    try {
      const res = await api.deleteDocument(docId);
      if (res.success) {
        showNotification(res.message, 'success');
        loadData();
      } else {
        showNotification(res.error || 'Failed to delete document.', 'error');
      }
    } catch (err) {
      showNotification(err.message, 'error');
    }
  };

  // Handle one-click sample documents import
  const handleImportSamples = async () => {
    setImportingSamples(true);
    try {
      const res = await api.importSampleDocuments();
      if (res.success) {
        showNotification(res.message, 'success');
        loadData();
      } else {
        showNotification(res.error || 'Failed to import sample documents.', 'error');
      }
    } catch (err) {
      showNotification(err.message, 'error');
    } finally {
      setImportingSamples(false);
    }
  };

  // Navigation helper
  const handleNavigate = (page, docId = null) => {
    setActivePage(page);
    if (docId) {
      setSelectedDocForQA(docId);
    }
  };

  return (
    <div className="app-container">
      {/* Sidebar Navigation */}
      <Sidebar
        activePage={activePage}
        setActivePage={setActivePage}
        docCount={documents.length}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      {/* Main View Area */}
      <div className="app-main">
        {/* Top Navbar */}
        <Navbar
          activePage={activePage}
          setActivePage={setActivePage}
          isOnline={isOnline}
          onRefresh={loadData}
          toggleMobile={() => setMobileOpen(!mobileOpen)}
        />

        {/* Page Content Body */}
        <main className="page-body">
          {notification && (
            <Notification
              message={notification.message}
              type={notification.type}
              onClose={() => setNotification(null)}
            />
          )}

          {activePage === 'dashboard' && (
            <Dashboard
              stats={stats}
              recentDocs={recentDocs}
              recentQueries={recentQueries}
              onNavigate={handleNavigate}
              onInspectDoc={handleInspectDoc}
              onImportSamples={handleImportSamples}
              importingSamples={importingSamples}
              isOnline={isOnline}
              onRefresh={loadData}
            />
          )}

          {activePage === 'upload' && (
            <UploadDocuments
              documents={documents}
              onUploadSuccess={loadData}
              onImportSamples={handleImportSamples}
              importingSamples={importingSamples}
              onDeleteDoc={handleDeleteDoc}
              onInspectDoc={handleInspectDoc}
            />
          )}

          {activePage === 'documents' && (
            <MyDocuments
              documents={documents}
              onInspectDoc={handleInspectDoc}
              onDeleteDoc={handleDeleteDoc}
              onNavigate={handleNavigate}
              onImportSamples={handleImportSamples}
              importingSamples={importingSamples}
            />
          )}

          {activePage === 'ask-ai' && (
            <AskAI
              documents={documents}
              selectedDocId={selectedDocForQA}
              onInspectDoc={handleInspectDoc}
              onNavigate={handleNavigate}
            />
          )}

          {activePage === 'search' && (
            <SearchDocuments
              documents={documents}
              onInspectDoc={handleInspectDoc}
              onNavigate={handleNavigate}
            />
          )}

          {activePage === 'about' && <AboutProject />}
        </main>
      </div>

      {/* Document Inspector Modal */}
      {modalDoc && (
        <DocumentModal
          doc={modalDoc}
          initialPage={modalInitialPage}
          onClose={() => setModalDoc(null)}
        />
      )}
    </div>
  );
}

