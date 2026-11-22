import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useWorkspace } from '../context/WorkspaceContext';

export const DashboardPage: React.FC = () => {
  const { papers, stats, setIsUploadModalOpen, backendConnected, isProcessing } = useWorkspace();
  const navigate = useNavigate();

  const recentPapers = papers.slice(0, 4);

  return (
    <main className="flex-1 p-gutter-lg lg:p-gutter-xl max-w-[1200px] w-full mx-auto flex flex-col gap-gutter-xl">
      {/* Welcome Section */}
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-gutter-md">
        <div className="flex flex-col gap-gutter-xs">
          <div className="flex items-center gap-gutter-sm flex-wrap">
            <h1 className="font-headline text-headline-lg text-on-surface">Good morning, Dr. Vance</h1>
            {/* System Status Indicator */}
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-surface border border-outline-variant font-label text-label-sm text-on-surface-variant" role="status">
              <span className={`inline-block w-2 h-2 rounded-full ${backendConnected ? 'bg-success' : 'bg-primary'}`} aria-hidden="true"></span>
              <span>{backendConnected ? 'Backend Live' : 'Frontend Standalone'}</span>
            </span>
          </div>
          <p className="font-body text-body-lg text-on-surface-variant">
            Your research workspace, organized and powered by AI.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-gutter-sm shrink-0">
          <button
            type="button"
            disabled={isProcessing}
            onClick={() => navigate('/chat')}
            className="inline-flex items-center justify-center gap-gutter-sm px-gutter-md py-2.5 bg-surface hover:bg-surface-container-low text-on-surface border border-outline-variant rounded font-label text-label-lg transition-colors duration-state-change disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="material-symbols-outlined text-[18px]" aria-hidden="true">forum</span>
            <span>Start Research Chat</span>
          </button>

          <button
            type="button"
            disabled={isProcessing}
            onClick={() => setIsUploadModalOpen(true)}
            className="inline-flex items-center justify-center gap-gutter-sm px-gutter-md py-2.5 bg-primary hover:bg-primary-hover text-on-primary rounded font-label text-label-lg transition-colors duration-state-change shadow-xs disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="material-symbols-outlined text-[18px]" aria-hidden="true">upload_file</span>
            <span>Upload Research Paper</span>
          </button>
        </div>
      </section>

      {/* Statistics Section (4 Metric Cards) */}
      <section aria-label="Workspace metrics" className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-gutter-md items-stretch">
        {/* Metric 1 */}
        <article className="h-full bg-surface border border-outline-variant rounded-md p-gutter-lg shadow-sm flex flex-col justify-between gap-gutter-sm hover:border-primary/40 transition-colors">
          <header className="flex items-center justify-between gap-gutter-sm">
            <span className="font-label text-label-md text-on-surface-variant">Total Papers Uploaded</span>
            <span className="w-8 h-8 rounded bg-primary-container text-primary flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[18px]" aria-hidden="true">description</span>
            </span>
          </header>
          <div className="flex items-baseline gap-gutter-sm">
            <span className="font-headline text-display-lg text-on-surface tabular-nums">{stats.totalPapers}</span>
            <span className="font-label text-label-md text-on-success-container">+{stats.papersThisWeek} this week</span>
          </div>
          <p className="font-body text-body-sm text-on-surface-variant">Across {stats.activeCollections} active collections</p>
        </article>

        {/* Metric 2 */}
        <article className="h-full bg-surface border border-outline-variant rounded-md p-gutter-lg shadow-sm flex flex-col justify-between gap-gutter-sm hover:border-primary/40 transition-colors">
          <header className="flex items-center justify-between gap-gutter-sm">
            <span className="font-label text-label-md text-on-surface-variant">Indexed Documents</span>
            <span className="w-8 h-8 rounded bg-success-container text-on-success-container flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[18px]" aria-hidden="true">check_circle</span>
            </span>
          </header>
          <div className="flex items-baseline gap-gutter-sm">
            <span className="font-headline text-display-lg text-on-surface tabular-nums">{stats.indexedCount}</span>
            <span className="font-mono text-mono-sm text-on-surface-variant tabular-nums">{stats.indexedPercentage}%</span>
          </div>
          <p className="font-body text-body-sm text-on-surface-variant">
            {stats.processingCount} processing · {stats.failedCount} needs retry
          </p>
        </article>

        {/* Metric 3 */}
        <article className="h-full bg-surface border border-outline-variant rounded-md p-gutter-lg shadow-sm flex flex-col justify-between gap-gutter-sm hover:border-primary/40 transition-colors">
          <header className="flex items-center justify-between gap-gutter-sm">
            <span className="font-label text-label-md text-on-surface-variant">Research Queries</span>
            <span className="w-8 h-8 rounded bg-primary-container text-primary flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[18px]" aria-hidden="true">forum</span>
            </span>
          </header>
          <div className="flex items-baseline gap-gutter-sm">
            <span className="font-headline text-display-lg text-on-surface tabular-nums">{stats.researchQueries}</span>
            <span className="font-label text-label-md text-on-success-container">+{stats.queriesToday} today</span>
          </div>
          <p className="font-body text-body-sm text-on-surface-variant">{stats.citationGroundedPercentage}% citation-grounded</p>
        </article>

        {/* Metric 4 */}
        <article className="h-full bg-surface border border-outline-variant rounded-md p-gutter-lg shadow-sm flex flex-col justify-between gap-gutter-sm hover:border-primary/40 transition-colors">
          <header className="flex items-center justify-between gap-gutter-sm">
            <span className="font-label text-label-md text-on-surface-variant">Summaries Generated</span>
            <span className="w-8 h-8 rounded bg-accent-violet-container text-on-accent-violet-container flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[18px]" aria-hidden="true">auto_awesome</span>
            </span>
          </header>
          <div className="flex items-baseline gap-gutter-sm">
            <span className="font-headline text-display-lg text-on-surface tabular-nums">{stats.summariesGenerated}</span>
            <span className="font-label text-label-md text-on-surface-variant">12 briefs</span>
          </div>
          <p className="font-body text-body-sm text-on-surface-variant">Structured 8-part analyses</p>
        </article>
      </section>

      {/* Main Content Split: Recent Research Papers + Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-gutter-lg items-start">
        {/* Recent Research Papers (2 columns) */}
        <section className="lg:col-span-2 flex flex-col gap-gutter-md">
          <div className="flex items-center justify-between">
            <h2 className="font-headline text-headline-md text-on-surface">Recent Research Papers</h2>
            <Link
              to="/library"
              className="font-label text-label-lg text-primary hover:text-primary-hover transition-colors duration-state-change"
            >
              View all papers
            </Link>
          </div>

          <div className="flex flex-col gap-gutter-sm">
            {recentPapers.map((paper) => {
              const isProcessing = paper.status === 'processing';
              const isFailed = paper.status === 'failed';

              return (
                <article
                  key={paper.id}
                  className="bg-surface border border-outline-variant rounded-md p-gutter-md flex flex-col sm:flex-row sm:items-center justify-between gap-gutter-md hover:border-primary/30 transition-colors"
                >
                  <div className="flex items-start gap-gutter-md min-w-0">
                    <span
                      className={`w-10 h-10 rounded flex items-center justify-center shrink-0 mt-0.5 ${
                        isProcessing
                          ? 'bg-warning-container text-on-warning-container'
                          : isFailed
                          ? 'bg-error-container text-error'
                          : 'bg-primary-container text-primary'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[20px]" aria-hidden="true">
                        {isProcessing ? 'hourglass_top' : isFailed ? 'error' : 'picture_as_pdf'}
                      </span>
                    </span>
                    <div className="flex flex-col gap-gutter-xs min-w-0">
                      <h3 className="font-title text-title-md text-on-surface truncate">{paper.title}</h3>
                      <div className="flex flex-wrap items-center gap-gutter-sm">
                        <span className="font-mono text-mono-sm text-on-surface-variant">
                          {paper.filename} · {paper.size}
                        </span>
                        <span className="text-on-surface-variant">·</span>
                        <span className="font-body text-body-sm text-on-surface-variant">
                          Uploaded {paper.uploadedAt}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-gutter-sm shrink-0">
                    {paper.status === 'indexed' && (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-success-container text-on-success-container font-label text-label-sm">
                        <span className="w-1.5 h-1.5 rounded-full bg-success" aria-hidden="true"></span>
                        <span>Indexed</span>
                      </span>
                    )}
                    {paper.status === 'processing' && (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-warning-container text-on-warning-container font-label text-label-sm">
                        <span className="w-1.5 h-1.5 rounded-full bg-warning" aria-hidden="true"></span>
                        <span>Processing</span>
                      </span>
                    )}
                    {paper.status === 'failed' && (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-error-container text-on-error-container font-label text-label-sm">
                        <span className="w-1.5 h-1.5 rounded-full bg-error" aria-hidden="true"></span>
                        <span>Failed</span>
                      </span>
                    )}

                    {paper.status === 'indexed' ? (
                      <>
                        <button
                          type="button"
                          disabled={isProcessing}
                          onClick={() => navigate('/summarizer')}
                          className="px-2.5 py-1.5 rounded hover:bg-surface-container-low text-on-surface-variant hover:text-on-surface font-label text-label-md transition-colors duration-state-change disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Summarize
                        </button>
                        <button
                          type="button"
                          disabled={isProcessing}
                          onClick={() => navigate('/chat')}
                          className="px-2.5 py-1.5 rounded bg-primary-container text-primary hover:bg-primary hover:text-on-primary font-label text-label-md transition-colors duration-state-change disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Chat
                        </button>
                      </>
                    ) : paper.status === 'processing' ? (
                      <button
                        type="button"
                        disabled
                        className="px-2.5 py-1.5 rounded text-on-surface-variant font-label text-label-md cursor-not-allowed opacity-50"
                      >
                        Indexing...
                      </button>
                    ) : (
                      <button
                        type="button"
                        disabled={isProcessing}
                        onClick={() => navigate('/library')}
                        className="px-2.5 py-1.5 rounded text-error hover:bg-error-container font-label text-label-md disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Details
                      </button>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        {/* Quick Actions (1 column) */}
        <section className="flex flex-col gap-gutter-md">
          <h2 className="font-headline text-headline-md text-on-surface">Quick Actions</h2>
          <div className="flex flex-col gap-gutter-sm">
            <Link
              to="/chat"
              className="group bg-surface border border-outline-variant hover:border-primary rounded-md p-gutter-md flex items-start gap-gutter-md transition-colors duration-state-change shadow-xs"
            >
              <span className="w-10 h-10 rounded bg-primary-container text-primary flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <span className="material-symbols-outlined text-[20px]" aria-hidden="true">forum</span>
              </span>
              <div className="flex flex-col gap-gutter-xs">
                <h3 className="font-title text-title-md text-on-surface group-hover:text-primary transition-colors">
                  Chat with Research
                </h3>
                <p className="font-body text-body-sm text-on-surface-variant">
                  Query indexed PDFs with inline page citations.
                </p>
              </div>
            </Link>

            <Link
              to="/summarizer"
              className="group bg-surface border border-outline-variant hover:border-primary rounded-md p-gutter-md flex items-start gap-gutter-md transition-colors duration-state-change shadow-xs"
            >
              <span className="w-10 h-10 rounded bg-accent-violet-container text-on-accent-violet-container flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <span className="material-symbols-outlined text-[20px]" aria-hidden="true">summarize</span>
              </span>
              <div className="flex flex-col gap-gutter-xs">
                <h3 className="font-title text-title-md text-on-surface group-hover:text-primary transition-colors">
                  Generate Summary
                </h3>
                <p className="font-body text-body-sm text-on-surface-variant">
                  Extract methodology, findings, and limitations.
                </p>
              </div>
            </Link>

            <Link
              to="/comparison"
              className="group bg-surface border border-outline-variant hover:border-primary rounded-md p-gutter-md flex items-start gap-gutter-md transition-colors duration-state-change shadow-xs"
            >
              <span className="w-10 h-10 rounded bg-primary-container text-primary flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <span className="material-symbols-outlined text-[20px]" aria-hidden="true">compare_arrows</span>
              </span>
              <div className="flex flex-col gap-gutter-xs">
                <h3 className="font-title text-title-md text-on-surface group-hover:text-primary transition-colors">
                  Compare Papers
                </h3>
                <p className="font-body text-body-sm text-on-surface-variant">
                  Side-by-side matrix of datasets and outcomes.
                </p>
              </div>
            </Link>

            <Link
              to="/gap-analyzer"
              className="group bg-surface border border-outline-variant hover:border-primary rounded-md p-gutter-md flex items-start gap-gutter-md transition-colors duration-state-change shadow-xs"
            >
              <span className="w-10 h-10 rounded bg-accent-violet-container text-on-accent-violet-container flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <span className="material-symbols-outlined text-[20px]" aria-hidden="true">troubleshoot</span>
              </span>
              <div className="flex flex-col gap-gutter-xs">
                <h3 className="font-title text-title-md text-on-surface group-hover:text-primary transition-colors">
                  Discover Research Gaps
                </h3>
                <p className="font-body text-body-sm text-on-surface-variant">
                  Identify underexplored topics across your corpus.
                </p>
              </div>
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
};

