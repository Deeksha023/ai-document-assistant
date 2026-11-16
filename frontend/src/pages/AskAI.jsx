import React, { useState, useRef, useEffect } from 'react';
import api from '../services/api';
import SnippetCard from '../components/SnippetCard';

export default function AskAI({ documents, selectedDocId, onInspectDoc, onNavigate }) {
  const [question, setQuestion] = useState('');
  const [activeDocFilter, setActiveDocFilter] = useState(selectedDocId ? String(selectedDocId) : '');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const messagesEndRef = useRef(null);

  // Conversational message history
  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      sender: 'assistant',
      text: 'Hello! I am DocuMind AI, your intelligent document assistant. Ask me questions about your uploaded PDF documents, and I will extract answers with verifiable page references.',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      data: null,
    },
  ]);

  const sampleQuestions = [
    'What is supervised learning?',
    'What are the standard working hours at Thasmai?',
    'How do transformer architectures process sequential data?',
    'What is the annual leave and paid time off policy?',
    'What is the recipe for chocolate cake?', // Demonstrates required fallback
  ];

  // Scroll to latest message
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, loading]);

  const handleAsk = async (customQuery) => {
    const queryText = (customQuery !== undefined ? customQuery : question).trim();
    if (!queryText || loading) return;

    setErrorMsg('');
    const userMsgId = Date.now().toString();
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // 1. Append user message
    const userMessage = {
      id: userMsgId,
      sender: 'user',
      text: queryText,
      timestamp: timeStr,
      data: null,
    };

    setMessages((prev) => [...prev, userMessage]);
    setQuestion('');
    setLoading(true);

    try {
      const docId = activeDocFilter ? parseInt(activeDocFilter, 10) : null;
      const res = await api.askQuestion(queryText, docId);

      if (res.success) {
        const assistantMsg = {
          id: (Date.now() + 1).toString(),
          sender: 'assistant',
          text: res.data.answer,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          data: res.data,
        };
        setMessages((prev) => [...prev, assistantMsg]);
      } else {
        setErrorMsg(res.error || 'Failed to process question.');
      }
    } catch (err) {
      setErrorMsg(err.message || 'Error communicating with AI QA service.');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleAsk();
    }
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: 'welcome',
        sender: 'assistant',
        text: 'Chat cleared. Ask me any question based on your uploaded documents!',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        data: null,
      },
    ]);
  };

  return (
    <div className="chat-wrapper">
      {/* Professional Chat Header */}
      <div className="chat-header-bar">
        <div className="d-flex align-items-center gap-2">
          <div className="chat-avatar-assistant" style={{ width: 34, height: 34, minWidth: 34, fontSize: '1rem' }}>
            <i className="bi bi-robot"></i>
          </div>
          <div>
            <h4 className="fw-bold m-0 text-dark" style={{ fontSize: '1rem' }}>DocuMind Intelligence Chat</h4>
            <div className="small text-muted" style={{ fontSize: '0.74rem' }}>
              TF-IDF Cosine Retrieval &bull; Extractive Grounded Synthesis
            </div>
          </div>
        </div>

        <div className="d-flex align-items-center gap-3">
          {/* Document Scope Filter */}
          <div className="d-flex align-items-center gap-2">
            <span className="small text-muted fw-semibold d-none d-md-inline" style={{ fontSize: '0.76rem' }}>
              Scope:
            </span>
            <select
              className="form-select form-select-sm rounded-3"
              style={{ maxWidth: '240px', fontSize: '0.8rem' }}
              value={activeDocFilter}
              onChange={(e) => setActiveDocFilter(e.target.value)}
            >
              <option value="">All Documents ({documents.length})</option>
              {documents.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.original_name} (p.{d.total_pages})
                </option>
              ))}
            </select>
          </div>

          {/* Clear History */}
          <button
            className="btn btn-sm btn-outline-secondary rounded-3 d-flex align-items-center gap-1"
            onClick={handleClearChat}
            title="Clear Chat History"
          >
            <i className="bi bi-trash"></i>
            <span className="d-none d-sm-inline">Clear</span>
          </button>
        </div>
      </div>

      {/* Chat Messages Area */}
      <div className="chat-messages-scroll">
        {messages.map((msg) => {
          const isUser = msg.sender === 'user';

          if (isUser) {
            return (
              <div key={msg.id} className="chat-row-user">
                <div className="chat-bubble-user">
                  {msg.text}
                  <div className="text-end mt-1 text-white-50" style={{ fontSize: '0.68rem' }}>
                    {msg.timestamp}
                  </div>
                </div>
              </div>
            );
          }

          // Assistant Message
          const isAnswerFound = msg.data?.found;

          return (
            <div key={msg.id} className="chat-row-assistant">
              <div className="chat-avatar-assistant">
                <i className="bi bi-robot"></i>
              </div>

              <div className="chat-bubble-assistant">
                {/* Header tag */}
                <div className="d-flex align-items-center justify-content-between gap-2">
                  <div className="d-flex align-items-center gap-2">
                    <span className="badge bg-primary text-white fw-semibold" style={{ fontSize: '0.7rem' }}>
                      DocuMind AI
                    </span>
                    {msg.data?.confidence > 0 && (
                      <span className="badge bg-success-subtle text-success border border-success-subtle" style={{ fontSize: '0.7rem' }}>
                        Match Confidence: {msg.data.confidence}%
                      </span>
                    )}
                  </div>
                  <small className="text-muted" style={{ fontSize: '0.7rem' }}>
                    {msg.timestamp}
                  </small>
                </div>

                {/* Body / Answer */}
                {msg.data ? (
                  isAnswerFound ? (
                    <div>
                      <div className="assistant-answer-text">
                        "{msg.text}"
                      </div>

                      {/* Supporting Source References */}
                      {msg.data.sources && msg.data.sources.length > 0 && (
                        <div className="chat-sources-block">
                          <div className="fw-bold small text-muted d-flex align-items-center gap-1">
                            <i className="bi bi-bookmark-check-fill text-primary"></i>
                            <span>Supporting Evidence & Citations ({msg.data.sources.length}):</span>
                          </div>

                          <div className="d-flex flex-column gap-2 mt-1">
                            {msg.data.sources.map((src, sIdx) => (
                              <SnippetCard
                                key={sIdx}
                                documentName={src.document_name}
                                documentId={src.document_id}
                                pageNumber={src.page_number}
                                snippet={src.snippet}
                                score={src.relevance_score}
                                matchedTerms={src.matched_terms}
                                onViewDocument={onInspectDoc}
                              />
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    /* Fallback no-answer state */
                    <div className="p-3 bg-warning-subtle text-warning-emphasis rounded-3 border border-warning-subtle">
                      <div className="d-flex align-items-center gap-2 fw-bold text-danger mb-1">
                        <i className="bi bi-exclamation-octagon-fill"></i>
                        <span>No relevant information found in the uploaded documents.</span>
                      </div>
                      <div className="small text-muted">
                        The question does not match any indexed text passages with sufficient confidence.
                        Try asking about specific topics inside your uploaded PDFs, or upload additional documents.
                      </div>
                    </div>
                  )
                ) : (
                  <div className="assistant-answer-text">
                    {msg.text}
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {/* Processing Indicator */}
        {loading && (
          <div className="chat-row-assistant">
            <div className="chat-avatar-assistant">
              <i className="bi bi-robot"></i>
            </div>
            <div className="chat-bubble-assistant p-3">
              <div className="d-flex align-items-center gap-2 text-primary small fw-semibold">
                <span className="spinner-grow spinner-grow-sm" role="status"></span>
                <span>Searching document vectors and synthesizing answer...</span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Bottom Input Area */}
      <div className="chat-bottom-bar">
        {errorMsg && (
          <div className="alert alert-danger py-1 px-3 mb-2 small rounded-3 d-flex align-items-center gap-2">
            <i className="bi bi-exclamation-circle-fill"></i>
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Sample Question Pills */}
        <div className="mb-2 d-flex align-items-center gap-1 flex-wrap">
          <small className="text-muted fw-semibold me-1" style={{ fontSize: '0.72rem' }}>
            <i className="bi bi-lightbulb text-warning me-1"></i>Try asking:
          </small>
          {sampleQuestions.map((sq, i) => (
            <button
              key={i}
              type="button"
              className="chip-btn"
              onClick={() => handleAsk(sq)}
              disabled={loading}
              style={{ fontSize: '0.74rem', padding: '3px 10px' }}
            >
              {sq}
            </button>
          ))}
        </div>

        {/* Question Input Row */}
        <div className="chat-input-row">
          <input
            type="text"
            className="chat-input-field"
            placeholder="Ask any question grounded in your uploaded documents..."
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={loading}
          />
          <button
            type="button"
            className="chat-send-btn"
            onClick={() => handleAsk()}
            disabled={loading || !question.trim()}
            title="Send Question (Enter)"
          >
            <i className="bi bi-arrow-up-short fs-4"></i>
          </button>
        </div>
      </div>
    </div>
  );
}
