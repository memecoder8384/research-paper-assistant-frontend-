import React, { useState, useRef, useEffect } from 'react';
import { useWorkspace } from '../context/WorkspaceContext';
import { ChatMessage } from '../types';
import { sendChatMessage } from '../services/api';
import { Skeleton, SkeletonText } from '../components/common/Skeleton';
import { LiquidButton } from '../components/common/LiquidButton';

export const ChatPage: React.FC = () => {
  const {
    papers,
    selectedPapersForChat,
    togglePaperSelectionForChat,
    showToast,
    isProcessing,
    setIsProcessing,
  } = useWorkspace();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPaperPicker, setShowPaperPicker] = useState(false);
  const [expandedCitations, setExpandedCitations] = useState<Record<string, boolean>>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const busy = isLoading || isProcessing;

  const toggleCitations = (messageId: string) => {
    setExpandedCitations(prev => ({
      ...prev,
      [messageId]: !prev[messageId],
    }));
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || busy) return;

    if (selectedPapersForChat.length === 0) {
      showToast('Please select at least one paper to ground the AI response.', 'warning');
      return;
    }

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      content: inputText.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);
    setIsProcessing(true);

    try {
      const assistantMessage = await sendChatMessage(userMessage.content, selectedPapersForChat, messages);
      setMessages(prev => [...prev, assistantMessage]);
    } catch (err) {
      showToast('Error communicating with research assistant.', 'error');
    } finally {
      setIsLoading(false);
      setIsProcessing(false);
    }
  };

  const handlePromptClick = (prompt: string) => {
    if (busy) return;
    setInputText(prompt);
  };

  const handleNewConversation = () => {
    if (busy) return;
    setMessages([]);
    showToast('New conversation started.', 'info');
  };

  const selectedPaperObjects = papers.filter(p => selectedPapersForChat.includes(p.id));

  return (
    <main className="flex-1 p-gutter-lg lg:p-gutter-xl max-w-[1200px] w-full mx-auto flex flex-col justify-between gap-gutter-lg">
      {/* Chat Workspace Controls */}
      <section className="flex flex-col sm:flex-row sm:items-center justify-between gap-gutter-md pb-gutter-md border-b border-outline-variant">
        <div className="flex flex-wrap items-center gap-gutter-sm">
          <h1 className="font-headline text-headline-md text-on-surface mr-gutter-sm">Research Chat</h1>
          <div className="relative flex items-center gap-gutter-xs">
            <button
              type="button"
              disabled={busy}
              onClick={() => setShowPaperPicker(!showPaperPicker)}
              className="flex items-center gap-2 px-3 py-1.5 bg-surface hover:bg-surface-container-low border border-outline-variant rounded font-body text-body-sm text-on-surface transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span>Active Context: {selectedPapersForChat.length} Papers</span>
              <span className="material-symbols-outlined text-[16px] text-on-surface-variant">arrow_drop_down</span>
            </button>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-primary-container text-primary font-mono text-mono-sm tabular-nums">
              <span>{selectedPapersForChat.length} selected</span>
            </span>

            {/* Paper Selection Dropdown */}
            {showPaperPicker && (
              <div className="absolute top-10 left-0 w-80 bg-surface border border-outline-variant rounded-md shadow-xl p-3 z-40 flex flex-col gap-2">
                <span className="font-label text-label-sm text-on-surface-variant">Select Grounding Papers:</span>
                <div className="max-h-56 overflow-y-auto flex flex-col gap-1.5">
                  {papers.map(p => {
                    const isSelected = selectedPapersForChat.includes(p.id);
                    return (
                      <label
                        key={p.id}
                        className={`flex items-center gap-2.5 p-1.5 rounded hover:bg-surface-container-low cursor-pointer text-xs ${
                          busy ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''
                        }`}
                      >
                        <input
                          type="checkbox"
                          disabled={busy}
                          checked={isSelected}
                          onChange={() => togglePaperSelectionForChat(p.id)}
                          className="rounded border-outline text-primary focus:ring-primary disabled:opacity-50"
                        />
                        <span className="truncate font-body text-on-surface">{p.title}</span>
                      </label>
                    );
                  })}
                </div>
                <div className="pt-2 border-t border-outline-variant flex justify-end">
                  <button
                    type="button"
                    disabled={busy}
                    onClick={() => setShowPaperPicker(false)}
                    className="px-3 py-1 bg-primary text-on-primary rounded text-xs font-label disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Done
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        <LiquidButton
          type="button"
          variant="default"
          size="sm"
          disabled={busy}
          onClick={handleNewConversation}
        >
          <span className="material-symbols-outlined text-[16px]" aria-hidden="true">add</span>
          <span>New Conversation</span>
        </LiquidButton>
      </section>

      {/* Conversation Area (Centered Comfortable Reading Width) */}
      <section className="max-w-3xl w-full mx-auto flex-1 flex flex-col gap-gutter-lg">
        {/* Selected Document Chips */}
        <div className="flex flex-wrap items-center gap-gutter-xs">
          <span className="font-label text-label-sm text-on-surface-variant mr-1">Grounding in:</span>
          {selectedPaperObjects.length === 0 ? (
            <span className="text-xs text-error font-body">No papers selected. Responses will not be grounded.</span>
          ) : (
            selectedPaperObjects.map(paper => (
              <span
                key={paper.id}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-surface border border-outline-variant font-label text-label-sm text-on-surface shadow-2xs"
              >
                <span className="truncate max-w-[220px]">{paper.title}</span>
                <button
                  type="button"
                  disabled={busy}
                  aria-label={`Remove ${paper.title}`}
                  onClick={() => togglePaperSelectionForChat(paper.id)}
                  className="text-on-surface-variant hover:text-on-surface disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <span className="material-symbols-outlined text-[14px]">close</span>
                </button>
              </span>
            ))
          )}
        </div>

        {/* Welcome / Suggested Prompts Strip (Shown if less than 3 messages) */}
        {messages.length <= 2 && (
          <div className="bg-surface border border-outline-variant rounded-md p-gutter-lg flex flex-col gap-gutter-md shadow-xs">
            <div className="flex items-start gap-gutter-md">
              <span className="w-10 h-10 rounded bg-primary-container text-primary flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[20px]" aria-hidden="true">auto_awesome</span>
              </span>
              <div className="flex flex-col gap-gutter-xs">
                <h2 className="font-title text-title-md text-on-surface">Ask questions grounded in your literature</h2>
                <p className="font-body text-body-sm text-on-surface-variant">
                  Every response is synthesized directly from the selected papers with verifiable page citations.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-gutter-sm">
              <button
                type="button"
                disabled={busy}
                onClick={() => handlePromptClick('Explain the methodology used in these papers.')}
                className="text-left px-3 py-2.5 rounded border border-outline-variant bg-background hover:border-primary hover:bg-primary-container/30 transition-colors duration-state-change font-body text-body-sm text-on-surface disabled:opacity-50 disabled:cursor-not-allowed"
              >
                "Explain the methodology used in these papers."
              </button>
              <button
                type="button"
                disabled={busy}
                onClick={() => handlePromptClick('What are the main findings and empirical benchmarks?')}
                className="text-left px-3 py-2.5 rounded border border-outline-variant bg-background hover:border-primary hover:bg-primary-container/30 transition-colors duration-state-change font-body text-body-sm text-on-surface disabled:opacity-50 disabled:cursor-not-allowed"
              >
                "What are the main findings?"
              </button>
              <button
                type="button"
                disabled={busy}
                onClick={() => handlePromptClick('Identify the key limitations and trade-offs of this research.')}
                className="text-left px-3 py-2.5 rounded border border-outline-variant bg-background hover:border-primary hover:bg-primary-container/30 transition-colors duration-state-change font-body text-body-sm text-on-surface disabled:opacity-50 disabled:cursor-not-allowed"
              >
                "Identify the limitations of this research."
              </button>
              <button
                type="button"
                disabled={busy}
                onClick={() => handlePromptClick('Compare the architectural conclusions of the selected papers.')}
                className="text-left px-3 py-2.5 rounded border border-outline-variant bg-background hover:border-primary hover:bg-primary-container/30 transition-colors duration-state-change font-body text-body-sm text-on-surface disabled:opacity-50 disabled:cursor-not-allowed"
              >
                "Compare the conclusions of selected papers."
              </button>
            </div>
          </div>
        )}

        {/* Messages Stream */}
        <div className="flex flex-col gap-gutter-lg">
          {messages.map(msg => (
            <div key={msg.id} className="flex flex-col gap-2 animate-slide-up">
              {msg.sender === 'user' ? (
                <div className="flex justify-end">
                  <div className="max-w-xl bg-primary-container text-on-primary-container rounded-md px-gutter-md py-3 shadow-xs">
                    <p className="font-body text-body-md whitespace-pre-wrap">{msg.content}</p>
                    <span className="text-[10px] text-primary/70 block text-right mt-1">{msg.timestamp}</span>
                  </div>
                </div>
              ) : (
                <article className="bg-surface border border-outline-variant rounded-md p-gutter-lg flex flex-col gap-gutter-md shadow-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-gutter-sm">
                      <span className="w-6 h-6 rounded bg-primary text-on-primary flex items-center justify-center shadow-2xs">
                        <span className="material-symbols-outlined text-[14px]" aria-hidden="true">science</span>
                      </span>
                      <span className="font-label text-label-md text-on-surface">Research Assistant</span>
                    </div>
                    {msg.citations && msg.citations.length > 0 && (
                      <span className="font-mono text-mono-sm text-on-surface-variant">
                        {msg.citations.length} citation{msg.citations.length > 1 ? 's' : ''} verified
                      </span>
                    )}
                  </div>

                  <div className="flex flex-col gap-gutter-sm max-w-prose font-body text-body-md text-on-surface leading-relaxed">
                    {msg.content.split('\n\n').map((paragraph, idx) => {
                      if (paragraph.startsWith('### ')) {
                        return (
                          <h3 key={idx} className="font-headline text-headline-sm text-on-surface pt-1">
                            {paragraph.replace('### ', '')}
                          </h3>
                        );
                      }
                      if (paragraph.startsWith('- ')) {
                        return (
                          <ul key={idx} className="list-disc pl-5 flex flex-col gap-gutter-xs">
                            {paragraph.split('\n').map((item, itemIdx) => (
                              <li key={itemIdx}>{item.replace('- ', '')}</li>
                            ))}
                          </ul>
                        );
                      }
                      return <p key={idx}>{paragraph}</p>;
                    })}
                  </div>

                  {/* Collapsible Citations Section */}
                  {msg.citations && msg.citations.length > 0 && (
                    <div className="pt-2 border-t border-outline-variant/60 flex flex-col gap-2.5">
                      <button
                        type="button"
                        onClick={() => toggleCitations(msg.id)}
                        className="inline-flex items-center gap-1.5 text-xs font-label text-on-surface-variant hover:text-primary transition-colors w-fit px-2.5 py-1.5 rounded bg-surface-container-low hover:bg-surface-container border border-outline-variant cursor-pointer group"
                      >
                        <span className="material-symbols-outlined text-[16px] text-on-surface-variant group-hover:text-primary transition-transform duration-200">
                          {expandedCitations[msg.id] ? 'expand_less' : 'expand_more'}
                        </span>
                        <span>
                          {expandedCitations[msg.id]
                            ? `Hide ${msg.citations.length} citation${msg.citations.length > 1 ? 's' : ''}`
                            : `View ${msg.citations.length} citation${msg.citations.length > 1 ? 's' : ''}`}
                        </span>
                      </button>

                      {/* Expanded Citation Cards (Hidden by default) */}
                      {expandedCitations[msg.id] && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1 animate-in fade-in duration-200">
                          {msg.citations.map(citation => (
                            <div
                              key={citation.id}
                              className="bg-background border border-outline-variant rounded-md p-3 flex flex-col gap-1.5 hover:border-primary/40 transition-colors overflow-hidden min-w-0 shadow-2xs"
                            >
                              <div className="flex items-center justify-between gap-2 min-w-0">
                                <span
                                  className="font-label text-label-sm text-primary truncate max-w-[180px] break-all"
                                  title={citation.paperTitle || citation.authorsYear}
                                >
                                  {(citation.paperTitle || citation.authorsYear || 'Document').replace(/\.[^/.]+$/, '').replace(/[_-]/g, ' ')}
                                </span>
                                <span className="px-2 py-0.5 rounded bg-primary-container text-primary font-mono text-mono-xs shrink-0 font-medium">
                                  {citation.page}
                                </span>
                              </div>
                              <p className="font-body text-xs text-on-surface-variant italic break-words break-all line-clamp-3 leading-relaxed">
                                "{citation.quote.replace(/^Passage from\s+[\w\.-]+\s*/i, 'Excerpt: ')}"
                              </p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </article>
              )}
            </div>
          ))}

          {/* Assistant Loading State */}
          {isLoading && (
            <article className="bg-surface border border-outline-variant rounded-md p-gutter-lg flex flex-col gap-gutter-md shadow-sm animate-in fade-in duration-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-gutter-sm">
                  <span className="w-6 h-6 rounded bg-primary text-on-primary flex items-center justify-center animate-spin shadow-2xs">
                    <span className="material-symbols-outlined text-[14px]">sync</span>
                  </span>
                  <span className="font-label text-label-md text-on-surface">Searching vector indices &amp; grounding claims...</span>
                </div>
                <Skeleton className="w-24 h-5 rounded-full" />
              </div>

              <div className="flex flex-col gap-2.5 max-w-prose">
                <SkeletonText lines={4} />
                <div className="pt-2">
                  <SkeletonText lines={3} />
                </div>
              </div>

              {/* Citations Retrieval Skeleton */}
              <div className="pt-2 border-t border-outline-variant/60 flex items-center gap-2">
                <Skeleton className="w-28 h-6 rounded" />
                <Skeleton className="w-20 h-6 rounded" />
              </div>
            </article>
          )}

          <div ref={messagesEndRef} />
        </div>
      </section>

      {/* Chat Composer */}
      <section className="max-w-3xl w-full mx-auto flex flex-col gap-gutter-xs pt-gutter-sm sticky bottom-2">
        <form
          onSubmit={handleSubmit}
          className="bg-surface border border-outline-variant focus-within:border-primary rounded-md p-3 shadow-md flex flex-col gap-gutter-sm transition-colors duration-state-change"
        >
          <textarea
            rows={2}
            disabled={busy}
            value={inputText}
            onChange={e => setInputText(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
            placeholder={busy ? "Generating response..." : "Ask a research question about your selected papers..."}
            className="w-full border-0 bg-transparent p-1 font-body text-body-md text-on-surface placeholder:text-on-surface-variant focus:ring-0 resize-none outline-none disabled:opacity-50 disabled:cursor-not-allowed"
          />
          <div className="flex items-center justify-between">
            <button
              type="button"
              disabled={busy}
              onClick={() => setShowPaperPicker(true)}
              aria-label="Attach or select documents"
              className="inline-flex items-center gap-gutter-xs px-2.5 py-1.5 rounded text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface font-label text-label-md transition-colors duration-state-change disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="material-symbols-outlined text-[18px]" aria-hidden="true">attach_file</span>
              <span>Select Papers ({selectedPapersForChat.length})</span>
            </button>
            <LiquidButton
              type="submit"
              variant="solid"
              size="sm"
              disabled={busy || !inputText.trim()}
            >
              <span>Send</span>
              <span className="material-symbols-outlined text-[16px]" aria-hidden="true">arrow_upward</span>
            </LiquidButton>
          </div>
        </form>
        <p className="font-body text-body-sm text-on-surface-variant text-center">
          Answers are grounded strictly in the {selectedPapersForChat.length} selected documents. Verify critical claims against cited page numbers.
        </p>
      </section>
    </main>
  );
};

