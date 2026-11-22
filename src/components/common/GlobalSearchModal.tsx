import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWorkspace } from '../../context/WorkspaceContext';

export const GlobalSearchModal: React.FC = () => {
  const { isSearchModalOpen, setIsSearchModalOpen, papers } = useWorkspace();
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchModalOpen(!isSearchModalOpen);
      }
      if (e.key === 'Escape' && isSearchModalOpen) {
        setIsSearchModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSearchModalOpen, setIsSearchModalOpen]);

  useEffect(() => {
    if (isSearchModalOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isSearchModalOpen]);

  if (!isSearchModalOpen) return null;

  const filteredPapers = query.trim()
    ? papers.filter(
        p =>
          p.title.toLowerCase().includes(query.toLowerCase()) ||
          p.filename.toLowerCase().includes(query.toLowerCase()) ||
          p.authors.toLowerCase().includes(query.toLowerCase()) ||
          p.category.toLowerCase().includes(query.toLowerCase())
      )
    : papers.slice(0, 4);

  const quickLinks = [
    { label: 'AI Research Chat', path: '/chat', icon: 'forum' },
    { label: 'Paper Summarizer', path: '/summarizer', icon: 'summarize' },
    { label: 'Paper Comparison', path: '/comparison', icon: 'compare_arrows' },
    { label: 'Research Gap Analyzer', path: '/gap-analyzer', icon: 'troubleshoot' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
        onClick={() => setIsSearchModalOpen(false)}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-2xl bg-surface border border-outline-variant rounded-xl shadow-2xl overflow-hidden z-10 flex flex-col animate-in fade-in zoom-in-95 duration-150">
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-outline-variant gap-3 bg-surface">
          <span className="material-symbols-outlined text-[20px] text-on-surface-variant">search</span>
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search papers, authors, citations, or workspace tools..."
            className="flex-1 bg-transparent border-0 font-body text-body-md text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:ring-0"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 rounded text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low"
            >
              <span className="material-symbols-outlined text-[16px]">close</span>
            </button>
          )}
          <kbd className="hidden sm:inline-block font-mono text-mono-sm text-on-surface-variant bg-surface-container-low px-1.5 py-0.5 rounded border border-outline-variant">
            ESC
          </kbd>
        </div>

        {/* Results Body */}
        <div className="max-h-[60vh] overflow-y-auto p-3 flex flex-col gap-4">
          {/* Quick Actions / Navigation */}
          {!query && (
            <div>
              <div className="px-3 py-1 font-label text-label-sm text-on-surface-variant uppercase tracking-wider">
                Quick Navigation
              </div>
              <div className="grid grid-cols-2 gap-1.5 mt-1">
                {quickLinks.map(link => (
                  <button
                    key={link.path}
                    onClick={() => {
                      navigate(link.path);
                      setIsSearchModalOpen(false);
                    }}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-md hover:bg-surface-container-low text-left transition-colors"
                  >
                    <span className="material-symbols-outlined text-[18px] text-primary">{link.icon}</span>
                    <span className="font-label text-label-md text-on-surface">{link.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Papers */}
          <div>
            <div className="px-3 py-1 font-label text-label-sm text-on-surface-variant uppercase tracking-wider">
              {query ? `Matching Papers (${filteredPapers.length})` : 'Recent Papers'}
            </div>
            {filteredPapers.length === 0 ? (
              <div className="p-6 text-center text-on-surface-variant font-body text-body-sm">
                No papers found matching "{query}".
              </div>
            ) : (
              <div className="flex flex-col gap-1 mt-1">
                {filteredPapers.map(paper => (
                  <div
                    key={paper.id}
                    onClick={() => {
                      navigate('/library');
                      setIsSearchModalOpen(false);
                    }}
                    className="flex items-center justify-between p-2.5 rounded-md hover:bg-surface-container-low cursor-pointer transition-colors group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="w-8 h-8 rounded bg-primary-container text-primary flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined text-[18px]">picture_as_pdf</span>
                      </span>
                      <div className="flex flex-col min-w-0">
                        <span className="font-title text-title-md text-on-surface truncate group-hover:text-primary transition-colors">
                          {paper.title}
                        </span>
                        <div className="flex items-center gap-2 text-xs text-on-surface-variant">
                          <span>{paper.authors}</span>
                          <span>·</span>
                          <span className="font-mono">{paper.filename}</span>
                        </div>
                      </div>
                    </div>
                    <span className="font-label text-label-sm px-2 py-0.5 rounded-full bg-surface border border-outline-variant text-on-surface-variant shrink-0 ml-2">
                      {paper.category}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-4 py-2 bg-surface-container-low border-t border-outline-variant flex items-center justify-between text-xs text-on-surface-variant">
          <span className="flex items-center gap-1">
            Navigate with <kbd className="font-mono bg-surface px-1 rounded border border-outline-variant">↑</kbd> <kbd className="font-mono bg-surface px-1 rounded border border-outline-variant">↓</kbd>
          </span>
          <span>Academic AI Research Workspace</span>
        </div>
      </div>
    </div>
  );
};

