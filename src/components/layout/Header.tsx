import React, { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useWorkspace } from '../../context/WorkspaceContext';

interface HeaderProps {
  onToggleSidebar: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onToggleSidebar }) => {
  const location = useLocation();
  const { setIsSearchModalOpen, backendConnected, isProcessing } = useWorkspace();
  const [showNotificationMenu, setShowNotificationMenu] = useState(false);

  const getPageTitle = (pathname: string) => {
    switch (pathname) {
      case '/':
        return 'Overview';
      case '/library':
        return 'Research Library';
      case '/chat':
        return 'AI Research Chat';
      case '/summarizer':
        return 'Paper Summarizer';
      case '/comparison':
        return 'Paper Comparison';
      case '/gap-analyzer':
        return 'Research Gap Analyzer';
      case '/settings':
        return 'Settings & Backend Connection';
      default:
        return 'Overview';
    }
  };

  return (
    <header className="h-16 bg-surface border-b border-outline-variant px-gutter-lg lg:px-gutter-xl flex items-center justify-between gap-gutter-md sticky top-0 z-20 shadow-xs">
      {/* Left: Mobile Menu + Breadcrumb */}
      <div className="flex items-center gap-gutter-sm min-w-0">
        <button
          type="button"
          aria-label="Open navigation menu"
          disabled={isProcessing}
          onClick={onToggleSidebar}
          className="lg:hidden p-2 rounded border border-outline-variant text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span className="material-symbols-outlined text-[20px]" aria-hidden="true">menu</span>
        </button>
        <nav aria-label="Breadcrumb" className="flex items-center gap-gutter-xs">
          <span className="font-body text-body-sm text-on-surface-variant">Workspace</span>
          <span className="text-on-surface-variant">/</span>
          <span className="font-title text-title-md text-on-surface font-semibold truncate">
            {getPageTitle(location.pathname)}
          </span>
        </nav>
      </div>

      {/* Right: Search, Notifications, Profile */}
      <div className="flex items-center gap-gutter-sm">
        {/* Search trigger button (⌘K) */}
        <button
          type="button"
          disabled={isProcessing}
          onClick={() => setIsSearchModalOpen(true)}
          className="hidden sm:flex items-center gap-4 px-3.5 py-1.5 bg-surface-container-low/70 hover:bg-surface-container border border-outline-variant rounded-full text-on-surface-variant transition-colors duration-state-change group disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[16px] text-neutral-400 group-hover:text-primary transition-colors" aria-hidden="true">
              search
            </span>
            <span className="font-body text-body-sm text-neutral-500">Search papers &amp; concepts...</span>
          </span>
          <kbd className="flex items-center gap-0.5 rounded-md border border-black/[0.06] bg-white px-1.5 py-0.5 font-sans text-[11px] font-medium text-neutral-400 shadow-2xs">
            <span className="text-[12px] leading-none">⌘</span>K
          </kbd>
        </button>

        {/* Backend status pill */}
        <Link
          to="/settings"
          onClick={(e) => {
            if (isProcessing) e.preventDefault();
          }}
          className={`hidden md:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-label border border-outline-variant bg-surface hover:bg-surface-container-low transition-colors ${
            isProcessing ? 'pointer-events-none opacity-60 cursor-not-allowed' : ''
          }`}
          title={backendConnected ? 'Connected to external backend' : 'Running in frontend mock mode (ready for backend connection)'}
        >
          <span className={`w-2 h-2 rounded-full ${backendConnected ? 'bg-success animate-pulse' : 'bg-primary'}`}></span>
          <span className="text-on-surface-variant font-medium">
            {backendConnected ? 'Backend Live' : 'Frontend Standalone'}
          </span>
        </Link>

        {/* Notifications dropdown button */}
        <div className="relative">
          <button
            type="button"
            aria-label="Notifications"
            disabled={isProcessing}
            onClick={() => setShowNotificationMenu(!showNotificationMenu)}
            className="relative inline-flex items-center justify-center w-9 h-9 bg-surface hover:bg-surface-container-low text-on-surface-variant hover:text-on-surface border border-outline-variant rounded transition-colors duration-state-change focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="material-symbols-outlined text-[18px]" aria-hidden="true">notifications</span>
            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-primary ring-2 ring-surface" aria-hidden="true"></span>
          </button>

          {showNotificationMenu && (
            <div className="absolute right-0 mt-2 w-80 bg-surface border border-outline-variant rounded-md shadow-lg py-2 z-50 animate-in fade-in zoom-in-95">
              <div className="px-4 py-2 border-b border-outline-variant flex items-center justify-between">
                <span className="font-headline text-headline-sm text-on-surface text-sm">Notifications</span>
                <span className="text-xs text-primary font-medium cursor-pointer hover:underline">Mark all read</span>
              </div>
              <div className="max-h-64 overflow-y-auto divide-y divide-outline-variant">
                <div className="p-3 hover:bg-surface-container-low transition-colors cursor-pointer">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-success"></span>
                    <span className="text-xs font-semibold text-on-surface">Indexing Complete</span>
                  </div>
                  <p className="text-xs text-on-surface-variant mt-1">
                    "Retrieval-Augmented Generation" vector embeddings ready for querying.
                  </p>
                  <span className="text-[10px] text-on-surface-variant/80 mt-1 block">15m ago</span>
                </div>
                <div className="p-3 hover:bg-surface-container-low transition-colors cursor-pointer">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-warning"></span>
                    <span className="text-xs font-semibold text-on-surface">Processing Paper</span>
                  </div>
                  <p className="text-xs text-on-surface-variant mt-1">
                    "Constitutional AI" is extracting section hierarchies.
                  </p>
                  <span className="text-[10px] text-on-surface-variant/80 mt-1 block">1h ago</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* User profile avatar */}
        <Link
          to="/settings"
          aria-label="User profile settings"
          className="w-9 h-9 rounded-full bg-primary-container text-primary font-label text-label-md flex items-center justify-center border border-outline-variant hover:ring-2 hover:ring-primary/20 transition-all"
        >
          <span>EV</span>
        </Link>
      </div>
    </header>
  );
};

