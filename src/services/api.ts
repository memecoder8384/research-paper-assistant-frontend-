import { ResearchPaper, ChatMessage, PaperSummary, ComparisonData, ResearchGap, WorkspaceStats } from '../types';
import {
  INITIAL_PAPERS,
  MOCK_WORKSPACE_STATS,
  MOCK_SUMMARIES,
  MOCK_COMPARISON,
  MOCK_RESEARCH_GAPS,
  MOCK_THEMATIC_COVERAGE,
} from './mockData';

// Configuration: can be overridden by environment variable or settings
export const API_CONFIG = {
  baseUrl: (import.meta as any).env?.VITE_API_BASE_URL || 'http://localhost:8000/api',
  useMockApi: (import.meta as any).env?.VITE_USE_MOCK !== 'false',
};

// Check if external backend is reachable
export async function testBackendConnection(customUrl?: string): Promise<{ success: boolean; message: string; latency?: number }> {
  const targetUrl = customUrl || API_CONFIG.baseUrl;
  const startTime = Date.now();
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);
    const res = await fetch(`${targetUrl}/health`, {
      method: 'GET',
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    const latency = Date.now() - startTime;
    if (res.ok) {
      return { success: true, message: `Connected successfully (${latency}ms)`, latency };
    }
    return { success: false, message: `Backend returned status ${res.status}: ${res.statusText}` };
  } catch (err: any) {
    return { success: false, message: err.name === 'AbortError' ? 'Connection timed out (3s)' : 'Failed to reach backend endpoint. Running in local frontend mock mode.' };
  }
}

// Papers API
export async function getPapers(): Promise<ResearchPaper[]> {
  if (!API_CONFIG.useMockApi) {
    try {
      const res = await fetch(`${API_CONFIG.baseUrl}/papers`);
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn('API error, falling back to mock data', e);
    }
  }
  return [...INITIAL_PAPERS];
}

export async function uploadPaperFile(file: File): Promise<ResearchPaper> {
  if (!API_CONFIG.useMockApi) {
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch(`${API_CONFIG.baseUrl}/papers/upload`, {
        method: 'POST',
        body: formData,
      });
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn('Backend upload failed, simulating in frontend', e);
    }
  }

  // Frontend mock simulation
  const sizeMb = (file.size / (1024 * 1024)).toFixed(1);
  const newPaper: ResearchPaper = {
    id: `paper-${Date.now()}`,
    title: file.name.replace(/\.[^/.]+$/, '').replace(/[_-]/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
    filename: file.name,
    uploadedAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    size: `${sizeMb} MB`,
    fileSizeBytes: file.size,
    status: 'indexed',
    category: 'LLM Reasoning',
    authors: 'Dr. Elena Vance et al.',
    year: new Date().getFullYear(),
    conference: 'Academic Workspace',
    pageCount: Math.floor(Math.random() * 20) + 8,
    abstract: 'Uploaded research document indexed for question answering, summarization, and matrix comparison.',
  };
  return newPaper;
}

// Chat API
export async function sendChatMessage(
  message: string,
  selectedPaperIds: string[],
  history: ChatMessage[]
): Promise<ChatMessage> {
  if (!API_CONFIG.useMockApi) {
    try {
      const res = await fetch(`${API_CONFIG.baseUrl}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, selectedPaperIds, history }),
      });
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn('Backend chat failed, falling back to intelligent mock', e);
    }
  }

  // Realistic mock response generator based on query
  await new Promise(r => setTimeout(r, 600));

  const lower = message.toLowerCase();
  let responseContent = '';
  let citations = [
    {
      id: `cite-${Date.now()}-1`,
      paperId: 'paper-1',
      paperTitle: 'Retrieval-Augmented Generation (Lewis et al. 2020)',
      authorsYear: 'Lewis et al. (2020) — RAG',
      page: 'p. 3',
      quote: '"RAG-Token model can predict each target token based on a different document, combining information across several passages."',
    },
    {
      id: `cite-${Date.now()}-2`,
      paperId: 'paper-1',
      paperTitle: 'Retrieval-Augmented Generation (Lewis et al. 2020)',
      authorsYear: 'Lewis et al. (2020) — RAG',
      page: 'p. 6',
      quote: '"RAG-Sequence outperforms RAG-Token on Jeopardy question generation, while RAG-Token achieves higher diversity on MS-MARCO."',
    }
  ];

  if (lower.includes('method') || lower.includes('methodology')) {
    responseContent = `### Grounded Methodology Summary\n\nAcross the selected corpus, the methodology hinges on two distinct components:\n\n1. **Retriever Architecture:** Utilizes a dense bi-encoder based on Dense Passage Retrieval (DPR) with FAISS indexing for Maximum Inner Product Search (MIPS) across 21M Wikipedia passages.\n2. **Generator Formulation:** A pre-trained sequence-to-sequence model (BART-large) conditions generation on concatenated query and retrieved passage tokens, optimized via end-to-end marginalization.\n\nEmpirical benchmarks show this hybrid design resolves factual staleness without modifying model weights.`;
  } else if (lower.includes('finding') || lower.includes('result')) {
    responseContent = `### Key Empirical Findings\n\nThe research demonstrates that non-parametric retrieval memory yields significant advantages:\n\n- **Exact Match Benchmarks:** RAG achieves **44.5 EM** on Natural Questions, surpassing even substantially larger parametric-only models like T5-11B.\n- **Factuality Gain:** Human annotators reported a **42.7% preference** for factual accuracy compared to standard BART (which scored only 7.1%).\n- **Continuous Knowledge Updates:** Replacing the 2016 Wikipedia index with a 2018 index raised temporal query accuracy from 12% to 68% without any parameter retraining.`;
  } else if (lower.includes('limitation')) {
    responseContent = `### Identified Research Limitations\n\nThe primary constraints documented in the literature include:\n\n- **Retrieval Latency:** Dense vector lookup scales linearly with index size and demands substantial GPU memory during inference.\n- **Parametric Prior Dominance:** When pre-training priors are strong, the generator occasionally produces hallucinations that ignore retrieved passages.\n- **Single-Hop Limitation:** The architecture struggles when answering complex questions requiring iterative multi-hop reasoning steps across disjoint documents.`;
  } else {
    responseContent = `### Analysis Based on Selected Literature\n\nAnalyzing your query against the active corpus (${selectedPaperIds.length} papers selected):\n\n- **Architectural Synergy:** Decoupling parametric computation (language fluency and grammar) from non-parametric storage (factual knowledge bases) allows models to remain verifiable and computationally efficient.\n- **Citation Grounding:** Every claim generated is traced to specific passage tokens retrieved during beam search, drastically mitigating hallucination risks.`;
  }

  return {
    id: `msg-${Date.now()}`,
    sender: 'assistant',
    content: responseContent,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    citations,
    groundedPapers: selectedPaperIds,
  };
}

// Summary API
export async function getPaperSummary(paperId: string): Promise<PaperSummary> {
  if (!API_CONFIG.useMockApi) {
    try {
      const res = await fetch(`${API_CONFIG.baseUrl}/papers/${paperId}/summary`);
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn('Backend summary failed, fallback to mock', e);
    }
  }
  return MOCK_SUMMARIES[paperId] || MOCK_SUMMARIES['paper-1'];
}

// Comparison API
export async function getComparisonData(paperAId: string, paperBId: string): Promise<ComparisonData> {
  if (!API_CONFIG.useMockApi) {
    try {
      const res = await fetch(`${API_CONFIG.baseUrl}/comparison?paperA=${paperAId}&paperB=${paperBId}`);
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn('Backend comparison failed, fallback to mock', e);
    }
  }
  return MOCK_COMPARISON;
}

// Gap Analysis API
export async function getResearchGaps(): Promise<{ gaps: ResearchGap[]; thematic: typeof MOCK_THEMATIC_COVERAGE }> {
  if (!API_CONFIG.useMockApi) {
    try {
      const res = await fetch(`${API_CONFIG.baseUrl}/gaps`);
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn('Backend gaps failed, fallback to mock', e);
    }
  }
  return {
    gaps: MOCK_RESEARCH_GAPS,
    thematic: MOCK_THEMATIC_COVERAGE,
  };
}

