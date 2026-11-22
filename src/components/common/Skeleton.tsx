import React from 'react';

export const Skeleton: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`animate-pulse bg-surface-container/70 rounded ${className}`} />
);

export const SkeletonLine: React.FC<{ width?: string; height?: string; className?: string }> = ({
  width = 'w-full',
  height = 'h-4',
  className = '',
}) => <div className={`animate-pulse bg-surface-container/70 rounded ${height} ${width} ${className}`} />;

export const SkeletonText: React.FC<{ lines?: number; className?: string }> = ({
  lines = 3,
  className = '',
}) => {
  const widths = ['w-full', 'w-11/12', 'w-4/5', 'w-3/4', 'w-5/6'];
  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <SkeletonLine key={i} width={widths[i % widths.length]} />
      ))}
    </div>
  );
};

/**
 * Skeleton loader for SummarizerPage (8-section brief + sidebar).
 */
export const SummarySkeleton: React.FC = () => (
  <div className="grid grid-cols-1 lg:grid-cols-3 gap-gutter-lg items-start animate-in fade-in duration-300">
    {/* Main 8-Section Brief (2 Columns) */}
    <article className="lg:col-span-2 bg-surface border border-outline-variant rounded-md p-gutter-xl flex flex-col gap-gutter-lg shadow-sm">
      {/* 1. Abstract Overview */}
      <div className="flex flex-col gap-gutter-sm pb-gutter-md border-b border-outline-variant">
        <div className="flex items-center gap-2">
          <Skeleton className="w-5 h-5 rounded-full" />
          <SkeletonLine width="w-48" height="h-6" />
        </div>
        <SkeletonText lines={4} />
      </div>

      {/* 2 & 3. Research Objectives & Problem Statement */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter-lg pb-gutter-md border-b border-outline-variant">
        <div className="flex flex-col gap-gutter-sm">
          <SkeletonLine width="w-40" height="h-5" />
          <SkeletonText lines={3} />
        </div>
        <div className="flex flex-col gap-gutter-sm">
          <SkeletonLine width="w-36" height="h-5" />
          <SkeletonText lines={3} />
        </div>
      </div>

      {/* 4. Methodology */}
      <div className="flex flex-col gap-gutter-sm pb-gutter-md border-b border-outline-variant">
        <SkeletonLine width="w-32" height="h-5" />
        <SkeletonText lines={3} />
      </div>

      {/* 5. Key Findings */}
      <div className="flex flex-col gap-gutter-sm pb-gutter-md border-b border-outline-variant">
        <SkeletonLine width="w-36" height="h-5" />
        <div className="flex flex-col gap-2.5 pl-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-center gap-2">
              <Skeleton className="w-2 h-2 rounded-full shrink-0" />
              <SkeletonLine width={i % 2 === 0 ? 'w-5/6' : 'w-3/4'} />
            </div>
          ))}
        </div>
      </div>

      {/* 6. Results and Discussion */}
      <div className="flex flex-col gap-gutter-sm pb-gutter-md border-b border-outline-variant">
        <SkeletonLine width="w-44" height="h-5" />
        <SkeletonText lines={3} />
      </div>

      {/* 7 & 8. Limitations & Conclusion */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter-lg">
        <div className="flex flex-col gap-gutter-sm">
          <SkeletonLine width="w-28" height="h-5" />
          <SkeletonText lines={3} />
        </div>
        <div className="flex flex-col gap-gutter-sm">
          <SkeletonLine width="w-28" height="h-5" />
          <SkeletonText lines={3} />
        </div>
      </div>
    </article>

    {/* Right Sidebar */}
    <aside className="flex flex-col gap-gutter-md">
      {/* Important Keywords */}
      <div className="bg-surface border border-outline-variant rounded-md p-gutter-lg flex flex-col gap-gutter-sm shadow-xs">
        <SkeletonLine width="w-36" height="h-5" />
        <div className="flex flex-wrap gap-2 pt-1">
          <Skeleton className="w-16 h-6 rounded-full" />
          <Skeleton className="w-24 h-6 rounded-full" />
          <Skeleton className="w-20 h-6 rounded-full" />
          <Skeleton className="w-28 h-6 rounded-full" />
          <Skeleton className="w-14 h-6 rounded-full" />
        </div>
      </div>

      {/* Key Insight Highlights */}
      <div className="bg-surface border border-outline-variant rounded-md p-gutter-lg flex flex-col gap-gutter-sm shadow-xs">
        <SkeletonLine width="w-40" height="h-5" />
        <div className="flex flex-col gap-2.5 pt-1">
          <div className="p-3 rounded bg-surface-container-low/60 flex flex-col gap-1.5 border border-outline-variant/40">
            <SkeletonLine width="w-32" height="h-4" />
            <SkeletonLine width="w-full" height="h-3" />
            <SkeletonLine width="w-4/5" height="h-3" />
          </div>
          <div className="p-3 rounded bg-surface-container-low/60 flex flex-col gap-1.5 border border-outline-variant/40">
            <SkeletonLine width="w-28" height="h-4" />
            <SkeletonLine width="w-full" height="h-3" />
            <SkeletonLine width="w-3/4" height="h-3" />
          </div>
        </div>
      </div>

      {/* Source References */}
      <div className="bg-surface border border-outline-variant rounded-md p-gutter-lg flex flex-col gap-gutter-sm shadow-xs">
        <SkeletonLine width="w-36" height="h-5" />
        <div className="flex flex-col gap-2 pt-1">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex items-center justify-between py-1.5 border-b border-outline-variant/40 last:border-b-0">
              <SkeletonLine width="w-24" height="h-3.5" />
              <Skeleton className="w-12 h-5 rounded" />
            </div>
          ))}
        </div>
      </div>
    </aside>
  </div>
);

/**
 * Skeleton loader for ComparisonPage (AI overview + matrix table).
 */
export const ComparisonSkeleton: React.FC = () => (
  <div className="flex flex-col gap-gutter-lg animate-in fade-in duration-300">
    {/* AI Comparison Overview */}
    <section className="bg-surface border border-outline-variant rounded-md p-gutter-lg flex flex-col gap-gutter-md shadow-sm">
      <div className="flex items-center gap-gutter-sm">
        <Skeleton className="w-7 h-7 rounded" />
        <SkeletonLine width="w-48" height="h-5" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter-lg">
        <div className="bg-background rounded p-gutter-md flex flex-col gap-gutter-sm border border-outline-variant/50">
          <SkeletonLine width="w-32" height="h-4" />
          <SkeletonText lines={3} />
        </div>
        <div className="bg-background rounded p-gutter-md flex flex-col gap-gutter-sm border border-outline-variant/50">
          <SkeletonLine width="w-44" height="h-4" />
          <SkeletonText lines={3} />
        </div>
      </div>
    </section>

    {/* Comparison Matrix Table */}
    <section className="bg-surface border border-outline-variant rounded-md overflow-x-auto shadow-sm">
      <table className="w-full text-left border-collapse min-w-[760px]">
        <thead>
          <tr className="bg-surface-container-low border-b border-outline-variant">
            <th className="w-48 px-gutter-md py-3.5">
              <SkeletonLine width="w-24" height="h-4" />
            </th>
            <th className="px-gutter-md py-3.5">
              <SkeletonLine width="w-44" height="h-4" />
            </th>
            <th className="px-gutter-md py-3.5">
              <SkeletonLine width="w-44" height="h-4" />
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-outline-variant">
          {Array.from({ length: 6 }).map((_, i) => (
            <tr key={i} className={i % 2 === 1 ? 'bg-background' : ''}>
              <td className="px-gutter-md py-3.5">
                <SkeletonLine width="w-28" height="h-4" />
              </td>
              <td className="px-gutter-md py-3.5">
                <SkeletonText lines={2} />
              </td>
              <td className="px-gutter-md py-3.5">
                <SkeletonText lines={2} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  </div>
);

/**
 * Skeleton loader for GapAnalyzerPage (Themes chart + Literature synthesis + Gap cards).
 */
export const GapAnalysisSkeleton: React.FC = () => (
  <div className="flex flex-col gap-gutter-lg animate-in fade-in duration-300">
    <section className="grid grid-cols-1 lg:grid-cols-2 gap-gutter-lg items-stretch">
      {/* Themes Chart */}
      <article className="bg-surface border border-outline-variant rounded-md p-gutter-lg flex flex-col gap-gutter-md shadow-sm">
        <div className="flex items-center justify-between">
          <SkeletonLine width="w-44" height="h-5" />
          <SkeletonLine width="w-32" height="h-4" />
        </div>
        <div className="flex flex-col gap-gutter-md pt-2">
          {[75, 55, 40, 25].map((pct, idx) => (
            <div key={idx} className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <SkeletonLine width="w-36" height="h-4" />
                <SkeletonLine width="w-8" height="h-4" />
              </div>
              <div className="w-full h-2 rounded-full bg-surface-container-low overflow-hidden">
                <div className="h-full bg-surface-container rounded-full" style={{ width: `${pct}%` }} />
              </div>
            </div>
          ))}
        </div>
      </article>

      {/* Literature Synthesis */}
      <article className="bg-surface border border-outline-variant rounded-md p-gutter-lg flex flex-col gap-gutter-md shadow-sm">
        <SkeletonLine width="w-36" height="h-5" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-gutter-md flex-1">
          <div className="bg-background rounded p-gutter-md flex flex-col gap-2 border border-outline-variant/40">
            <SkeletonLine width="w-28" height="h-4" />
            <SkeletonText lines={4} />
          </div>
          <div className="bg-background rounded p-gutter-md flex flex-col gap-2 border border-outline-variant/40">
            <SkeletonLine width="w-32" height="h-4" />
            <SkeletonText lines={4} />
          </div>
        </div>
      </article>
    </section>

    {/* Research Gap Cards Grid */}
    <section className="flex flex-col gap-gutter-md">
      <div className="flex items-center justify-between">
        <SkeletonLine width="w-64" height="h-6" />
        <div className="flex gap-2">
          <Skeleton className="w-12 h-6 rounded-full" />
          <Skeleton className="w-24 h-6 rounded-full" />
          <Skeleton className="w-28 h-6 rounded-full" />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter-md items-stretch">
        {Array.from({ length: 4 }).map((_, i) => (
          <article
            key={i}
            className="bg-surface border border-outline-variant rounded-md p-gutter-lg flex flex-col justify-between gap-gutter-md shadow-xs"
          >
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <Skeleton className="w-28 h-5 rounded-full" />
                <Skeleton className="w-16 h-5 rounded" />
              </div>
              <SkeletonLine width="w-3/4" height="h-5" />
              <SkeletonText lines={3} />
            </div>
            <div className="p-3 bg-surface-container-low/60 rounded flex flex-col gap-1.5 border border-outline-variant/30">
              <SkeletonLine width="w-36" height="h-3.5" />
              <SkeletonLine width="w-full" height="h-3" />
            </div>
          </article>
        ))}
      </div>
    </section>
  </div>
);

/**
 * Skeleton loader for LibraryPage Document Table.
 */
export const LibraryTableSkeleton: React.FC<{ rows?: number }> = ({ rows = 5 }) => (
  <div className="bg-surface border border-outline-variant rounded-md overflow-x-auto shadow-xs animate-in fade-in duration-300">
    <table className="w-full text-left border-collapse min-w-[760px]">
      <thead>
        <tr className="bg-surface-container-low border-b border-outline-variant">
          <th className="px-gutter-md py-3"><SkeletonLine width="w-24" height="h-4" /></th>
          <th className="px-gutter-md py-3"><SkeletonLine width="w-20" height="h-4" /></th>
          <th className="px-gutter-md py-3"><SkeletonLine width="w-20" height="h-4" /></th>
          <th className="px-gutter-md py-3"><SkeletonLine width="w-12" height="h-4" /></th>
          <th className="px-gutter-md py-3"><SkeletonLine width="w-16" height="h-4" /></th>
          <th className="px-gutter-md py-3 text-right"><SkeletonLine width="w-14" height="h-4" className="ml-auto" /></th>
        </tr>
      </thead>
      <tbody className="divide-y divide-outline-variant">
        {Array.from({ length: rows }).map((_, i) => (
          <tr key={i} className="hover:bg-surface-container-low/50 transition-colors">
            <td className="px-gutter-md py-3.5">
              <div className="flex items-center gap-gutter-sm">
                <Skeleton className="w-6 h-6 rounded shrink-0" />
                <div className="flex flex-col gap-1.5 flex-1 min-w-0">
                  <SkeletonLine width="w-4/5" height="h-4" />
                  <SkeletonLine width="w-1/2" height="h-3" />
                </div>
              </div>
            </td>
            <td className="px-gutter-md py-3.5">
              <SkeletonLine width="w-32" height="h-3.5" />
            </td>
            <td className="px-gutter-md py-3.5">
              <SkeletonLine width="w-20" height="h-3.5" />
            </td>
            <td className="px-gutter-md py-3.5">
              <SkeletonLine width="w-14" height="h-3.5" />
            </td>
            <td className="px-gutter-md py-3.5">
              <Skeleton className="w-20 h-5 rounded-full" />
            </td>
            <td className="px-gutter-md py-3.5 text-right">
              <Skeleton className="w-6 h-6 rounded ml-auto" />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

/**
 * Skeleton loader for DashboardPage (metrics + recent papers + quick actions).
 */
export const DashboardSkeleton: React.FC = () => (
  <div className="flex flex-col gap-gutter-xl animate-in fade-in duration-300">
    {/* 4 Metric Cards */}
    <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-gutter-md items-stretch">
      {Array.from({ length: 4 }).map((_, i) => (
        <article
          key={i}
          className="h-full bg-surface border border-outline-variant rounded-md p-gutter-lg shadow-sm flex flex-col justify-between gap-gutter-md"
        >
          <header className="flex items-center justify-between">
            <SkeletonLine width="w-28" height="h-4" />
            <Skeleton className="w-8 h-8 rounded" />
          </header>
          <div className="flex items-baseline gap-2">
            <SkeletonLine width="w-16" height="h-8" />
            <SkeletonLine width="w-20" height="h-4" />
          </div>
          <SkeletonLine width="w-32" height="h-3" />
        </article>
      ))}
    </section>

    {/* Main Content Split: Recent Papers + Quick Actions */}
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-gutter-lg items-start">
      {/* Recent Papers */}
      <section className="lg:col-span-2 flex flex-col gap-gutter-md">
        <div className="flex items-center justify-between">
          <SkeletonLine width="w-48" height="h-6" />
          <SkeletonLine width="w-24" height="h-4" />
        </div>
        <div className="flex flex-col gap-gutter-sm">
          {Array.from({ length: 3 }).map((_, i) => (
            <article
              key={i}
              className="bg-surface border border-outline-variant rounded-md p-gutter-md flex flex-col sm:flex-row sm:items-center justify-between gap-gutter-md"
            >
              <div className="flex items-start gap-gutter-md flex-1">
                <Skeleton className="w-10 h-10 rounded shrink-0" />
                <div className="flex flex-col gap-1.5 flex-1 min-w-0">
                  <SkeletonLine width="w-3/4" height="h-5" />
                  <SkeletonLine width="w-1/2" height="h-3.5" />
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <Skeleton className="w-16 h-7 rounded" />
                <Skeleton className="w-14 h-7 rounded" />
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Quick Actions */}
      <section className="flex flex-col gap-gutter-md">
        <SkeletonLine width="w-32" height="h-6" />
        <div className="flex flex-col gap-gutter-sm">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="bg-surface border border-outline-variant rounded-md p-gutter-md flex items-start gap-gutter-md shadow-xs"
            >
              <Skeleton className="w-10 h-10 rounded shrink-0" />
              <div className="flex flex-col gap-1.5 flex-1">
                <SkeletonLine width="w-36" height="h-4" />
                <SkeletonLine width="w-full" height="h-3" />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  </div>
);
