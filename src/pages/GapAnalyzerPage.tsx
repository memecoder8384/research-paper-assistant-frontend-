import React, { useState, useEffect } from 'react';
import { useWorkspace } from '../context/WorkspaceContext';
import { ResearchGap, ThematicCoverage } from '../types';
import { getResearchGaps } from '../services/api';

export const GapAnalyzerPage: React.FC = () => {
  const { papers, showToast } = useWorkspace();
  const [gaps, setGaps] = useState<ResearchGap[]>([]);
  const [thematic, setThematic] = useState<ThematicCoverage[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [filterTag, setFilterTag] = useState<string>('All');
  const [showCorpusEditor, setShowCorpusEditor] = useState(false);
  const [selectedCorpusIds, setSelectedCorpusIds] = useState<string[]>([
    'paper-1',
    'paper-2',
    'paper-4',
    'paper-3',
  ]);

  useEffect(() => {
    getResearchGaps().then(data => {
      setGaps(data.gaps);
      setThematic(data.thematic);
    });
  }, []);

  const handleAnalyze = () => {
    setIsAnalyzing(true);
    showToast('Synthesizing cross-paper corpus for underexplored gaps...', 'info');
    getResearchGaps(selectedCorpusIds)
      .then(data => {
        setGaps(data.gaps);
        setThematic(data.thematic);
        showToast('Gap analysis complete!', 'success');
      })
      .catch(() => {
        showToast('Gap analysis failed.', 'error');
      })
      .finally(() => {
        setIsAnalyzing(false);
      });
  };

  const filteredGaps = filterTag === 'All' ? gaps : gaps.filter(g => g.tag === filterTag);

  const selectedCorpusPapers = papers.filter(p => selectedCorpusIds.includes(p.id));

  return (
    <main className="flex-1 p-gutter-lg lg:p-gutter-xl max-w-[1200px] w-full mx-auto flex flex-col gap-gutter-lg">
      {/* Page Header */}
      <section className="flex flex-col sm:flex-row sm:items-end justify-between gap-gutter-md">
        <div className="flex flex-col gap-gutter-xs">
          <h1 className="font-headline text-headline-lg text-on-surface">Research Gap Analyzer</h1>
          <p className="font-body text-body-lg text-on-surface-variant">
            Discover unexplored research opportunities through AI-powered literature analysis.
          </p>
        </div>
        <button
          type="button"
          onClick={handleAnalyze}
          disabled={isAnalyzing}
          className="inline-flex items-center justify-center gap-gutter-sm px-gutter-md py-2.5 bg-primary hover:bg-primary-hover text-on-primary rounded font-label text-label-lg transition-colors duration-state-change shrink-0 shadow-xs"
        >
          <span className={`material-symbols-outlined text-[18px] ${isAnalyzing ? 'animate-spin' : ''}`} aria-hidden="true">
            {isAnalyzing ? 'sync' : 'troubleshoot'}
          </span>
          <span>{isAnalyzing ? 'Analyzing Corpus...' : 'Analyze Research Gaps'}</span>
        </button>
      </section>

      {/* Multi-Document Selection Bar */}
      <section className="bg-surface border border-outline-variant rounded-md p-gutter-md flex flex-col sm:flex-row sm:items-center justify-between gap-gutter-md shadow-2xs">
        <div className="flex flex-wrap items-center gap-gutter-xs">
          <span className="font-label text-label-md text-on-surface-variant mr-1">
            Selected Corpus ({selectedCorpusPapers.length}):
          </span>
          {selectedCorpusPapers.map(p => (
            <span
              key={p.id}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-primary-container text-primary font-label text-label-sm"
            >
              <span>{p.authors.split(',')[0]} ({p.year})</span>
            </span>
          ))}
        </div>
        <button
          type="button"
          onClick={() => setShowCorpusEditor(!showCorpusEditor)}
          className="inline-flex items-center gap-gutter-xs px-3 py-1.5 rounded border border-outline-variant hover:bg-surface-container-low font-label text-label-md text-on-surface shrink-0 transition-colors"
        >
          <span className="material-symbols-outlined text-[16px]" aria-hidden="true">tune</span>
          <span>Edit Selection</span>
        </button>
      </section>

      {/* Corpus Editor Drawer / Modal */}
      {showCorpusEditor && (
        <div className="bg-surface border border-primary/30 rounded-md p-4 flex flex-col gap-3 animate-in fade-in">
          <span className="font-headline text-headline-sm text-on-surface text-sm">Select Papers Included in Corpus:</span>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
            {papers.map(p => {
              const isChecked = selectedCorpusIds.includes(p.id);
              return (
                <label key={p.id} className="flex items-center gap-2 p-2 rounded bg-surface-container-low/50 cursor-pointer text-xs">
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => {
                      if (isChecked) {
                        setSelectedCorpusIds(prev => prev.filter(id => id !== p.id));
                      } else {
                        setSelectedCorpusIds(prev => [...prev, p.id]);
                      }
                    }}
                    className="rounded text-primary focus:ring-primary"
                  />
                  <span className="truncate text-on-surface font-body">{p.title}</span>
                </label>
              );
            })}
          </div>
          <div className="flex justify-end">
            <button
              onClick={() => setShowCorpusEditor(false)}
              className="px-3 py-1 bg-primary text-on-primary rounded text-xs font-label"
            >
              Done
            </button>
          </div>
        </div>
      )}

      {/* Thematic Coverage & Synthesis Overview */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-gutter-lg items-stretch">
        {/* Identified Research Themes Chart */}
        <article className="bg-surface border border-outline-variant rounded-md p-gutter-lg flex flex-col gap-gutter-md shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="font-headline text-headline-sm text-on-surface">Identified Research Themes</h2>
            <span className="font-mono text-mono-sm text-on-surface-variant">Coverage across {selectedCorpusPapers.length} papers</span>
          </div>
          <div className="flex flex-col gap-gutter-md">
            {thematic.map((item, idx) => (
              <div key={idx} className="flex flex-col gap-gutter-xs">
                <div className="flex items-center justify-between">
                  <span className="font-body text-body-sm text-on-surface">{item.theme}</span>
                  <span className="font-mono text-mono-sm text-on-surface-variant tabular-nums">{item.percentage}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-surface-container-low overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      item.variant === 'violet'
                        ? 'bg-accent-violet'
                        : item.variant === 'warning'
                        ? 'bg-warning'
                        : 'bg-primary'
                    }`}
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </article>

        {/* Commonly Explored vs Underexplored Summary */}
        <article className="bg-surface border border-outline-variant rounded-md p-gutter-lg flex flex-col gap-gutter-md shadow-sm">
          <h2 className="font-headline text-headline-sm text-on-surface">Literature Synthesis</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-gutter-md flex-1">
            <div className="bg-background rounded p-gutter-md flex flex-col gap-gutter-xs border border-outline-variant/40">
              <span className="font-label text-label-md text-on-success-container font-semibold">Commonly Explored</span>
              <ul className="list-disc pl-4 flex flex-col gap-gutter-xs font-body text-body-sm text-on-surface-variant">
                <li>Single-hop English Wikipedia QA</li>
                <li>Static top-K passage retrieval</li>
                <li>Few-shot arithmetic prompting</li>
                <li>Post-hoc reward modeling</li>
              </ul>
            </div>
            <div className="bg-background rounded p-gutter-md flex flex-col gap-gutter-xs border border-outline-variant/40">
              <span className="font-label text-label-md text-on-accent-violet-container font-semibold">Underexplored Topics</span>
              <ul className="list-disc pl-4 flex flex-col gap-gutter-xs font-body text-body-sm text-on-surface-variant">
                <li>Dynamic retrieval during reasoning</li>
                <li>Conflicting evidence resolution</li>
                <li>Multilingual citation fidelity</li>
                <li>Parametric prior unlearning</li>
              </ul>
            </div>
          </div>
        </article>
      </section>

      {/* Research Gap Cards */}
      <section className="flex flex-col gap-gutter-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-gutter-sm">
          <h2 className="font-headline text-headline-md text-on-surface">Potential Research Gaps &amp; Future Directions</h2>
          {/* Tag filter */}
          <div className="flex flex-wrap items-center gap-1.5">
            {['All', 'Underexplored Topic', 'Contradictory Findings', 'Methodological Limitation', 'Cross-Lingual Gap'].map(tag => (
              <button
                key={tag}
                onClick={() => setFilterTag(tag)}
                className={`px-2.5 py-0.5 rounded-full text-xs font-label transition-colors ${
                  filterTag === tag
                    ? 'bg-primary-container text-primary font-semibold'
                    : 'bg-surface border border-outline-variant text-on-surface-variant hover:text-on-surface'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter-md items-stretch">
          {filteredGaps.map(gap => {
            const badgeClasses = {
              violet: 'bg-accent-violet-container text-on-accent-violet-container',
              warning: 'bg-warning-container text-on-warning-container',
              error: 'bg-error-container text-on-error-container',
              primary: 'bg-primary-container text-primary',
            }[gap.tagVariant];

            return (
              <article
                key={gap.id}
                className="bg-surface border border-outline-variant rounded-md p-gutter-lg flex flex-col justify-between gap-gutter-md shadow-sm hover:border-primary/40 transition-colors"
              >
                <div className="flex flex-col gap-gutter-sm">
                  <div className="flex items-center justify-between gap-gutter-sm flex-wrap">
                    <span className={`px-2.5 py-0.5 rounded-full font-label text-label-sm font-semibold ${badgeClasses}`}>
                      {gap.tag}
                    </span>
                    <span className="font-mono text-mono-sm text-on-surface-variant">{gap.citationSources}</span>
                  </div>
                  <h3 className="font-title text-title-md text-on-surface leading-snug">{gap.title}</h3>
                  <p className="font-body text-body-sm text-on-surface-variant text-pretty leading-relaxed">
                    {gap.summary}
                  </p>
                  <div className="bg-background rounded p-3 flex flex-col gap-gutter-xs border border-outline-variant/40">
                    <span className="font-label text-label-sm text-on-surface font-semibold">Why This Matters</span>
                    <p className="font-body text-body-sm text-on-surface-variant leading-relaxed">
                      {gap.whyThisMatters}
                    </p>
                  </div>
                </div>
                <div className="pt-gutter-sm border-t border-outline-variant flex flex-col gap-gutter-xs">
                  <span className="font-label text-label-sm text-primary font-semibold">Suggested Future Direction</span>
                  <p className="font-body text-body-sm text-on-surface leading-relaxed">
                    {gap.suggestedFutureDirection}
                  </p>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </main>
  );
};

