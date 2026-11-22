import React, { createContext, useContext, useState, useEffect } from 'react';
import { ResearchPaper, WorkspaceStats } from '../types';
import { INITIAL_PAPERS, MOCK_WORKSPACE_STATS } from '../services/mockData';
import { getPapers, deletePaperApi, testBackendConnection, API_CONFIG } from '../services/api';

interface ToastInfo {
  id: string;
  type: 'success' | 'info' | 'error' | 'warning';
  message: string;
}

interface WorkspaceContextType {
  papers: ResearchPaper[];
  stats: WorkspaceStats;
  selectedPapersForChat: string[];
  searchQuery: string;
  isSearchModalOpen: boolean;
  isUploadModalOpen: boolean;
  toasts: ToastInfo[];
  backendConnected: boolean;
  setSearchQuery: (q: string) => void;
  setIsSearchModalOpen: (open: boolean) => void;
  setIsUploadModalOpen: (open: boolean) => void;
  setSelectedPapersForChat: React.Dispatch<React.SetStateAction<string[]>>;
  togglePaperSelectionForChat: (paperId: string) => void;
  addPaper: (paper: ResearchPaper) => void;
  retryPaperIndexing: (paperId: string) => void;
  deletePaper: (paperId: string) => void;
  showToast: (message: string, type?: 'success' | 'info' | 'error' | 'warning') => void;
  removeToast: (id: string) => void;
  setBackendConnected: (connected: boolean) => void;
}

const WorkspaceContext = createContext<WorkspaceContextType | undefined>(undefined);

export const WorkspaceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [papers, setPapers] = useState<ResearchPaper[]>([]);
  const [stats, setStats] = useState<WorkspaceStats>(MOCK_WORKSPACE_STATS);
  const [selectedPapersForChat, setSelectedPapersForChat] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [toasts, setToasts] = useState<ToastInfo[]>([]);
  const [backendConnected, setBackendConnected] = useState(false);

  useEffect(() => {
    testBackendConnection().then(res => {
      setBackendConnected(res.success);
      if (res.success) {
        API_CONFIG.useMockApi = false;
      }
      getPapers().then(data => {
        if (data && data.length) {
          setPapers(data);
          setSelectedPapersForChat(data.map(p => p.id).slice(0, 3));
          setStats(prev => ({
            ...prev,
            totalPapers: data.length,
            indexedCount: data.filter(p => p.status === 'indexed').length,
            processingCount: data.filter(p => p.status === 'processing').length,
            failedCount: data.filter(p => p.status === 'failed').length,
          }));
        } else if (res.success) {
          setPapers([]);
          setSelectedPapersForChat([]);
          setStats(prev => ({
            ...prev,
            totalPapers: 0,
            indexedCount: 0,
            processingCount: 0,
            failedCount: 0,
          }));
        }
      });
    });
  }, []);

  const showToast = (message: string, type: 'success' | 'info' | 'error' | 'warning' = 'info') => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    setToasts(prev => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const togglePaperSelectionForChat = (paperId: string) => {
    setSelectedPapersForChat(prev => {
      if (prev.includes(paperId)) {
        return prev.filter(id => id !== paperId);
      } else {
        return [...prev, paperId];
      }
    });
  };

  const addPaper = (newPaper: ResearchPaper) => {
    setPapers(prev => [newPaper, ...prev]);
    setStats(prev => ({
      ...prev,
      totalPapers: prev.totalPapers + 1,
      indexedCount: newPaper.status === 'indexed' ? prev.indexedCount + 1 : prev.indexedCount,
      processingCount: newPaper.status === 'processing' ? prev.processingCount + 1 : prev.processingCount,
    }));
    showToast(`Added "${newPaper.title}" to library.`, 'success');
  };

  const retryPaperIndexing = (paperId: string) => {
    setPapers(prev =>
      prev.map(p => (p.id === paperId ? { ...p, status: 'processing', failureReason: undefined } : p))
    );
    showToast('Indexing re-initiated...', 'info');

    setTimeout(() => {
      setPapers(prev =>
        prev.map(p => (p.id === paperId ? { ...p, status: 'indexed' } : p))
      );
      setStats(prev => ({
        ...prev,
        failedCount: Math.max(0, prev.failedCount - 1),
        indexedCount: prev.indexedCount + 1,
      }));
      showToast('Indexing completed successfully!', 'success');
    }, 2500);
  };

  const deletePaper = (paperId: string) => {
    deletePaperApi(paperId).catch(err => console.error(err));
    setPapers(prev => prev.filter(p => p.id !== paperId));
    setSelectedPapersForChat(prev => prev.filter(id => id !== paperId));
    showToast('Paper removed from workspace.', 'info');
  };

  return (
    <WorkspaceContext.Provider
      value={{
        papers,
        stats,
        selectedPapersForChat,
        searchQuery,
        isSearchModalOpen,
        isUploadModalOpen,
        toasts,
        backendConnected,
        setSearchQuery,
        setIsSearchModalOpen,
        setIsUploadModalOpen,
        setSelectedPapersForChat,
        togglePaperSelectionForChat,
        addPaper,
        retryPaperIndexing,
        deletePaper,
        showToast,
        removeToast,
        setBackendConnected,
      }}
    >
      {children}
    </WorkspaceContext.Provider>
  );
};

export const useWorkspace = () => {
  const context = useContext(WorkspaceContext);
  if (!context) {
    throw new Error('useWorkspace must be used within a WorkspaceProvider');
  }
  return context;
};
