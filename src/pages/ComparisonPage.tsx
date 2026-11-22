import React, { useState, useEffect } from 'react';
import { useWorkspace } from '../context/WorkspaceContext';
import { ComparisonData } from '../types';
import { getComparisonData } from '../services/api';
import { ComparisonSkeleton } from '../components/common/Skeleton';
import { LiquidButton } from '../components/common/LiquidButton';

export const ComparisonPage: React.FC = () => {
  const { papers, showToast, isProcessing, setIsProcessing } = useWorkspace();
  const [paperAId, setPaperAId] = useState<string>('');
  const [paperBId, setPaperBId] = useState<string>('');
  const [paperCId, setPaperCId] = useState<string | null>(null);
  const [comparison, setComparison] = useState<ComparisonData | null>(null);
  const [isComparing, setIsComparing] = useState(false);
  const [selectingSlot, setSelectingSlot] = useState<'A' | 'B' | 'C' | null>(null);

  const busy = isComparing || isProcessing;

  useEffect(() => {
    if (papers.length >= 2) {
      if (!paperAId || !papers.some(p => p.id === paperAId)) {
        setPaperAId(papers[0].id);
      }
      if (!paperBId || !papers.some(p => p.id === paperBId)) {
        setPaperBId(papers[1].id);
      }
    } else if (papers.length === 1) {
      if (!paperAId || !papers.some(p => p.id === paperAId)) {
        setPaperAId(papers[0].id);
      }
    }
  }, [papers]);

  useEffect(() => {
    if (paperAId && paperBId) {
      getComparisonData(paperAId, paperBId).then(data => {
        setComparison(data);
      });
    }
  }, [paperAId, paperBId]);

  const handleRunComparison = () => {
    if (busy) return;
    setIsComparing(true);
    setIsProcessing(true);
    showToast('Calculating comparison matrix across papers...', 'info');
    getComparisonData(paperAId, paperBId)
      .then(data => {
        setComparison(data);
        showToast('Comparison matrix updated!', 'success');
      })
      .catch(() => {
        showToast('Comparison failed.', 'error');
      })
      .finally(() => {
        setIsComparing(false);
        setIsProcessing(false);
      });
  };

  const paperA = papers.find(p => p.id === paperAId) || papers[1];
  const paperB = papers.find(p => p.id === paperBId) || papers[0];
  const paperC = papers.find(p => p.id === paperCId);

  const handleSelectPaperForSlot = (paperId: string) => {
    if (selectingSlot === 'A') setPaperAId(paperId);
    if (selectingSlot === 'B') setPaperBId(paperId);
    if (selectingSlot === 'C') setPaperCId(paperId);
    setSelectingSlot(null);
  };

  return (
    <main className="flex-1 p-gutter-lg lg:p-gutter-xl max-w-[1200px] w-full mx-auto flex flex-col gap-gutter-lg">
      {/* Page Header */}
      <section className="flex flex-col sm:flex-row sm:items-end justify-between gap-gutter-md">
        <div className="flex flex-col gap-gutter-xs">
          <h1 className="font-headline text-headline-lg text-on-surface">Paper Comparison</h1>
          <p className="font-body text-body-lg text-on-surface-variant">
            Understand similarities, differences, and research outcomes across multiple papers.
          </p>
        </div>
        <LiquidButton
          type="button"
          variant="solid"
          size="default"
          onClick={handleRunComparison}
          disabled={busy}
        >
          <span className={`material-symbols-outlined text-[18px] ${busy ? 'animate-spin' : ''}`} aria-hidden="true">
            {busy ? 'sync' : 'compare_arrows'}
          </span>
          <span>{busy ? 'Comparing...' : 'Compare Papers'}</span>
        </LiquidButton>
      </section>

      {/* Paper Selection Cards */}
      <section aria-label="Selected papers for comparison" className="grid grid-cols-1 md:grid-cols-3 gap-gutter-md items-stretch">
        {/* Paper A */}
        <article className="bg-surface border border-outline-variant rounded-md p-gutter-md flex flex-col justify-between gap-gutter-sm shadow-xs">
          <div className="flex items-start justify-between gap-gutter-sm">
            <span className="px-2 py-0.5 rounded bg-primary-container text-primary font-label text-label-sm font-semibold">
              Paper A
            </span>
            <button
              type="button"
              disabled={busy}
              onClick={() => setSelectingSlot('A')}
              className="text-xs text-primary hover:underline font-label flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="material-symbols-outlined text-[14px]">swap_horiz</span> Change
            </button>
          </div>
          <div className="flex flex-col gap-gutter-xs">
            <h2 className="font-title text-title-md text-on-surface line-clamp-2">{paperA?.title}</h2>
            <p className="font-mono text-mono-sm text-on-surface-variant truncate">
              {paperA?.authors} · {paperA?.conference || paperA?.year}
            </p>
          </div>
        </article>

        {/* Paper B */}
        <article className="bg-surface border border-outline-variant rounded-md p-gutter-md flex flex-col justify-between gap-gutter-sm shadow-xs">
          <div className="flex items-start justify-between gap-gutter-sm">
            <span className="px-2 py-0.5 rounded bg-accent-violet-container text-on-accent-violet-container font-label text-label-sm font-semibold">
              Paper B
            </span>
            <button
              type="button"
              disabled={busy}
              onClick={() => setSelectingSlot('B')}
              className="text-xs text-primary hover:underline font-label flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="material-symbols-outlined text-[14px]">swap_horiz</span> Change
            </button>
          </div>
          <div className="flex flex-col gap-gutter-xs">
            <h2 className="font-title text-title-md text-on-surface line-clamp-2">{paperB?.title}</h2>
            <p className="font-mono text-mono-sm text-on-surface-variant truncate">
              {paperB?.authors} · {paperB?.conference || paperB?.year}
            </p>
          </div>
        </article>

        {/* Paper C or Add Paper Slot */}
        {paperC ? (
          <article className="bg-surface border border-outline-variant rounded-md p-gutter-md flex flex-col justify-between gap-gutter-sm shadow-xs">
            <div className="flex items-start justify-between gap-gutter-sm">
              <span className="px-2 py-0.5 rounded bg-success-container text-on-success-container font-label text-label-sm font-semibold">
                Paper C
              </span>
              <button
                type="button"
                disabled={busy}
                aria-label="Remove Paper C"
                onClick={() => setPaperCId(null)}
                className="text-on-surface-variant hover:text-on-surface disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="material-symbols-outlined text-[18px]" aria-hidden="true">close</span>
              </button>
            </div>
            <div className="flex flex-col gap-gutter-xs">
              <h2 className="font-title text-title-md text-on-surface line-clamp-2">{paperC?.title}</h2>
              <p className="font-mono text-mono-sm text-on-surface-variant truncate">
                {paperC?.authors} · {paperC?.conference || paperC?.year}
              </p>
            </div>
          </article>
        ) : (
          <button
            type="button"
            disabled={busy}
            onClick={() => setSelectingSlot('C')}
            className="border-2 border-dashed border-outline hover:border-primary rounded-md p-gutter-md flex flex-col items-center justify-center gap-gutter-xs text-on-surface-variant hover:text-primary transition-colors duration-state-change min-h-[112px] group disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="material-symbols-outlined text-[22px] group-hover:scale-110 transition-transform" aria-hidden="true">
              add_circle
            </span>
            <span className="font-label text-label-lg">Add Paper to Compare</span>
          </button>
        )}
      </section>

      {/* Paper Slot Selector Modal */}
      {selectingSlot && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/40 backdrop-blur-xs" onClick={() => !busy && setSelectingSlot(null)} />
          <div className="relative w-full max-w-md bg-surface border border-outline-variant rounded-xl shadow-2xl p-4 z-10 flex flex-col gap-3">
            <div className="flex items-center justify-between border-b border-outline-variant pb-2">
              <span className="font-headline text-headline-sm text-on-surface">Select Paper for Slot {selectingSlot}</span>
              <button disabled={busy} onClick={() => setSelectingSlot(null)} className="p-1 text-on-surface-variant hover:text-on-surface disabled:opacity-50">
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>
            <div className="max-h-60 overflow-y-auto flex flex-col gap-1.5">
              {papers.map(p => (
                <button
                  key={p.id}
                  disabled={busy}
                  onClick={() => handleSelectPaperForSlot(p.id)}
                  className="p-2 rounded text-left hover:bg-surface-container-low transition-colors flex flex-col gap-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="font-title text-title-md text-on-surface truncate">{p.title}</span>
                  <span className="text-xs text-on-surface-variant">{p.authors} · {p.year}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* AI-Generated Comparison Overview or Skeleton Loader */}
      {busy ? (
        <ComparisonSkeleton />
      ) : comparison ? (
        <div className="flex flex-col gap-gutter-lg animate-slide-up">
          <section className="bg-surface border border-outline-variant rounded-md p-gutter-lg flex flex-col gap-gutter-md shadow-sm">
            <div className="flex items-center gap-gutter-sm">
              <span className="w-7 h-7 rounded bg-primary-container text-primary flex items-center justify-center">
                <span className="material-symbols-outlined text-[16px]" aria-hidden="true">auto_awesome</span>
              </span>
              <h2 className="font-headline text-headline-sm text-on-surface">AI Comparison Overview</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter-lg">
              <div className="bg-background rounded p-gutter-md flex flex-col gap-gutter-xs border border-outline-variant/50">
                <span className="font-label text-label-md text-on-success-container font-semibold">Core Similarities</span>
                <p className="font-body text-body-sm text-on-surface text-pretty leading-relaxed">
                  {comparison.coreSimilarities}
                </p>
              </div>
              <div className="bg-background rounded p-gutter-md flex flex-col gap-gutter-xs border border-outline-variant/50">
                <span className="font-label text-label-md text-primary font-semibold">Key Architectural Differences</span>
                <p className="font-body text-body-sm text-on-surface text-pretty leading-relaxed">
                  {comparison.architecturalDifferences}
                </p>
              </div>
            </div>
          </section>

          {/* Comparison Matrix Table */}
          <section className="bg-surface border border-outline-variant rounded-md overflow-x-auto shadow-sm">
            <table className="w-full text-left border-collapse min-w-[760px]">
              <thead>
                <tr className="bg-surface-container-low border-b border-outline-variant">
                  <th scope="col" className="w-48 px-gutter-md py-3.5 font-label text-label-md text-on-surface-variant">
                    Parameter
                  </th>
                  <th scope="col" className="px-gutter-md py-3.5 font-label text-label-md text-primary">
                    Paper A — {paperA?.authors.split(',')[0]} ({paperA?.year})
                  </th>
                  <th scope="col" className="px-gutter-md py-3.5 font-label text-label-md text-on-accent-violet-container">
                    Paper B — {paperB?.authors.split(',')[0]} ({paperB?.year})
                  </th>
                  {paperC && (
                    <th scope="col" className="px-gutter-md py-3.5 font-label text-label-md text-on-success-container">
                      Paper C — {paperC?.authors.split(',')[0]} ({paperC?.year})
                    </th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant">
                {comparison.matrixRows.map((row, idx) => (
                  <tr
                    key={idx}
                    className={`transition-colors duration-state-change ${
                      idx % 2 === 1 ? 'bg-background hover:bg-surface-container-low' : 'hover:bg-surface-container-low'
                    }`}
                  >
                    <th scope="row" className="px-gutter-md py-4 font-label text-label-lg text-on-surface align-top font-semibold">
                      {row.parameter}
                    </th>
                    <td className="px-gutter-md py-4 font-body text-body-sm text-on-surface align-top text-pretty leading-relaxed">
                      {row.paperAValue}
                    </td>
                    <td className="px-gutter-md py-4 font-body text-body-sm text-on-surface align-top text-pretty leading-relaxed">
                      {row.paperBValue}
                    </td>
                    {paperC && (
                      <td className="px-gutter-md py-4 font-body text-body-sm text-on-surface align-top text-pretty leading-relaxed">
                        Evaluated across relevant benchmark distributions with comparable evaluation protocols.
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        </div>
      ) : null}
    </main>
  );
};

