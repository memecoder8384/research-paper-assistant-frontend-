import React, { useState } from 'react';
import { useWorkspace } from '../context/WorkspaceContext';

export const SettingsPage: React.FC = () => {
  const { papers, showToast } = useWorkspace();

  // Academic Citation & Reference Preferences
  const [citationStyle, setCitationStyle] = useState(
    () => localStorage.getItem('pref_citation_style') || 'IEEE'
  );
  const [alwaysShowPages, setAlwaysShowPages] = useState(
    () => localStorage.getItem('pref_always_show_pages') !== 'false'
  );
  const [citationExcerptMode, setCitationExcerptMode] = useState(
    () => localStorage.getItem('pref_citation_excerpt') || 'compact'
  );

  // AI Reading & Grounding Preferences
  const [summaryFormat, setSummaryFormat] = useState(
    () => localStorage.getItem('pref_summary_format') || 'standard'
  );
  const [strictGrounding, setStrictGrounding] = useState(
    () => localStorage.getItem('pref_strict_grounding') !== 'false'
  );
  const [autoExtractGaps, setAutoExtractGaps] = useState(
    () => localStorage.getItem('pref_auto_extract_gaps') !== 'false'
  );

  // Export & Display Preferences
  const [defaultExportFormat, setDefaultExportFormat] = useState(
    () => localStorage.getItem('pref_export_format') || 'markdown'
  );
  const [chatAutoScroll, setChatAutoScroll] = useState(
    () => localStorage.getItem('pref_chat_autoscroll') !== 'false'
  );

  // Researcher Profile
  const [researcherName, setResearcherName] = useState(
    () => localStorage.getItem('pref_researcher_name') || 'Dr. Elena Vance'
  );
  const [researcherRole, setResearcherRole] = useState(
    () => localStorage.getItem('pref_researcher_role') || 'Principal NLP Research Scientist'
  );
  const [researcherEmail, setResearcherEmail] = useState(
    () => localStorage.getItem('pref_researcher_email') || 'elena.vance@reasoning-lab.org'
  );
  const [institution, setInstitution] = useState(
    () => localStorage.getItem('pref_institution') || 'Stanford Reasoning & NLP Lab'
  );

  const handleSaveSettings = () => {
    localStorage.setItem('pref_citation_style', citationStyle);
    localStorage.setItem('pref_always_show_pages', String(alwaysShowPages));
    localStorage.setItem('pref_citation_excerpt', citationExcerptMode);
    localStorage.setItem('pref_summary_format', summaryFormat);
    localStorage.setItem('pref_strict_grounding', String(strictGrounding));
    localStorage.setItem('pref_auto_extract_gaps', String(autoExtractGaps));
    localStorage.setItem('pref_export_format', defaultExportFormat);
    localStorage.setItem('pref_chat_autoscroll', String(chatAutoScroll));
    localStorage.setItem('pref_researcher_name', researcherName);
    localStorage.setItem('pref_researcher_role', researcherRole);
    localStorage.setItem('pref_researcher_email', researcherEmail);
    localStorage.setItem('pref_institution', institution);

    showToast('Workspace settings saved successfully.', 'success');
  };

  const handleClearChatHistory = () => {
    sessionStorage.removeItem('chat_messages');
    showToast('Active chat conversation cleared.', 'info');
  };

  const handleSyncIndices = () => {
    showToast('Vector indices synchronized with active corpus.', 'success');
  };

  return (
    <main className="flex-1 p-gutter-lg lg:p-gutter-xl max-w-[1200px] w-full mx-auto flex flex-col gap-gutter-lg animate-in fade-in duration-200">
      {/* Page Header */}
      <section className="flex flex-col sm:flex-row sm:items-end justify-between gap-gutter-md">
        <div className="flex flex-col gap-gutter-xs">
          <h1 className="font-headline text-headline-lg text-on-surface">Workspace Settings</h1>
          <p className="font-body text-body-lg text-on-surface-variant">
            Manage your academic citation standards, AI reading parameters, and export preferences.
          </p>
        </div>
        <button
          type="button"
          onClick={handleSaveSettings}
          className="inline-flex items-center justify-center gap-gutter-sm px-gutter-md py-2.5 bg-primary hover:bg-primary-hover text-on-primary rounded font-label text-label-lg transition-colors duration-state-change shrink-0 shadow-xs active:scale-95"
        >
          <span className="material-symbols-outlined text-[18px]">save</span>
          <span>Save Changes</span>
        </button>
      </section>

      {/* 1. Citation & Academic Reference Preferences */}
      <section className="bg-surface border border-outline-variant rounded-md p-gutter-xl flex flex-col gap-gutter-md shadow-sm">
        <div className="flex items-center gap-gutter-sm">
          <span className="w-8 h-8 rounded bg-primary-container text-primary flex items-center justify-center">
            <span className="material-symbols-outlined text-[20px]">format_quote</span>
          </span>
          <div className="flex flex-col">
            <h2 className="font-headline text-headline-sm text-on-surface">Academic Citation &amp; References</h2>
            <span className="text-xs text-on-surface-variant">
              Configure how claims and evidence citations are formatted across summaries and research chats
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter-lg pt-1">
          <div className="flex flex-col gap-1.5">
            <label className="font-label text-label-md text-on-surface">Default Citation Format</label>
            <select
              value={citationStyle}
              onChange={e => setCitationStyle(e.target.value)}
              className="px-3 py-2 bg-background border border-outline-variant rounded font-body text-body-sm text-on-surface focus:border-primary focus:outline-none"
            >
              <option value="IEEE">IEEE Numerical (e.g. [1, p. 5])</option>
              <option value="APA">APA 7th Edition (e.g. Vaswani et al., 2017, p. 5)</option>
              <option value="MLA">MLA 9th Edition (e.g. Vaswani 5)</option>
              <option value="Chicago">Chicago Manual of Style (Author-Date)</option>
              <option value="Harvard">Harvard Referencing System</option>
            </select>
            <span className="text-xs text-on-surface-variant">
              Used when copying citations or exporting literature briefs.
            </span>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="font-label text-label-md text-on-surface">Citation Excerpt Detail</label>
            <select
              value={citationExcerptMode}
              onChange={e => setCitationExcerptMode(e.target.value)}
              className="px-3 py-2 bg-background border border-outline-variant rounded font-body text-body-sm text-on-surface focus:border-primary focus:outline-none"
            >
              <option value="compact">Compact (1–2 sentences with exact passage highlight)</option>
              <option value="extended">Extended (Full context paragraph with surrounding sentences)</option>
            </select>
            <span className="text-xs text-on-surface-variant">
              Determines how much original text appears when citations are expanded.
            </span>
          </div>
        </div>

        <div className="pt-2 border-t border-outline-variant/60 flex items-center justify-between">
          <div className="flex flex-col gap-0.5 max-w-xl">
            <span className="font-label text-label-md text-on-surface font-semibold">Always Require Page-Number Attribution</span>
            <span className="text-xs text-on-surface-variant">
              Ensures every claim displays exact original PDF page numbers so answers can be audited in source literature.
            </span>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={alwaysShowPages}
              onChange={e => setAlwaysShowPages(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-surface-container rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
          </label>
        </div>
      </section>

      {/* 2. AI Reading & Grounding Parameters */}
      <section className="bg-surface border border-outline-variant rounded-md p-gutter-xl flex flex-col gap-gutter-md shadow-sm">
        <div className="flex items-center gap-gutter-sm">
          <span className="w-8 h-8 rounded bg-accent-violet-container text-on-accent-violet-container flex items-center justify-center">
            <span className="material-symbols-outlined text-[20px]">psychology</span>
          </span>
          <div className="flex flex-col">
            <h2 className="font-headline text-headline-sm text-on-surface">Reading &amp; Grounding Rigor</h2>
            <span className="text-xs text-on-surface-variant">
              Control the depth of summarization and factual adherence to uploaded literature
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter-lg pt-1">
          <div className="flex flex-col gap-1.5">
            <label className="font-label text-label-md text-on-surface">Default Summarization Depth</label>
            <select
              value={summaryFormat}
              onChange={e => setSummaryFormat(e.target.value)}
              className="px-3 py-2 bg-background border border-outline-variant rounded font-body text-body-sm text-on-surface focus:border-primary focus:outline-none"
            >
              <option value="standard">Standard 8-Part Academic Brief (Objectives, Method, Results, Limitations)</option>
              <option value="detailed">Comprehensive Evaluation (Deep methodology &amp; dataset drill-downs)</option>
              <option value="concise">Executive Abstract (High-level findings for quick scanning)</option>
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="font-label text-label-md text-on-surface">Default Export Format</label>
            <select
              value={defaultExportFormat}
              onChange={e => setDefaultExportFormat(e.target.value)}
              className="px-3 py-2 bg-background border border-outline-variant rounded font-body text-body-sm text-on-surface focus:border-primary focus:outline-none"
            >
              <option value="markdown">Markdown Document (.md)</option>
              <option value="latex">LaTeX Article Template (.tex)</option>
              <option value="bibtex">BibTeX Reference Entries (.bib)</option>
              <option value="txt">Formatted Plain Text (.txt)</option>
            </select>
          </div>
        </div>

        <div className="flex flex-col divide-y divide-outline-variant/60 pt-2 border-t border-outline-variant/60">
          <div className="py-3 flex items-center justify-between">
            <div className="flex flex-col gap-0.5 max-w-xl">
              <span className="font-label text-label-md text-on-surface font-semibold">Strict Literature Grounding (Zero Hallucination)</span>
              <span className="text-xs text-on-surface-variant">
                Restricts AI answers strictly to retrieved document passages. When evidence is insufficient, explicitly states that information is absent from the papers.
              </span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={strictGrounding}
                onChange={e => setStrictGrounding(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-surface-container rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>

          <div className="py-3 flex items-center justify-between">
            <div className="flex flex-col gap-0.5 max-w-xl">
              <span className="font-label text-label-md text-on-surface font-semibold">Automatic Research Gap &amp; Limitation Extraction</span>
              <span className="text-xs text-on-surface-variant">
                Actively extracts author-acknowledged constraints, benchmark weaknesses, and future work suggestions during paper analysis.
              </span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={autoExtractGaps}
                onChange={e => setAutoExtractGaps(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-surface-container rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>

          <div className="py-3 flex items-center justify-between">
            <div className="flex flex-col gap-0.5 max-w-xl">
              <span className="font-label text-label-md text-on-surface font-semibold">Auto-Scroll to New Chat Answers</span>
              <span className="text-xs text-on-surface-variant">
                Automatically smooth-scroll the conversation pane when streaming and receiving new assistant responses.
              </span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={chatAutoScroll}
                onChange={e => setChatAutoScroll(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-surface-container rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>
        </div>
      </section>

      {/* 3. Workspace Data & Corpus Management */}
      <section className="bg-surface border border-outline-variant rounded-md p-gutter-xl flex flex-col gap-gutter-md shadow-sm">
        <div className="flex items-center gap-gutter-sm">
          <span className="w-8 h-8 rounded bg-success-container text-on-success-container flex items-center justify-center">
            <span className="material-symbols-outlined text-[20px]">database</span>
          </span>
          <div className="flex flex-col">
            <h2 className="font-headline text-headline-sm text-on-surface">Corpus Storage &amp; Cache</h2>
            <span className="text-xs text-on-surface-variant">
              Manage indexed research papers, local vector storage, and active conversation state
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-gutter-md pt-1">
          <div className="bg-background rounded p-3 flex flex-col gap-1 border border-outline-variant/50">
            <span className="text-xs font-label text-on-surface-variant">Indexed Papers</span>
            <span className="font-headline text-headline-sm text-on-surface">{papers.length} documents</span>
          </div>
          <div className="bg-background rounded p-3 flex flex-col gap-1 border border-outline-variant/50">
            <span className="text-xs font-label text-on-surface-variant">Vector Database</span>
            <span className="font-headline text-headline-sm text-success">Healthy &amp; Synchronized</span>
          </div>
          <div className="bg-background rounded p-3 flex flex-col gap-1 border border-outline-variant/50">
            <span className="text-xs font-label text-on-surface-variant">Embedding Dimensions</span>
            <span className="font-headline text-headline-sm text-on-surface">Dense 768-dim</span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-outline-variant/60">
          <button
            type="button"
            onClick={handleClearChatHistory}
            className="px-3.5 py-2 bg-surface hover:bg-surface-container-low border border-outline-variant rounded font-label text-label-md text-on-surface transition-colors flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-[16px]">delete_sweep</span>
            <span>Clear Chat Conversation</span>
          </button>

          <button
            type="button"
            onClick={handleSyncIndices}
            className="px-3.5 py-2 bg-surface hover:bg-surface-container-low border border-outline-variant rounded font-label text-label-md text-on-surface transition-colors flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-[16px]">sync</span>
            <span>Sync Vector Indices</span>
          </button>
        </div>
      </section>

      {/* 4. Researcher Profile */}
      <section className="bg-surface border border-outline-variant rounded-md p-gutter-xl flex flex-col gap-gutter-md shadow-sm">
        <div className="flex items-center gap-gutter-sm">
          <span className="w-8 h-8 rounded bg-primary-container text-primary flex items-center justify-center">
            <span className="material-symbols-outlined text-[20px]">person</span>
          </span>
          <div className="flex flex-col">
            <h2 className="font-headline text-headline-sm text-on-surface">Researcher Profile</h2>
            <span className="text-xs text-on-surface-variant">
              Your academic identity applied to exported reports, summaries, and literature notes
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-gutter-md pt-1">
          <div className="flex flex-col gap-1.5">
            <label className="font-label text-label-md text-on-surface">Full Name</label>
            <input
              type="text"
              value={researcherName}
              onChange={e => setResearcherName(e.target.value)}
              className="px-3 py-2 bg-background border border-outline-variant rounded font-body text-body-sm text-on-surface focus:border-primary focus:outline-none"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="font-label text-label-md text-on-surface">Primary Role / Title</label>
            <input
              type="text"
              value={researcherRole}
              onChange={e => setResearcherRole(e.target.value)}
              className="px-3 py-2 bg-background border border-outline-variant rounded font-body text-body-sm text-on-surface focus:border-primary focus:outline-none"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="font-label text-label-md text-on-surface">Academic Email</label>
            <input
              type="email"
              value={researcherEmail}
              onChange={e => setResearcherEmail(e.target.value)}
              className="px-3 py-2 bg-background border border-outline-variant rounded font-body text-body-sm text-on-surface focus:border-primary focus:outline-none"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="font-label text-label-md text-on-surface">Institution / Laboratory</label>
            <input
              type="text"
              value={institution}
              onChange={e => setInstitution(e.target.value)}
              className="px-3 py-2 bg-background border border-outline-variant rounded font-body text-body-sm text-on-surface focus:border-primary focus:outline-none"
            />
          </div>
        </div>
      </section>
    </main>
  );
};
