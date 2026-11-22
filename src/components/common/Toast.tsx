import React from 'react';
import { useWorkspace } from '../../context/WorkspaceContext';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useWorkspace();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 max-w-sm pointer-events-none">
      {toasts.map(toast => {
        const icons = {
          success: 'check_circle',
          error: 'error',
          warning: 'warning',
          info: 'info',
        };
        const colors = {
          success: 'bg-surface text-on-surface border-success/40 shadow-md',
          error: 'bg-surface text-on-surface border-error/40 shadow-md',
          warning: 'bg-surface text-on-surface border-warning/40 shadow-md',
          info: 'bg-surface text-on-surface border-outline-variant shadow-md',
        };
        const iconColors = {
          success: 'text-success',
          error: 'text-error',
          warning: 'text-warning',
          info: 'text-primary',
        };

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center justify-between gap-3 px-4 py-3 rounded-lg border text-sm font-body transition-all transform animate-in slide-in-from-bottom-5 duration-200 ${colors[toast.type]}`}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <span className={`material-symbols-outlined text-[18px] shrink-0 ${iconColors[toast.type]}`}>
                {icons[toast.type]}
              </span>
              <span className="truncate">{toast.message}</span>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-on-surface-variant hover:text-on-surface p-1 rounded"
            >
              <span className="material-symbols-outlined text-[14px]">close</span>
            </button>
          </div>
        );
      })}
    </div>
  );
};

