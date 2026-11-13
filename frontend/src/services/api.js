/**
 * API Service for AI Document Assistant
 * Handles all REST API requests to the Flask backend.
 */

// Use empty string so it leverages the Vite proxy in development,
// or fallback to 127.0.0.1:5000 if served from a different origin.
const API_BASE = window.location.port === '3000' ? '' : 'http://127.0.0.1:5000';

async function request(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  const defaultHeaders = {};

  if (!(options.body instanceof FormData)) {
    defaultHeaders['Content-Type'] = 'application/json';
  }

  const config = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...(options.headers || {}),
    },
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      const errorMessage = data.error || data.message || `Request failed with status ${response.status}`;
      throw new Error(errorMessage);
    }

    return data;
  } catch (error) {
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error('Unable to connect to Flask backend server. Ensure backend is running on http://127.0.0.1:5000.');
    }
    throw error;
  }
}

export const api = {
  // Health
  checkHealth: () => request('/api/health'),

  // Dashboard
  getDashboardStats: () => request('/api/dashboard/stats'),

  // Documents
  getDocuments: () => request('/api/documents'),
  getDocumentDetails: (id) => request(`/api/documents/${id}`),
  deleteDocument: (id) => request(`/api/documents/${id}`, { method: 'DELETE' }),
  importSampleDocuments: () => request('/api/documents/import-samples', { method: 'POST' }),

  uploadDocument: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return request('/api/documents/upload', {
      method: 'POST',
      body: formData,
    });
  },

  // Search
  searchDocuments: (query, documentId = null, topK = 10) => {
    return request('/api/search', {
      method: 'POST',
      body: JSON.stringify({
        query,
        document_id: documentId || null,
        top_k: topK,
      }),
    });
  },

  // Question & Answering
  askQuestion: (question, documentId = null) => {
    return request('/api/qa/ask', {
      method: 'POST',
      body: JSON.stringify({
        question,
        document_id: documentId || null,
      }),
    });
  },

  getQueryHistory: () => request('/api/qa/history'),
};

export default api;
