import React, { useState } from 'react';
import { useWorkspace } from '../context/WorkspaceContext';
import { LibraryTableSkeleton } from '../components/common/Skeleton';
import { LiquidButton } from '../components/common/LiquidButton';

export const LibraryPage: React.FC = () => {
  const {
    papers,
    setIsUploadModalOpen,
    retryPaperIndexing,
    deletePaper,
    showToast,
    isProcessing,
    isLoadingPapers,
  } = useWorkspace();
  const [activeTab, setActiveTab] = useState<'documents' | 'loading' | 'empty'>('documents');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'title'>('newest');
  const [searchFilter, setSearchFilter] = useState('');
  const [activeMenuPaperId, setActiveMenuPaperId] = useState<string | null>(null);

  const failedPaper = papers.find(p => p.status === 'failed');

  // Filter papers
  const filteredPapers = papers.filter(paper => {
    // category filter
    if (selectedCategory !== 'All' && paper.category !== selectedCategory) {
      return false;
    }
    // status filter
    if (statusFilter !== 'all' && paper.status !== statusFilter) {
      return false;
    }
    // search filter
    if (searchFilter.trim()) {
      const q = searchFilter.toLowerCase();
      return (
        paper.title.toLowerCase().includes(q) ||
        paper.filename.toLowerCase().includes(q) ||
        paper.authors.toLowerCase().includes(q)
      );
    }
    return true;
  }).sort((a, b) => {
    if (sortBy === 'title') {
      return a.title.localeCompare(b.title);
    }
    return 0; // Default order
  });

  const categories = [
    { label: `All Categories (${papers.length})`, val: 'All' },
    { label: 'LLM Reasoning (18)', val: 'LLM Reasoning' },
    { label: 'Retrieval & RAG (14)', val: 'Retrieval & RAG' },
    { label: 'Alignment & Safety (9)', val: 'Alignment & Safety' },
    { label: 'Benchmarks (7)', val: 'Benchmarks' },
  ];

  return (
    <main className="flex-1 p-gutter-lg lg:p-gutter-xl max-w-[1200px] w-full mx-auto flex flex-col gap-gutter-lg">
      {/* Page Header */}
      <section className="flex flex-col sm:flex-row sm:items-end justify-between gap-gutter-md">
        <div className="flex flex-col gap-gutter-xs">
          <h1 className="font-headline text-headline-lg text-on-surface">Research Library</h1>
          <p className="font-body text-body-lg text-on-surface-variant">
            Your central workspace for managing academic literature.
          </p>
        </div>
        <LiquidButton
          type="button"
          variant="solid"
          size="default"
          disabled={isProcessing}
          onClick={() => setIsUploadModalOpen(true)}
        >
          <span className="material-symbols-outlined text-[18px]" aria-hidden="true">upload_file</span>
          <span>Upload Paper</span>
        </LiquidButton>
      </section>

      {/* Compact Drag-and-Drop Upload Section */}
      <section
        aria-label="Upload research papers"
        onClick={() => !isProcessing && setIsUploadModalOpen(true)}
        className={`bg-surface border-2 border-dashed border-outline hover:border-primary rounded-lg p-gutter-lg flex flex-col sm:flex-row items-center justify-between gap-gutter-md transition-colors duration-state-change cursor-pointer group ${
          isProcessing ? 'pointer-events-none opacity-50 cursor-not-allowed' : ''
        }`}
      >
        <div className="flex items-center gap-gutter-md">
          <span className="w-11 h-11 rounded bg-primary-container text-primary flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <span className="material-symbols-outlined text-[22px]" aria-hidden="true">cloud_upload</span>
          </span>
          <div className="flex flex-col gap-gutter-xs">
            <h2 className="font-title text-title-md text-on-surface group-hover:text-primary transition-colors">
              Drop your research papers here.
            </h2>
            <p className="font-body text-body-sm text-on-surface-variant">
              PDF format supported up to 50 MB per file · Automatic text &amp; citation indexing
            </p>
          </div>
        </div>
        <LiquidButton
          type="button"
          variant="default"
          size="default"
          disabled={isProcessing}
        >
          <span>Browse Files</span>
        </LiquidButton>
      </section>

      {/* Search, Filter & State Preview Tabs */}
      <section className="flex flex-col gap-gutter-md">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-gutter-sm">
          {/* Search Input */}
          <div className="relative flex items-center flex-1 max-w-md">
            <span className="material-symbols-outlined text-[18px] text-on-surface-variant absolute left-3 pointer-events-none" aria-hidden="true">
              search
            </span>
            <input
              type="search"
              disabled={isProcessing}
              value={searchFilter}
              onChange={e => setSearchFilter(e.target.value)}
              placeholder="Search papers by title, author or filename..."
              className="w-full pl-9 pr-3 py-2 bg-surface border border-outline-variant rounded font-body text-body-md text-on-surface placeholder:text-on-surface-variant focus:border-primary focus:ring-2 focus:ring-primary-container focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>

          {/* Filter & Sort Controls */}
          <div className="flex flex-wrap items-center gap-gutter-sm">
            <select
              aria-label="Filter by status"
              disabled={isProcessing}
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="px-3 py-2 bg-surface border border-outline-variant rounded font-body text-body-sm text-on-surface focus:border-primary focus:ring-2 focus:ring-primary-container focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <option value="all">Status: All ({papers.length})</option>
              <option value="indexed">Indexed ({papers.filter(p => p.status === 'indexed').length})</option>
              <option value="processing">Processing ({papers.filter(p => p.status === 'processing').length})</option>
              <option value="failed">Failed ({papers.filter(p => p.status === 'failed').length})</option>
            </select>

            <select
              aria-label="Sort papers"
              disabled={isProcessing}
              value={sortBy}
              onChange={e => setSortBy(e.target.value as any)}
              className="px-3 py-2 bg-surface border border-outline-variant rounded font-body text-body-sm text-on-surface focus:border-primary focus:ring-2 focus:ring-primary-container focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <option value="newest">Sort: Upload Date (Newest)</option>
              <option value="title">Sort: Title (A–Z)</option>
            </select>

            {/* View State Switcher (Documents / Loading / Empty preview as in stitch mockup) */}
            <div role="tablist" aria-label="Library state view" className="inline-flex items-center bg-surface-container-low p-1 rounded border border-outline-variant">
              <button
                type="button"
                role="tab"
                disabled={isProcessing}
                onClick={() => setActiveTab('documents')}
                className={`px-2.5 py-1 rounded-sm font-label text-label-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                  activeTab === 'documents'
                    ? 'bg-surface text-on-surface shadow-xs font-semibold'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                Documents
              </button>
              <button
                type="button"
                role="tab"
                disabled={isProcessing}
                onClick={() => setActiveTab('loading')}
                className={`px-2.5 py-1 rounded-sm font-label text-label-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                  activeTab === 'loading'
                    ? 'bg-surface text-on-surface shadow-xs font-semibold'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                Loading
              </button>
              <button
                type="button"
                role="tab"
                disabled={isProcessing}
                onClick={() => setActiveTab('empty')}
                className={`px-2.5 py-1 rounded-sm font-label text-label-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                  activeTab === 'empty'
                    ? 'bg-surface text-on-surface shadow-xs font-semibold'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                Empty
              </button>
            </div>
          </div>
        </div>

        {/* Category Filter Chips */}
        <div className="flex flex-wrap items-center gap-gutter-sm">
          {categories.map(cat => (
            <button
              key={cat.val}
              type="button"
              disabled={isProcessing}
              onClick={() => setSelectedCategory(cat.val)}
              className={`px-3 py-1 rounded-full font-label text-label-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                selectedCategory === cat.val
                  ? 'bg-primary-container text-primary font-semibold'
                  : 'bg-surface border border-outline-variant text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </section>

      {/* Main Panel Content depending on activeTab or loading state */}
      {isLoadingPapers || activeTab === 'loading' ? (
        <section className="flex flex-col gap-gutter-md">
          <LibraryTableSkeleton rows={6} />
        </section>
      ) : activeTab === 'documents' ? (
        <section className="flex flex-col gap-gutter-md">
          {/* Error Notification Banner for Failed Paper (if any) */}
          {failedPaper && (
            <div role="alert" className="bg-error-container border border-outline-variant rounded-md px-gutter-md py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-gutter-sm">
              <div className="flex items-center gap-gutter-sm">
                <span className="material-symbols-outlined text-[18px] text-error shrink-0" aria-hidden="true">error</span>
                <span className="font-body text-body-sm text-on-error-container">
                  <strong>Indexing failed</strong> for <span className="font-mono text-mono-sm">{failedPaper.filename}</span> — {failedPaper.failureReason || 'requires OCR pre-processing.'}
                </span>
              </div>
              <LiquidButton
                type="button"
                variant="default"
                size="sm"
                disabled={isProcessing}
                onClick={() => retryPaperIndexing(failedPaper.id)}
              >
                <span>Retry Indexing</span>
              </LiquidButton>
            </div>
          )}

          {/* Document Table */}
          <div className="bg-surface border border-outline-variant rounded-md overflow-x-auto shadow-xs">
            <table className="w-full text-left border-collapse min-w-[760px]">
              <thead>
                <tr className="bg-surface-container-low border-b border-outline-variant">
                  <th scope="col" className="px-gutter-md py-3 font-label text-label-md text-on-surface-variant">Paper Title</th>
                  <th scope="col" className="px-gutter-md py-3 font-label text-label-md text-on-surface-variant">Filename</th>
                  <th scope="col" className="px-gutter-md py-3 font-label text-label-md text-on-surface-variant">Uploaded</th>
                  <th scope="col" className="px-gutter-md py-3 font-label text-label-md text-on-surface-variant">Size</th>
                  <th scope="col" className="px-gutter-md py-3 font-label text-label-md text-on-surface-variant">Status</th>
                  <th scope="col" className="px-gutter-md py-3 font-label text-label-md text-on-surface-variant text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant">
                {filteredPapers.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-gutter-md py-12 text-center text-on-surface-variant font-body">
                      No research papers found. Click "Upload Paper" above to upload your first academic PDF.
                    </td>
                  </tr>
                ) : (
                  filteredPapers.map(paper => (
                  <tr key={paper.id} className="hover:bg-surface-container-low transition-colors duration-state-change group">
                    <td className="px-gutter-md py-3.5">
                      <div className="flex items-center gap-gutter-sm">
                        <span
                          className={`material-symbols-outlined text-[18px] shrink-0 ${
                            paper.status === 'indexed'
                              ? 'text-primary'
                              : paper.status === 'processing'
                              ? 'text-warning'
                              : 'text-error'
                          }`}
                          aria-hidden="true"
                        >
                          picture_as_pdf
                        </span>
                        <div className="flex flex-col">
                          <span className="font-title text-title-md text-on-surface group-hover:text-primary transition-colors">
                            {paper.title}
                          </span>
                          <span className="text-xs text-on-surface-variant font-body">{paper.authors}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-gutter-md py-3.5 font-mono text-mono-sm text-on-surface-variant">
                      {paper.filename}
                    </td>
                    <td className="px-gutter-md py-3.5 font-body text-body-sm text-on-surface-variant tabular-nums">
                      {paper.uploadedAt}
                    </td>
                    <td className="px-gutter-md py-3.5 font-mono text-mono-sm text-on-surface-variant tabular-nums">
                      {paper.size}
                    </td>
                    <td className="px-gutter-md py-3.5">
                      {paper.status === 'indexed' && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-success-container text-on-success-container font-label text-label-sm">
                          <span className="w-1.5 h-1.5 rounded-full bg-success" aria-hidden="true"></span>
                          <span>Indexed</span>
                        </span>
                      )}
                      {paper.status === 'processing' && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-warning-container text-on-warning-container font-label text-label-sm">
                          <span className="w-1.5 h-1.5 rounded-full bg-warning animate-ping" aria-hidden="true"></span>
                          <span>Processing</span>
                        </span>
                      )}
                      {paper.status === 'failed' && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-error-container text-on-error-container font-label text-label-sm">
                          <span className="w-1.5 h-1.5 rounded-full bg-error" aria-hidden="true"></span>
                          <span>Failed</span>
                        </span>
                      )}
                    </td>
                    <td className="px-gutter-md py-3.5 text-right relative">
                      <button
                        type="button"
                        aria-label="Paper actions"
                        disabled={isProcessing}
                        onClick={() => setActiveMenuPaperId(activeMenuPaperId === paper.id ? null : paper.id)}
                        className="p-1.5 rounded hover:bg-surface-container text-on-surface-variant hover:text-on-surface disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <span className="material-symbols-outlined text-[18px]" aria-hidden="true">more_horiz</span>
                      </button>

                      {/* Dropdown Menu */}
                      {activeMenuPaperId === paper.id && (
                        <div className="absolute right-4 mt-1 w-44 bg-surface border border-outline-variant rounded-md shadow-lg py-1 z-30 text-left">
                          <button
                            onClick={() => {
                              showToast(`Opened abstract for ${paper.title}`, 'info');
                              setActiveMenuPaperId(null);
                            }}
                            className="w-full px-3 py-1.5 text-xs text-on-surface hover:bg-surface-container-low flex items-center gap-2"
                          >
                            <span className="material-symbols-outlined text-[14px]">visibility</span>
                            View Details
                          </button>
                          {paper.status === 'failed' && (
                            <button
                              onClick={() => {
                                retryPaperIndexing(paper.id);
                                setActiveMenuPaperId(null);
                              }}
                              className="w-full px-3 py-1.5 text-xs text-primary hover:bg-surface-container-low flex items-center gap-2"
                            >
                              <span className="material-symbols-outlined text-[14px]">refresh</span>
                              Retry Indexing
                            </button>
                          )}
                          <button
                            onClick={() => {
                              deletePaper(paper.id);
                              setActiveMenuPaperId(null);
                            }}
                            className="w-full px-3 py-1.5 text-xs text-error hover:bg-error-container/50 flex items-center gap-2"
                          >
                            <span className="material-symbols-outlined text-[14px]">delete</span>
                            Remove Paper
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                )))
              }
              </tbody>
            </table>
          </div>
        </section>
      ) : null}

      {/* Empty State Panel */}
      {activeTab === 'empty' && (
        <section className="bg-surface border border-outline-variant rounded-md p-gutter-xl flex flex-col items-center justify-center gap-gutter-md text-center py-16">
          <span className="w-12 h-12 rounded-lg bg-surface-container-low text-on-surface-variant flex items-center justify-center">
            <span className="material-symbols-outlined text-[24px]" aria-hidden="true">library_books</span>
          </span>
          <div className="flex flex-col gap-gutter-xs max-w-md">
            <h2 className="font-headline text-headline-sm text-on-surface">No research papers yet</h2>
            <p className="font-body text-body-sm text-on-surface-variant">
              Upload your first academic PDF to begin indexing, summarizing, and chatting with your literature.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setIsUploadModalOpen(true)}
            className="px-4 py-2 rounded bg-primary text-on-primary font-label text-label-md hover:bg-primary-hover transition-colors"
          >
            Upload Paper
          </button>
        </section>
      )}
    </main>
  );
};

