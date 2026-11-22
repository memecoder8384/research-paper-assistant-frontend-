import React, { useState } from 'react';
import { useWorkspace } from '../context/WorkspaceContext';
import { API_CONFIG, testBackendConnection } from '../services/api';

export const SettingsPage: React.FC = () => {
  const { backendConnected, setBackendConnected, showToast } = useWorkspace();
  const [apiUrl, setApiUrl] = useState(API_CONFIG.baseUrl);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string; latency?: number } | null>(null);

  const [aiModel, setAiModel] = useState('gemini-1.5-pro');
  const [embeddingModel, setEmbeddingModel] = useState('text-embedding-004');
  const [temperature, setTemperature] = useState(0.2);

  const handleTestConnection = async () => {
    setTesting(true);
    setTestResult(null);
    showToast('Pinging backend endpoint...', 'info');

    const result = await testBackendConnection(apiUrl);
    setTesting(false);
    setTestResult(result);
    setBackendConnected(result.success);

    if (result.success) {
      showToast('Backend connected successfully!', 'success');
      API_CONFIG.baseUrl = apiUrl;
      API_CONFIG.useMockApi = false;
    } else {
      showToast('Backend unreachable. Keeping frontend mock mode active.', 'warning');
    }
  };

  const handleSaveSettings = () => {
    API_CONFIG.baseUrl = apiUrl;
    showToast('Settings saved successfully.', 'success');
  };

  return (
    <main className="flex-1 p-gutter-lg lg:p-gutter-xl max-w-[1200px] w-full mx-auto flex flex-col gap-gutter-lg">
      {/* Page Header */}
      <section className="flex flex-col sm:flex-row sm:items-end justify-between gap-gutter-md">
        <div className="flex flex-col gap-gutter-xs">
          <h1 className="font-headline text-headline-lg text-on-surface">Workspace Settings</h1>
          <p className="font-body text-body-lg text-on-surface-variant">
            Configure backend API connection, AI models, and vector indexing parameters.
          </p>
        </div>
        <button
          type="button"
          onClick={handleSaveSettings}
          className="inline-flex items-center justify-center gap-gutter-sm px-gutter-md py-2.5 bg-primary hover:bg-primary-hover text-on-primary rounded font-label text-label-lg transition-colors duration-state-change shrink-0 shadow-xs"
        >
          <span className="material-symbols-outlined text-[18px]">save</span>
          <span>Save Changes</span>
        </button>
      </section>

      {/* Backend Integration Card */}
      <section className="bg-surface border border-outline-variant rounded-md p-gutter-xl flex flex-col gap-gutter-md shadow-sm">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-gutter-sm">
            <span className="w-8 h-8 rounded bg-primary-container text-primary flex items-center justify-center">
              <span className="material-symbols-outlined text-[20px]">hub</span>
            </span>
            <div className="flex flex-col">
              <h2 className="font-headline text-headline-sm text-on-surface">External Backend Connection</h2>
              <span className="text-xs text-on-surface-variant">
                Connect your separate backend repo (FastAPI, Flask, Node.js, Express, etc.)
              </span>
            </div>
          </div>
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-label ${
              backendConnected
                ? 'bg-success-container text-on-success-container'
                : 'bg-surface-container-low text-on-surface-variant border border-outline-variant'
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${backendConnected ? 'bg-success' : 'bg-on-surface-variant'}`} />
            <span>{backendConnected ? 'Connected & Live' : 'Using Local Standalone Mocks'}</span>
          </span>
        </div>

        <div className="flex flex-col gap-2 max-w-xl">
          <label className="font-label text-label-md text-on-surface">Backend API Base URL</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={apiUrl}
              onChange={e => setApiUrl(e.target.value)}
              placeholder="http://localhost:8000/api"
              className="flex-1 px-3 py-2 bg-background border border-outline-variant rounded font-mono text-mono-sm text-on-surface focus:border-primary focus:outline-none"
            />
            <button
              type="button"
              onClick={handleTestConnection}
              disabled={testing}
              className="px-4 py-2 bg-surface hover:bg-surface-container-low border border-outline-variant rounded font-label text-label-md text-on-surface transition-colors flex items-center gap-1.5"
            >
              <span className={`material-symbols-outlined text-[16px] ${testing ? 'animate-spin' : ''}`}>
                {testing ? 'sync' : 'network_check'}
              </span>
              <span>{testing ? 'Testing...' : 'Test Connection'}</span>
            </button>
          </div>
          <span className="text-xs text-on-surface-variant">
            Expected endpoints: <code>GET /health</code>, <code>GET /papers</code>, <code>POST /papers/upload</code>, <code>POST /chat</code>, <code>GET /papers/:id/summary</code>, <code>GET /comparison</code>, <code>GET /gaps</code>
          </span>

          {testResult && (
            <div
              className={`p-3 rounded-md text-xs font-body flex items-start gap-2 mt-2 ${
                testResult.success
                  ? 'bg-success-container text-on-success-container border border-success/30'
                  : 'bg-warning-container text-on-warning-container border border-warning/30'
              }`}
            >
              <span className="material-symbols-outlined text-[16px] shrink-0 mt-0.5">
                {testResult.success ? 'check_circle' : 'warning'}
              </span>
              <span>{testResult.message}</span>
            </div>
          )}
        </div>
      </section>

      {/* Model & Reasoning Preferences */}
      <section className="bg-surface border border-outline-variant rounded-md p-gutter-xl flex flex-col gap-gutter-md shadow-sm">
        <div className="flex items-center gap-gutter-sm">
          <span className="w-8 h-8 rounded bg-accent-violet-container text-on-accent-violet-container flex items-center justify-center">
            <span className="material-symbols-outlined text-[20px]">smart_toy</span>
          </span>
          <div className="flex flex-col">
            <h2 className="font-headline text-headline-sm text-on-surface">AI &amp; Retrieval Parameters</h2>
            <span className="text-xs text-on-surface-variant">
              Configure language model and vector grounding thresholds
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-gutter-lg max-w-2xl">
          <div className="flex flex-col gap-1.5">
            <label className="font-label text-label-md text-on-surface">LLM Reasoning Backbone</label>
            <select
              value={aiModel}
              onChange={e => setAiModel(e.target.value)}
              className="px-3 py-2 bg-background border border-outline-variant rounded font-body text-body-sm text-on-surface"
            >
              <option value="gemini-1.5-pro">Gemini 1.5 Pro (Multimodal &amp; 1M Context)</option>
              <option value="gemini-1.5-flash">Gemini 1.5 Flash (Fast Inference)</option>
              <option value="gpt-4o">GPT-4o (Academic Reasoning)</option>
              <option value="claude-3-5-sonnet">Claude 3.5 Sonnet</option>
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="font-label text-label-md text-on-surface">Dense Embedding Model</label>
            <select
              value={embeddingModel}
              onChange={e => setEmbeddingModel(e.target.value)}
              className="px-3 py-2 bg-background border border-outline-variant rounded font-body text-body-sm text-on-surface"
            >
              <option value="text-embedding-004">Google Text-Embedding-004 (768d)</option>
              <option value="bge-large-en-v1.5">BAAI BGE-Large-En-v1.5 (1024d)</option>
              <option value="text-embedding-3-large">OpenAI text-embedding-3-large (3072d)</option>
            </select>
          </div>

          <div className="flex flex-col gap-1.5 sm:col-span-2">
            <div className="flex justify-between items-center">
              <label className="font-label text-label-md text-on-surface">Sampling Temperature</label>
              <span className="font-mono text-mono-sm text-on-surface-variant">{temperature}</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={temperature}
              onChange={e => setTemperature(parseFloat(e.target.value))}
              className="accent-primary"
            />
            <span className="text-xs text-on-surface-variant">
              Lower temperatures (0.1–0.3) provide more deterministic and citation-faithful academic answers.
            </span>
          </div>
        </div>
      </section>

      {/* User & Workspace Profile */}
      <section className="bg-surface border border-outline-variant rounded-md p-gutter-xl flex flex-col gap-gutter-md shadow-sm">
        <h2 className="font-headline text-headline-sm text-on-surface">Researcher Profile</h2>
        <div className="flex items-center gap-4">
          <span className="w-16 h-16 rounded-full bg-primary-container text-primary font-headline text-headline-md flex items-center justify-center border border-outline-variant">
            EV
          </span>
          <div className="flex flex-col">
            <span className="font-title text-title-md text-on-surface font-semibold">Dr. Elena Vance</span>
            <span className="text-xs text-on-surface-variant">Principal NLP Research Scientist</span>
            <span className="text-xs text-primary mt-1 font-mono">elena.vance@reasoning-lab.org</span>
          </div>
        </div>
      </section>
    </main>
  );
};

