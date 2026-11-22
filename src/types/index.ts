export type PaperStatus = 'indexed' | 'processing' | 'failed';

export interface ResearchPaper {
  id: string;
  title: string;
  filename: string;
  uploadedAt: string;
  size: string;
  fileSizeBytes: number;
  status: PaperStatus;
  category: 'LLM Reasoning' | 'Retrieval & RAG' | 'Alignment & Safety' | 'Benchmarks' | 'Other';
  authors: string;
  year: number;
  conference?: string;
  pageCount?: number;
  abstract?: string;
  failureReason?: string;
}

export interface Citation {
  id: string;
  paperId: string;
  paperTitle: string;
  authorsYear: string;
  page: number | string;
  quote: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  content: string;
  timestamp: string;
  citations?: Citation[];
  groundedPapers?: string[];
}

export interface PaperSummary {
  paperId: string;
  title: string;
  filename: string;
  authors: string;
  pages: number;
  fileSize: string;
  abstractOverview: string;
  researchObjectives: string;
  problemStatement: string;
  methodology: string;
  keyFindings: string[];
  resultsAndDiscussion: string;
  limitations: string;
  conclusion: string;
  keywords: string[];
  keyInsights: {
    title: string;
    description: string;
    variant: 'primary' | 'violet' | 'success';
  }[];
  sourceReferences: {
    section: string;
    pages: string;
  }[];
}

export interface ComparisonMatrixRow {
  parameter: string;
  paperAValue: string;
  paperBValue: string;
  paperCValue?: string;
}

export interface ComparisonData {
  paperA: ResearchPaper;
  paperB: ResearchPaper;
  paperC?: ResearchPaper;
  coreSimilarities: string;
  architecturalDifferences: string;
  matrixRows: ComparisonMatrixRow[];
}

export interface ThematicCoverage {
  theme: string;
  percentage: number;
  variant: 'primary' | 'violet' | 'warning' | 'success';
}

export interface ResearchGap {
  id: string;
  title: string;
  tag: string;
  tagVariant: 'violet' | 'warning' | 'error' | 'primary';
  citationSources: string;
  summary: string;
  whyThisMatters: string;
  suggestedFutureDirection: string;
}

export interface WorkspaceStats {
  totalPapers: number;
  papersThisWeek: number;
  indexedCount: number;
  indexedPercentage: number;
  processingCount: number;
  failedCount: number;
  researchQueries: number;
  queriesToday: number;
  citationGroundedPercentage: number;
  summariesGenerated: number;
  activeCollections: number;
}

