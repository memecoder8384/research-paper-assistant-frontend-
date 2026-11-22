import React from 'react';
import { NavLink, Link } from 'react-router-dom';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const navItems = [
    { to: '/', label: 'Overview', icon: 'dashboard' },
    { to: '/library', label: 'Research Library', icon: 'folder_open' },
    { to: '/chat', label: 'AI Research Chat', icon: 'forum' },
    { to: '/summarizer', label: 'Paper Summarizer', icon: 'summarize' },
    { to: '/comparison', label: 'Paper Comparison', icon: 'compare_arrows' },
    { to: '/gap-analyzer', label: 'Research Gap Analyzer', icon: 'troubleshoot' },
    { to: '/settings', label: 'Settings', icon: 'settings' },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-30 lg:hidden backdrop-blur-sm transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed lg:sticky top-0 left-0 z-40 h-screen w-64 shrink-0 bg-surface border-r border-outline-variant flex flex-col justify-between transition-transform duration-200 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="p-gutter-md flex flex-col gap-gutter-lg overflow-y-auto">
          {/* Brand & Collapse */}
          <div className="flex items-center justify-between px-1 pt-1">
            <Link to="/" className="flex items-center gap-gutter-sm group">
              <span className="w-8 h-8 rounded bg-primary text-on-primary flex items-center justify-center shrink-0 shadow-sm transition-transform group-hover:scale-105">
                <span className="material-symbols-outlined text-[18px]" aria-hidden="true">science</span>
              </span>
              <span className="font-headline text-headline-sm text-on-surface tracking-tight">
                Research Assistant
              </span>
            </Link>
            <button
              type="button"
              aria-label="Close sidebar"
              onClick={onClose}
              className="lg:hidden p-1.5 rounded text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          </div>

          {/* Workspace Switcher */}
          <button
            type="button"
            className="w-full flex items-center justify-between px-3 py-2 bg-surface-container-low hover:bg-surface-container border border-outline-variant rounded transition-colors duration-state-change text-left group"
          >
            <div className="flex flex-col min-w-0">
              <span className="font-label text-label-lg text-on-surface truncate group-hover:text-primary transition-colors">
                NLP &amp; Reasoning Lab
              </span>
              <span className="font-label text-label-sm text-on-surface-variant">
                48 papers · 4 collections
              </span>
            </div>
            <span className="material-symbols-outlined text-[18px] text-on-surface-variant shrink-0" aria-hidden="true">
              unfold_more
            </span>
          </button>

          {/* Primary Navigation */}
          <nav aria-label="Primary" className="flex flex-col gap-gutter-xs">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-gutter-sm px-3 py-2 rounded font-label text-label-lg transition-colors duration-state-change ${
                    isActive
                      ? 'bg-primary-container text-primary font-semibold'
                      : 'text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface'
                  }`
                }
              >
                <span className="material-symbols-outlined text-[18px]" aria-hidden="true">
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Bottom User Profile */}
        <div className="p-gutter-md border-t border-outline-variant flex flex-col gap-gutter-sm">
          <Link
            to="/settings"
            className="flex items-center justify-between gap-gutter-sm px-2 py-1.5 rounded hover:bg-surface-container-low transition-colors duration-state-change cursor-pointer"
          >
            <div className="flex items-center gap-gutter-sm min-w-0">
              <span className="w-8 h-8 rounded-full bg-primary-container text-primary font-label text-label-md flex items-center justify-center shrink-0">
                EV
              </span>
              <div className="flex flex-col min-w-0">
                <span className="font-label text-label-lg text-on-surface truncate">Dr. Elena Vance</span>
                <span className="font-label text-label-sm text-on-surface-variant truncate">Academic Pro</span>
              </div>
            </div>
            <span className="material-symbols-outlined text-[18px] text-on-surface-variant shrink-0" aria-hidden="true">
              more_horiz
            </span>
          </Link>
        </div>
      </aside>
    </>
  );
};

