import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { WorkspaceProvider, useWorkspace } from './context/WorkspaceContext';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { GlobalSearchModal } from './components/common/GlobalSearchModal';
import { UploadPaperModal } from './components/common/UploadPaperModal';
import { ToastContainer } from './components/common/Toast';

import { DashboardPage } from './pages/DashboardPage';
import { LibraryPage } from './pages/LibraryPage';
import { ChatPage } from './pages/ChatPage';
import { SummarizerPage } from './pages/SummarizerPage';
import { ComparisonPage } from './pages/ComparisonPage';
import { GapAnalyzerPage } from './pages/GapAnalyzerPage';
import { SettingsPage } from './pages/SettingsPage';

const AppContent: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { isProcessing } = useWorkspace();

  return (
    <div className="min-h-screen flex bg-background text-on-background font-body antialiased relative">
      {/* Top Global Progress Bar on active process */}
      {isProcessing && (
        <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-gradient-to-r from-primary via-accent-violet to-primary animate-progress-flow shadow-sm" />
      )}

      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Column */}
      <div className="flex-1 min-w-0 flex flex-col min-h-screen">
        <Header onToggleSidebar={() => setSidebarOpen(true)} />
        
        {/* App Pages Routing */}
        <div className="flex-1 flex flex-col">
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/library" element={<LibraryPage />} />
            <Route path="/chat" element={<ChatPage />} />
            <Route path="/summarizer" element={<SummarizerPage />} />
            <Route path="/comparison" element={<ComparisonPage />} />
            <Route path="/gap-analyzer" element={<GapAnalyzerPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </div>

      {/* Modals & Toasts */}
      <GlobalSearchModal />
      <UploadPaperModal />
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <WorkspaceProvider>
      <AppContent />
    </WorkspaceProvider>
  );
}

