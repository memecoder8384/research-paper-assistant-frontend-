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
  baseUrl: (import.meta as any).env?.VITE_API_BASE_URL || 'http://localhost:8000',
  useMockApi: (import.meta as any).env?.VITE_USE_MOCK === 'true',
};

// Check if external backend is reachable
export async function testBackendConnection(customUrl?: string): Promise<{ success: boolean; message: string; latency?: number }> {
  const targetUrl = customUrl || API_CONFIG.baseUrl;
  const startTime = Date.now();
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);
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
    return { success: false, message: err.name === 'AbortError' ? 'Connection timed out (4s)' : 'Failed to reach backend endpoint. Running in local frontend mock mode.' };
  }
}

// Papers API
export async function getPapers(): Promise<ResearchPaper[]> {
  if (!API_CONFIG.useMockApi) {
    try {
      const res = await fetch(`${API_CONFIG.baseUrl}/documents`);
      if (res.ok) {
        const data = await res.json();
        const rawDocs = Array.isArray(data) ? data : (data.documents || []);
        if (rawDocs.length > 0) {
          return rawDocs.map((doc: any) => ({
            id: doc.id || doc.document_id,
            title: (doc.filename || 'Untitled Document').replace(/\.[^/.]+$/, '').replace(/[_-]/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase()),
            filename: doc.filename || 'document.pdf',
            uploadedAt: doc.upload_timestamp ? new Date(doc.upload_timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Recently',
            size: doc.file_size ? `${(doc.file_size / (1024 * 1024)).toFixed(1)} MB` : '1.0 MB',
            fileSizeBytes: doc.file_size || 0,
            status: doc.status === 'indexed' ? 'indexed' : doc.status === 'indexing_failed' ? 'failed' : 'processing',
            category: 'Retrieval & RAG',
            authors: 'Uploaded Paper',
            year: new Date().getFullYear(),
            pageCount: doc.total_pages || 1,
            abstract: doc.message || 'Indexed research paper ready for chat, summarization, and matrix comparison.',
          }));
        }
      }
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
      const res = await fetch(`${API_CONFIG.baseUrl}/documents/upload`, {
        method: 'POST',
        body: formData,
      });
      if (res.ok) {
        const data = await res.json();
        const sizeMb = (file.size / (1024 * 1024)).toFixed(1);
        return {
          id: data.document_id || data.id,
          title: (data.filename || file.name).replace(/\.[^/.]+$/, '').replace(/[_-]/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase()),
          filename: data.filename || file.name,
          uploadedAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
          size: `${sizeMb} MB`,
          fileSizeBytes: file.size,
          status: data.status === 'indexed' ? 'indexed' : data.status === 'indexing_failed' ? 'failed' : 'processing',
          category: 'Retrieval & RAG',
          authors: 'Uploaded Paper',
          year: new Date().getFullYear(),
          conference: 'Academic Workspace',
          pageCount: data.total_pages || 1,
          abstract: data.message || 'Indexed research paper ready for question answering, summarization, and matrix comparison.',
        };
      }
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

export async function deletePaperApi(paperId: string): Promise<boolean> {
  if (!API_CONFIG.useMockApi) {
    try {
      const res = await fetch(`${API_CONFIG.baseUrl}/documents/${paperId}`, {
        method: 'DELETE',
      });
      return res.ok;
    } catch (e) {
      console.warn('Backend delete failed', e);
    }
  }
  return true;
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
        body: JSON.stringify({
          question: message,
          message: message,
          document_ids: selectedPaperIds && selectedPaperIds.length > 0 ? selectedPaperIds : undefined,
          selectedPaperIds: selectedPaperIds && selectedPaperIds.length > 0 ? selectedPaperIds : undefined,
          top_k: 5,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        const citations = (data.citations || data.sources || []).map((s: any, idx: number) => ({
          id: s.id || `cite-${Date.now()}-${idx}`,
          paperId: s.paperId || s.document_id,
          paperTitle: s.paperTitle || s.filename,
          authorsYear: s.authorsYear || s.filename,
          page: s.page || `p. ${s.page_number || s.start_page}`,
          quote: s.quote || `Passage from ${s.filename || 'paper'} (p. ${s.page_number || s.start_page})`,
        }));
        return {
          id: data.id || `msg-${Date.now()}`,
          sender: 'assistant',
          content: data.content || data.answer || '',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          citations,
          groundedPapers: data.groundedPapers || selectedPaperIds,
        };
      }
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
      const res = await fetch(`${API_CONFIG.baseUrl}/summarize`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          document_id: paperId,
          summary_type: 'detailed',
        }),
      });
      if (res.ok) {
        const data = await res.json();
        const secs = data.sections || {};
        return {
          paperId: data.document_id,
          title: (data.filename || 'Research Paper').replace(/\.[^/.]+$/, '').replace(/[_-]/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase()),
          filename: data.filename || 'paper.pdf',
          authors: 'Corpus Authors',
          pages: (data.sources && data.sources.length) ? Math.max(...data.sources.map((s: any) => s.end_page || s.page_number || 1)) : 10,
          fileSize: 'PDF Document',
          abstractOverview: data.summary || secs.objective || 'Structured summary generated by Groq LLM.',
          researchObjectives: secs.objective || 'Not explicitly detailed.',
          problemStatement: secs.problem_statement || 'Not explicitly discussed.',
          methodology: secs.methodology || 'Not explicitly detailed.',
          keyFindings: secs.results ? [secs.results] : ['Empirical findings and results available.'],
          resultsAndDiscussion: secs.results || 'Detailed analysis in document.',
          limitations: secs.limitations || 'No explicit author limitations specified.',
          conclusion: secs.conclusion || 'Conclusion synthesized from research paper.',
          keywords: ['RAG', 'Machine Learning', 'AI Research', 'Empirical Study'],
          keyInsights: [
            {
              title: 'Primary Research Objective',
              description: secs.objective || 'Investigate and address core challenges.',
              variant: 'primary',
            },
            {
              title: 'Methodological Framework',
              description: secs.methodology || 'Empirical approach using experimental evaluations.',
              variant: 'violet',
            },
            {
              title: 'Key Results & Findings',
              description: secs.results || 'Empirical validation achieved.',
              variant: 'success',
            },
          ],
          sourceReferences: (data.sources || []).map((s: any) => ({
            section: s.filename || 'Main Text',
            pages: `p. ${s.page_number || s.start_page}`,
          })),
        };
      }
    } catch (e) {
      console.warn('Backend summary request error', e);
    }
  }
  return {
    paperId,
    title: 'Summary Pending',
    filename: 'document.pdf',
    authors: 'Document Authors',
    pages: 1,
    fileSize: 'PDF',
    abstractOverview: 'Click "Generate Summary" above to synthesize an AI brief for this document.',
    researchObjectives: 'Click "Generate Summary" to extract objectives.',
    problemStatement: 'Click "Generate Summary" to extract problem statement.',
    methodology: 'Click "Generate Summary" to extract methodology.',
    keyFindings: ['Click "Generate Summary" to extract key findings.'],
    resultsAndDiscussion: 'Click "Generate Summary" to extract results.',
    limitations: 'Click "Generate Summary" to extract limitations.',
    conclusion: 'Click "Generate Summary" to extract conclusion.',
    keywords: ['AI Brief', 'Analysis'],
    keyInsights: [],
    sourceReferences: [],
  };
}

// Comparison API
export async function getComparisonData(paperAId: string, paperBId: string): Promise<ComparisonData> {
  if (!API_CONFIG.useMockApi) {
    try {
      const res = await fetch(`${API_CONFIG.baseUrl}/compare`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          document_ids: [paperAId, paperBId],
        }),
      });
      if (res.ok) {
        const data = await res.json();
        const pA = data.individual_papers && data.individual_papers[0];
        const pB = data.individual_papers && data.individual_papers[1];

        const matrixRows = [
          {
            parameter: 'Core Objective',
            paperAValue: pA?.objective || 'Study core problem',
            paperBValue: pB?.objective || 'Investigate architecture',
          },
          {
            parameter: 'Methodology / Architecture',
            paperAValue: pA?.methodology || 'Empirical evaluation',
            paperBValue: pB?.methodology || 'Comparative model design',
          },
          {
            parameter: 'Datasets / Benchmarks',
            paperAValue: pA?.dataset || 'Standard academic benchmark',
            paperBValue: pB?.dataset || 'Domain-specific evaluation',
          },
          {
            parameter: 'Key Findings',
            paperAValue: pA?.main_findings || 'Demonstrated performance gains',
            paperBValue: pB?.main_findings || 'Identified trade-offs and efficiency',
          },
          {
            parameter: 'Known Limitations',
            paperAValue: pA?.limitations || 'Scope constrained by dataset',
            paperBValue: pB?.limitations || 'Scalability bounds noted',
          },
        ];

        return {
          paperA: {
            id: paperAId,
            title: pA?.filename?.replace(/\.[^/.]+$/, '') || 'Paper A',
            filename: pA?.filename || 'paper_a.pdf',
            uploadedAt: 'Active Corpus',
            size: '2.4 MB',
            fileSizeBytes: 2400000,
            status: 'indexed',
            category: 'Retrieval & RAG',
            authors: pA?.filename || 'Paper A Authors',
            year: 2024,
          },
          paperB: {
            id: paperBId,
            title: pB?.filename?.replace(/\.[^/.]+$/, '') || 'Paper B',
            filename: pB?.filename || 'paper_b.pdf',
            uploadedAt: 'Active Corpus',
            size: '1.8 MB',
            fileSizeBytes: 1800000,
            status: 'indexed',
            category: 'LLM Reasoning',
            authors: pB?.filename || 'Paper B Authors',
            year: 2024,
          },
          coreSimilarities: (data.similarities || []).join('\n\n') || data.overall_analysis || 'Both papers tackle complementary aspects of language and knowledge retrieval.',
          architecturalDifferences: data.methodological_differences || (data.differences || []).join('\n\n') || 'Distinct algorithmic strategies are used.',
          matrixRows,
        };
      }
    } catch (e) {
      console.warn('Backend comparison failed, fallback to mock', e);
    }
  }
  return MOCK_COMPARISON;
}

// Gap Analysis API
export async function getResearchGaps(corpusIds?: string[]): Promise<{ gaps: ResearchGap[]; thematic: typeof MOCK_THEMATIC_COVERAGE }> {
  if (!API_CONFIG.useMockApi) {
    try {
      const res = await fetch(`${API_CONFIG.baseUrl}/research-gaps`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          document_ids: corpusIds && corpusIds.length > 0 ? corpusIds : undefined,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        const gaps: ResearchGap[] = (data.potential_research_gaps || []).map((item: any, idx: number) => ({
          id: `gap-${idx + 1}`,
          title: item.title,
          tag: item.gap_type === 'explicit_limitation' ? 'Explicit Author Limitation' : 'Opportunity',
          tagVariant: item.gap_type === 'explicit_limitation' ? 'warning' : 'primary',
          citationSources: (item.supporting_sources || []).map((s: any) => `${s.filename} (p. ${s.page_number || s.start_page})`).join(', ') || 'Corpus documents',
          summary: item.description,
          whyThisMatters: item.why_identified || item.supporting_evidence || 'Critical for advancing state-of-the-art methodology.',
          suggestedFutureDirection: item.suggested_future_direction || 'Investigate empirical improvements.',
        }));

        return {
          gaps: gaps.length > 0 ? gaps : MOCK_RESEARCH_GAPS,
          thematic: MOCK_THEMATIC_COVERAGE,
        };
      }
    } catch (e) {
      console.warn('Backend gaps failed, fallback to mock', e);
    }
  }
  return {
    gaps: MOCK_RESEARCH_GAPS,
    thematic: MOCK_THEMATIC_COVERAGE,
  };
}
