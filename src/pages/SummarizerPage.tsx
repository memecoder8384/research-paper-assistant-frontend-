import React, { useState, useEffect } from 'react';
import { useWorkspace } from '../context/WorkspaceContext';
import { PaperSummary } from '../types';
import { getPaperSummary } from '../services/api';
import { SummarySkeleton } from '../components/common/Skeleton';

export const SummarizerPage: React.FC = () => {
  const { papers, showToast, isProcessing, setIsProcessing } = useWorkspace();
  const [selectedPaperId, setSelectedPaperId] = useState<string>('');
  const [summary, setSummary] = useState<PaperSummary | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const busy = isGenerating || isProcessing;

  useEffect(() => {
    if (papers.length > 0 && (!selectedPaperId || !papers.some(p => p.id === selectedPaperId))) {
      setSelectedPaperId(papers[0].id);
    }
  }, [papers]);

  useEffect(() => {
    if (selectedPaperId) {
      setIsGenerating(true);
      setIsProcessing(true);
      getPaperSummary(selectedPaperId)
        .then(data => {
          setSummary(data);
        })
        .finally(() => {
          setIsGenerating(false);
          setIsProcessing(false);
        });
    }
  }, [selectedPaperId]);

  const handleGenerate = () => {
    if (!selectedPaperId || busy) return;
    setIsGenerating(true);
    setIsProcessing(true);
    showToast('Synthesizing academic brief with Gemini...', 'info');
    getPaperSummary(selectedPaperId)
      .then(data => {
        setSummary(data);
        showToast('Summary generated successfully!', 'success');
      })
      .catch(() => {
        showToast('Failed to generate summary.', 'error');
      })
      .finally(() => {
        setIsGenerating(false);
        setIsProcessing(false);
      });
  };

  const handleCopySummary = () => {
    if (!summary) return;
    const text = `# ${summary.title}
Authors: ${summary.authors}

## Abstract Overview
${summary.abstractOverview}

## Research Objectives
${summary.researchObjectives}

## Problem Statement
${summary.problemStatement}

## Methodology
${summary.methodology}

## Key Findings
${summary.keyFindings.map(f => `- ${f}`).join('\n')}

## Results and Discussion
${summary.resultsAndDiscussion}

## Limitations
${summary.limitations}

## Conclusion
${summary.conclusion}
`;
    navigator.clipboard.writeText(text);
    showToast('Summary copied to clipboard!', 'success');
  };

  const handleExportMarkdown = () => {
    if (!summary) return;
    const text = `# ${summary.title}\n\nAuthors: ${summary.authors}\n\n## Abstract Overview\n${summary.abstractOverview}\n\n## Methodology\n${summary.methodology}\n\n## Key Findings\n${summary.keyFindings.map(f => `- ${f}`).join('\n')}\n\n## Conclusion\n${summary.conclusion}`;
    const blob = new Blob([text], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${summary.filename.replace('.pdf', '')}_summary.md`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Markdown file downloaded.', 'success');
  };

  const currentPaper = papers.find(p => p.id === selectedPaperId) || papers[0];

  return (
    <main className="flex-1 p-gutter-lg lg:p-gutter-xl max-w-[1200px] w-full mx-auto flex flex-col gap-gutter-lg">
      {/* Page Header */}
      <section className="flex flex-col sm:flex-row sm:items-end justify-between gap-gutter-md">
        <div className="flex flex-col gap-gutter-xs">
          <h1 className="font-headline text-headline-lg text-on-surface">Paper Summarizer</h1>
          <p className="font-body text-body-lg text-on-surface-variant">
            Turn lengthy research papers into structured, understandable insights.
          </p>
        </div>
        <div className="flex items-center gap-gutter-sm shrink-0">
          <button
            type="button"
            disabled={busy || !summary}
            onClick={handleCopySummary}
            className="inline-flex items-center gap-gutter-xs px-3 py-2 bg-surface hover:bg-surface-container-low text-on-surface border border-outline-variant rounded font-label text-label-lg transition-colors duration-state-change shadow-2xs disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="material-symbols-outlined text-[18px]" aria-hidden="true">content_copy</span>
            <span>Copy Summary</span>
          </button>
          <button
            type="button"
            disabled={busy || !summary}
            onClick={handleExportMarkdown}
            className="inline-flex items-center gap-gutter-xs px-3 py-2 bg-surface hover:bg-surface-container-low text-on-surface border border-outline-variant rounded font-label text-label-lg transition-colors duration-state-change shadow-2xs disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="material-symbols-outlined text-[18px]" aria-hidden="true">download</span>
            <span>Export Markdown</span>
          </button>
        </div>
      </section>

      {/* Input Selection Bar */}
      <section className="bg-surface border border-outline-variant rounded-md p-gutter-lg flex flex-col lg:flex-row lg:items-end justify-between gap-gutter-md shadow-sm">
        <div className="flex-1 flex flex-col gap-gutter-xs">
          <label htmlFor="summarizer-paper-select" className="font-label text-label-md text-on-surface">
            Select Research Paper
          </label>
          <select
            id="summarizer-paper-select"
            disabled={busy}
            value={selectedPaperId}
            onChange={e => setSelectedPaperId(e.target.value)}
            className="w-full px-3 py-2.5 bg-background border border-outline-variant rounded font-body text-body-md text-on-surface focus:border-primary focus:ring-2 focus:ring-primary-container focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {papers.map(p => (
              <option key={p.id} value={p.id}>
                {p.title} ({p.filename})
              </option>
            ))}
          </select>
          <div className="flex flex-wrap items-center gap-gutter-sm pt-1">
            <span className="font-mono text-mono-sm text-on-surface-variant">
              {currentPaper?.pageCount || 19} pages · {currentPaper?.size || '3.8 MB'}
            </span>
            <span className="text-on-surface-variant">·</span>
            <span className="font-body text-body-sm text-on-surface-variant">
              Authors: {currentPaper?.authors} ({currentPaper?.conference || 'Academic Literature'})
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={handleGenerate}
          disabled={busy}
          className="inline-flex items-center justify-center gap-gutter-sm px-gutter-md py-2.5 bg-primary hover:bg-primary-hover text-on-primary rounded font-label text-label-lg transition-colors duration-state-change shrink-0 shadow-xs disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span className={`material-symbols-outlined text-[18px] ${busy ? 'animate-spin' : ''}`} aria-hidden="true">
            {busy ? 'sync' : 'auto_awesome'}
          </span>
          <span>{busy ? 'Generating...' : 'Generate Summary'}</span>
        </button>
      </section>

      {/* Structured Summary Output or Skeleton Loader */}
      {busy ? (
        <SummarySkeleton />
      ) : summary ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-gutter-lg items-start">
          {/* Main 8-Section Academic Brief (2 columns) */}
          <article className="lg:col-span-2 bg-surface border border-outline-variant rounded-md p-gutter-xl flex flex-col gap-gutter-lg shadow-sm">
            {/* 1. Abstract Overview */}
            <div className="flex flex-col gap-gutter-xs pb-gutter-md border-b border-outline-variant">
              <h2 className="font-headline text-headline-md text-on-surface">Abstract Overview</h2>
              <p className="font-body text-body-lg text-on-surface text-pretty max-w-prose leading-relaxed">
                {summary.abstractOverview}
              </p>
            </div>

            {/* 2 & 3. Research Objectives & Problem Statement */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter-lg pb-gutter-md border-b border-outline-variant">
              <div className="flex flex-col gap-gutter-xs">
                <h3 className="font-headline text-headline-sm text-on-surface">Research Objectives</h3>
                <p className="font-body text-body-md text-on-surface-variant text-pretty leading-relaxed">
                  {summary.researchObjectives}
                </p>
              </div>
              <div className="flex flex-col gap-gutter-xs">
                <h3 className="font-headline text-headline-sm text-on-surface">Problem Statement</h3>
                <p className="font-body text-body-md text-on-surface-variant text-pretty leading-relaxed">
                  {summary.problemStatement}
                </p>
              </div>
            </div>

            {/* 4. Methodology */}
            <div className="flex flex-col gap-gutter-xs pb-gutter-md border-b border-outline-variant">
              <h3 className="font-headline text-headline-sm text-on-surface">Methodology</h3>
              <p className="font-body text-body-md text-on-surface text-pretty max-w-prose leading-relaxed">
                {summary.methodology}
              </p>
            </div>

            {/* 5. Key Findings */}
            <div className="flex flex-col gap-gutter-xs pb-gutter-md border-b border-outline-variant">
              <h3 className="font-headline text-headline-sm text-on-surface">Key Findings</h3>
              <ul className="list-disc pl-5 flex flex-col gap-gutter-xs font-body text-body-md text-on-surface max-w-prose leading-relaxed">
                {summary.keyFindings.map((finding, idx) => (
                  <li key={idx}>{finding}</li>
                ))}
              </ul>
            </div>

            {/* 6. Results and Discussion */}
            <div className="flex flex-col gap-gutter-xs pb-gutter-md border-b border-outline-variant">
              <h3 className="font-headline text-headline-sm text-on-surface">Results and Discussion</h3>
              <p className="font-body text-body-md text-on-surface text-pretty max-w-prose leading-relaxed">
                {summary.resultsAndDiscussion}
              </p>
            </div>

            {/* 7 & 8. Limitations and Conclusion */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter-lg">
              <div className="flex flex-col gap-gutter-xs">
                <h3 className="font-headline text-headline-sm text-on-surface">Limitations</h3>
                <p className="font-body text-body-md text-on-surface-variant text-pretty leading-relaxed">
                  {summary.limitations}
                </p>
              </div>
              <div className="flex flex-col gap-gutter-xs">
                <h3 className="font-headline text-headline-sm text-on-surface">Conclusion</h3>
                <p className="font-body text-body-md text-on-surface-variant text-pretty leading-relaxed">
                  {summary.conclusion}
                </p>
              </div>
            </div>
          </article>

          {/* Right Sidebar: Keywords, Key Insight Cards, Source References */}
          <aside className="flex flex-col gap-gutter-md">
            {/* Keywords */}
            <div className="bg-surface border border-outline-variant rounded-md p-gutter-lg flex flex-col gap-gutter-sm shadow-xs">
              <h3 className="font-headline text-headline-sm text-on-surface">Important Keywords</h3>
              <div className="flex flex-wrap gap-gutter-xs">
                {summary.keywords.map((kw, i) => (
                  <span
                    key={i}
                    className={`px-2.5 py-1 rounded-full font-label text-label-sm ${
                      i === 0
                        ? 'bg-primary-container text-primary font-semibold'
                        : 'bg-surface-container-low border border-outline-variant text-on-surface'
                    }`}
                  >
                    {kw}
                  </span>
                ))}
              </div>
            </div>

            {/* Highlighted Insight Cards */}
            <div className="bg-surface border border-outline-variant rounded-md p-gutter-lg flex flex-col gap-gutter-sm shadow-xs">
              <h3 className="font-headline text-headline-sm text-on-surface">Key Insight Highlights</h3>
              {summary.keyInsights.map((insight, idx) => (
                <div
                  key={idx}
                  className={`rounded p-3 flex flex-col gap-gutter-xs ${
                    insight.variant === 'violet'
                      ? 'bg-accent-violet-container text-on-accent-violet-container'
                      : insight.variant === 'success'
                      ? 'bg-success-container text-on-success-container'
                      : 'bg-primary-container text-primary'
                  }`}
                >
                  <span className="font-label text-label-sm font-semibold">{insight.title}</span>
                  <p className="font-body text-body-sm leading-snug">{insight.description}</p>
                </div>
              ))}
            </div>

            {/* Source References */}
            <div className="bg-surface border border-outline-variant rounded-md p-gutter-lg flex flex-col gap-gutter-sm shadow-xs">
              <h3 className="font-headline text-headline-sm text-on-surface">Source References</h3>
              <ul className="flex flex-col gap-gutter-xs">
                {summary.sourceReferences.map((ref, idx) => (
                  <li
                    key={idx}
                    className={`flex items-center justify-between py-1.5 ${
                      idx !== summary.sourceReferences.length - 1 ? 'border-b border-outline-variant' : ''
                    }`}
                  >
                    <span className="font-body text-body-sm text-on-surface">{ref.section}</span>
                    <span className="px-2 py-0.5 rounded bg-surface-container-low font-mono text-mono-sm text-on-surface-variant">
                      {ref.pages}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      ) : null}
    </main>
  );
};

