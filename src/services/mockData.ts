import { ResearchPaper, PaperSummary, ComparisonData, ResearchGap, ThematicCoverage, WorkspaceStats } from '../types';

export const INITIAL_PAPERS: ResearchPaper[] = [
  {
    id: 'paper-1',
    title: 'Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks',
    filename: 'lewis_2020_rag.pdf',
    uploadedAt: 'Nov 20, 2026',
    size: '3.8 MB',
    fileSizeBytes: 3984588,
    status: 'indexed',
    category: 'Retrieval & RAG',
    authors: 'Patrick Lewis, Ethan Perez, Aleksandara Piktus, et al.',
    year: 2020,
    conference: 'NeurIPS 2020',
    pageCount: 19,
    abstract: 'We explore retrieval-augmented generation (RAG) models which combine pre-trained parametric and non-parametric memory for language generation.'
  },
  {
    id: 'paper-2',
    title: 'Attention Is All You Need',
    filename: 'vaswani_2017_transformers.pdf',
    uploadedAt: 'Nov 19, 2026',
    size: '2.2 MB',
    fileSizeBytes: 2306867,
    status: 'indexed',
    category: 'LLM Reasoning',
    authors: 'Ashish Vaswani, Noam Shazeer, Niki Parmar, et al.',
    year: 2017,
    conference: 'NeurIPS 2017',
    pageCount: 15,
    abstract: 'We propose the Transformer, a model architecture eschewing recurrence and instead relying entirely on an attention mechanism.'
  },
  {
    id: 'paper-3',
    title: 'Constitutional AI: Harmlessness from AI Feedback',
    filename: 'bai_2022_constitutional_ai.pdf',
    uploadedAt: 'Nov 22, 2026',
    size: '5.1 MB',
    fileSizeBytes: 5347737,
    status: 'processing',
    category: 'Alignment & Safety',
    authors: 'Yuntao Bai, Saurav Kadavath, Sandipan Kundu, et al.',
    year: 2022,
    conference: 'arXiv preprint',
    pageCount: 42,
    abstract: 'We experiment with methods for training a harmless AI assistant through self-improvement, without human feedback labels for harms.'
  },
  {
    id: 'paper-4',
    title: 'Chain-of-Thought Prompting Elicits Reasoning in LLMs',
    filename: 'wei_2022_cot_prompting.pdf',
    uploadedAt: 'Nov 17, 2026',
    size: '4.4 MB',
    fileSizeBytes: 4613734,
    status: 'indexed',
    category: 'LLM Reasoning',
    authors: 'Jason Wei, Xuezhi Wang, Dale Schuurmans, et al.',
    year: 2022,
    conference: 'NeurIPS 2022',
    pageCount: 38,
    abstract: 'We explore how generating a chain of thought—a series of intermediate reasoning steps—significantly improves the ability of large language models to perform complex reasoning.'
  },
  {
    id: 'paper-5',
    title: 'Learning and Evaluating Generalizable Boltzmann Machines',
    filename: 'scan_1998_hinton_boltzmann.pdf',
    uploadedAt: 'Nov 15, 2026',
    size: '8.9 MB',
    fileSizeBytes: 9332326,
    status: 'failed',
    failureReason: 'scanned PDF requires OCR pre-processing.',
    category: 'Other',
    authors: 'Geoffrey E. Hinton et al.',
    year: 1998,
    conference: 'Neural Computation',
    pageCount: 24,
    abstract: 'A classic evaluation of generalized Boltzmann architectures across density estimation tasks.'
  },
  {
    id: 'paper-6',
    title: 'Measuring Massive Multitask Language Understanding (MMLU)',
    filename: 'hendrycks_2021_mmlu.pdf',
    uploadedAt: 'Nov 10, 2026',
    size: '1.9 MB',
    fileSizeBytes: 1992294,
    status: 'indexed',
    category: 'Benchmarks',
    authors: 'Dan Hendrycks, Collin Burns, Steven Basart, et al.',
    year: 2021,
    conference: 'ICLR 2021',
    pageCount: 28,
    abstract: 'We propose a benchmark covering 57 subjects across STEM, humanities, and social sciences.'
  }
];

export const MOCK_WORKSPACE_STATS: WorkspaceStats = {
  totalPapers: 48,
  papersThisWeek: 6,
  indexedCount: 45,
  indexedPercentage: 93.8,
  processingCount: 2,
  failedCount: 1,
  researchQueries: 312,
  queriesToday: 24,
  citationGroundedPercentage: 98.4,
  summariesGenerated: 34,
  activeCollections: 4,
};

export const MOCK_SUMMARIES: Record<string, PaperSummary> = {
  'paper-1': {
    paperId: 'paper-1',
    title: 'Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks',
    filename: 'lewis_2020_rag.pdf',
    authors: 'Patrick Lewis, Ethan Perez, et al. (NeurIPS 2020)',
    pages: 19,
    fileSize: '3.8 MB',
    abstractOverview: 'This paper introduces Retrieval-Augmented Generation (RAG), a hybrid architecture that combines pre-trained parametric sequence-to-sequence language models (BART) with a non-parametric dense vector index of Wikipedia accessed via Dense Passage Retrieval (DPR).',
    researchObjectives: 'Enable general-purpose language models to access, update, and cite external factual knowledge without full model retraining.',
    problemStatement: 'Purely parametric LLMs store knowledge implicitly in weights, making provenance opaque, factual updates expensive, and hallucinations frequent.',
    methodology: 'A bi-encoder retriever (DPR) encodes queries and 21M Wikipedia passages into MIPS-indexed vectors. The top-K retrieved documents are concatenated with the input and fed into a BART-large generator, trained end-to-end by marginalizing over latent documents at either the sequence level (RAG-Sequence) or token level (RAG-Token).',
    keyFindings: [
      'Sets state-of-the-art accuracy across Natural Questions (44.5 EM), WebQuestions, and CuratedTrec, outperforming parametric-only T5-11B.',
      'Generates more specific, diverse, and factually grounded text than BART on Jeopardy question generation and MS-MARCO.',
      'Swapping the non-parametric Wikipedia index updates world knowledge immediately with zero weight updates.'
    ],
    resultsAndDiscussion: 'Human evaluators preferred RAG outputs over BART in 42.7% of factuality comparisons (vs. 7.1% for BART). RAG-Sequence excels at single-fact extraction, whereas RAG-Token synthesizes multi-passage answers more effectively.',
    limitations: 'Retrieval latency scales with index size, and the generator can still ignore retrieved context when parametric priors are strong.',
    conclusion: 'Hybrid parametric and non-parametric memory establishes a practical foundation for verifiable, updatable knowledge-intensive NLP systems.',
    keywords: ['RAG', 'Dense Passage Retrieval', 'Non-Parametric Memory', 'Open-Domain QA', 'BART-large'],
    keyInsights: [
      {
        title: 'Zero-Retraining Updates',
        description: 'Replacing the 2016 Wikipedia index with 2018 Wikipedia raised temporal QA accuracy from 12% to 68% without retraining.',
        variant: 'primary'
      },
      {
        title: 'Factuality Gain',
        description: '42.7% human preference for factual accuracy over pure-parametric BART baseline.',
        variant: 'violet'
      }
    ],
    sourceReferences: [
      { section: 'Model Formulations', pages: 'p. 2–3' },
      { section: 'Open-Domain QA Benchmarks', pages: 'p. 5–6' },
      { section: 'Index Hot-Swap Ablation', pages: 'p. 8' }
    ]
  },
  'paper-2': {
    paperId: 'paper-2',
    title: 'Attention Is All You Need',
    filename: 'vaswani_2017_transformers.pdf',
    authors: 'Ashish Vaswani, Noam Shazeer, et al. (NeurIPS 2017)',
    pages: 15,
    fileSize: '2.2 MB',
    abstractOverview: 'The dominant sequence transduction models are based on complex recurrent or convolutional neural networks. We propose the Transformer, based entirely on attention mechanisms, dispensing with recurrence and convolutions entirely.',
    researchObjectives: 'Eliminate recurrent computation to allow significantly more parallelization during training and better capture long-range token relationships.',
    problemStatement: 'Recurrent models compute representations sequentially, forbidding parallel processing within training examples and suffering from vanishing gradients over long sequences.',
    methodology: 'Proposes multi-head self-attention mechanisms and scaled dot-product attention combined with sinusoidal positional encodings in a feedforward encoder-decoder structure.',
    keyFindings: [
      'Attains 28.4 BLEU on the WMT 2014 English-to-German translation task, improving by over 2 BLEU over existing state-of-the-art.',
      'On English-to-French translation, achieves 41.8 BLEU after training for 3.5 days on 8 GPUs, a fraction of previous training costs.',
      'Generalizes successfully to English constituency parsing with little task-specific tuning.'
    ],
    resultsAndDiscussion: 'Self-attention layers connect all positions in constant O(1) sequential operations compared to O(n) for recurrent layers, dramatically lowering training wall-clock times.',
    limitations: 'Quadratic O(n²) memory and computation complexity with sequence length n restricts processing of extremely long document contexts.',
    conclusion: 'Pure self-attention models replace sequential recurrence with superior parallelization, becoming the baseline for modern NLP foundations.',
    keywords: ['Transformer', 'Self-Attention', 'Multi-Head Attention', 'Machine Translation', 'Seq2Seq'],
    keyInsights: [
      {
        title: 'O(1) Path Length',
        description: 'Maximum path length between any two words is 1 operation, compared to n in standard LSTMs.',
        variant: 'primary'
      },
      {
        title: 'Massive Training Speedup',
        description: 'Trained in 3.5 days on 8 P100 GPUs compared to weeks required for recurrent ensembles.',
        variant: 'success'
      }
    ],
    sourceReferences: [
      { section: 'Attention Mechanism & Scaling', pages: 'p. 3–4' },
      { section: 'Machine Translation Results', pages: 'p. 7–8' },
      { section: 'Complexity per Layer Analysis', pages: 'p. 6' }
    ]
  },
  'paper-4': {
    paperId: 'paper-4',
    title: 'Chain-of-Thought Prompting Elicits Reasoning in LLMs',
    filename: 'wei_2022_cot_prompting.pdf',
    authors: 'Jason Wei, Xuezhi Wang, et al. (NeurIPS 2022)',
    pages: 38,
    fileSize: '4.4 MB',
    abstractOverview: 'This work shows that generating a sequence of short intermediate reasoning steps before arriving at a final answer dramatically unlocks multi-step arithmetic, commonsense, and symbolic reasoning in large language models.',
    researchObjectives: 'Enable pretrained language models to solve complex reasoning problems without fine-tuning or modifying underlying weights.',
    problemStatement: 'Standard prompting requires language models to produce final answers immediately, leading to high failure rates in multi-step problem solving.',
    methodology: 'Provides few-shot exemplars containing input question, step-by-step reasoning thought chains, and final answer tokens.',
    keyFindings: [
      'Chain-of-thought prompting improves PaLM 540B accuracy on GSM8K from 17.9% to 56.9%, setting a new state-of-the-art.',
      'The reasoning ability is an emergent capability that appears only at scale (~100B+ parameters).',
      'Effective across arithmetic reasoning, commonsense question answering, and symbolic manipulation tasks.'
    ],
    resultsAndDiscussion: 'Decomposing problems into intermediate steps allows models to allocate more computational tokens to harder problems.',
    limitations: 'Susceptible to reasoning hallucinations where intermediate steps are factually plausible but logically inconsistent.',
    conclusion: 'Chain-of-thought prompting is a simple and broadly applicable method for boosting reasoning in LLMs at scale.',
    keywords: ['Chain-of-Thought', 'Reasoning', 'Emergent Abilities', 'Few-Shot Prompting', 'GSM8K'],
    keyInsights: [
      {
        title: 'Emergent at Scale',
        description: 'Performance gains are virtually flat below 50B parameters and surge rapidly above 100B.',
        variant: 'violet'
      },
      {
        title: 'Triple Performance on Math',
        description: 'Boosted GSM8K benchmark score from 17.9% to 56.9% without any parameter fine-tuning.',
        variant: 'primary'
      }
    ],
    sourceReferences: [
      { section: 'Arithmetic Reasoning (GSM8K, SVAMP)', pages: 'p. 4–7' },
      { section: 'Emergent Capability Ablations', pages: 'p. 9–10' },
      { section: 'Robustness to Prompt Variations', pages: 'p. 12' }
    ]
  }
};

export const MOCK_COMPARISON: ComparisonData = {
  paperA: INITIAL_PAPERS[1], // Attention Is All You Need
  paperB: INITIAL_PAPERS[0], // RAG
  coreSimilarities: 'Both papers rely on multi-head self-attention encoder-decoder Transformer backbones and evaluate sequence generation quality on standard NLP benchmarks using BLEU/EM metrics.',
  architecturalDifferences: 'Vaswani et al. (2017) store all knowledge parametrically inside static weights, whereas Lewis et al. (2020) decouple reasoning from factual storage via a hot-swappable dense Wikipedia index.',
  matrixRows: [
    {
      parameter: 'Research Objective',
      paperAValue: 'Replace recurrent and convolutional sequence models with pure self-attention for parallelizable sequence transduction.',
      paperBValue: 'Augment pre-trained seq2seq Transformers with non-parametric dense retrieval for knowledge-intensive NLP tasks.'
    },
    {
      parameter: 'Problem Statement',
      paperAValue: 'Sequential RNN computation prevents parallelization across training examples and struggles with long-range dependencies.',
      paperBValue: 'Parametric LLMs cannot easily update factual knowledge, lack provenance, and hallucinate on rare entities.'
    },
    {
      parameter: 'Methodology',
      paperAValue: '6-layer encoder-decoder Transformer using scaled dot-product multi-head attention and sinusoidal positional encodings.',
      paperBValue: 'DPR bi-encoder retriever + FAISS MIPS index paired with BART-large generator, marginalized via RAG-Sequence & RAG-Token.'
    },
    {
      parameter: 'Dataset',
      paperAValue: 'WMT 2014 English-German (4.5M sentence pairs) and English-French (36M pairs), plus WSJ Constituency Parsing.',
      paperBValue: 'Natural Questions, TriviaQA, WebQuestions, CuratedTrec, MS-MARCO, and FEVER over a 21M-passage Wikipedia dump.'
    },
    {
      parameter: 'Key Findings',
      paperAValue: 'Achieved 28.4 BLEU (EN-DE) and 41.8 BLEU (EN-FR) at a fraction of the training FLOPs of prior RNN ensembles.',
      paperBValue: 'Achieved 44.5 EM on Natural Questions; hot-swapping the index updates temporal facts without retraining weights.'
    },
    {
      parameter: 'Limitations',
      paperAValue: 'Quadratic O(n²) memory complexity with respect to sequence length; fixed context window during inference.',
      paperBValue: 'Additional vector search latency and index memory footprint; retrieval errors propagate directly to generation.'
    },
    {
      parameter: 'Future Scope',
      paperAValue: 'Extend self-attention to local/restricted attention for images, audio, and video modalities.',
      paperBValue: 'Jointly pre-train retriever and generator from scratch and support multi-hop iterative retrieval.'
    }
  ]
};

export const MOCK_THEMATIC_COVERAGE: ThematicCoverage[] = [
  { theme: 'Dense Passage Retrieval & Grounding', percentage: 78, variant: 'primary' },
  { theme: 'Chain-of-Thought & Stepwise Reasoning', percentage: 64, variant: 'primary' },
  { theme: 'Multi-Hop Retrieval Verification', percentage: 32, variant: 'violet' },
  { theme: 'Low-Resource & Non-English Grounding', percentage: 18, variant: 'warning' }
];

export const MOCK_RESEARCH_GAPS: ResearchGap[] = [
  {
    id: 'gap-1',
    title: 'Interleaved Retrieval Within Chain-of-Thought Reasoning',
    tag: 'Underexplored Topic',
    tagVariant: 'violet',
    citationSources: 'Lewis p. 8 · Wei p. 11',
    summary: 'RAG retrieves passages only once before generation, while CoT relies purely on parametric memory for intermediate reasoning steps.',
    whyThisMatters: 'Multi-hop scientific queries fail when intermediate reasoning steps hallucinate facts not present in the initial top-K retrieval.',
    suggestedFutureDirection: 'Design an uncertainty-triggered retrieval loop that queries the vector index mid-reasoning whenever token entropy exceeds a threshold.'
  },
  {
    id: 'gap-2',
    title: 'Parametric Prior Override in Aligned Generators',
    tag: 'Contradictory Findings',
    tagVariant: 'warning',
    citationSources: 'Lewis p. 7 · Bai p. 14',
    summary: 'RLHF/Constitutional alignment strengthens model confidence, yet causes generators to ignore newly retrieved contradictory evidence.',
    whyThisMatters: 'Reduces reliability of RAG systems in fast-evolving medical, legal, and scientific domains where retrieved facts supersede pre-training data.',
    suggestedFutureDirection: 'Evaluate context-faithfulness fine-tuning objectives that penalize parametric overrides when retrieved passages have high cosine similarity.'
  },
  {
    id: 'gap-3',
    title: 'Evaluation Bias Toward Short-Form Exact Match',
    tag: 'Methodological Limitation',
    tagVariant: 'error',
    citationSources: 'Vaswani p. 9 · Lewis p. 4',
    summary: 'Benchmarks rely heavily on Exact Match (EM) and BLEU, which fail to measure citation precision or synthesis quality in long-form academic answers.',
    whyThisMatters: 'Models optimized for EM scores may produce brittle answers that lack nuanced academic caveats or cross-paper synthesis.',
    suggestedFutureDirection: 'Construct a claim-level attribution benchmark measuring both citation recall and entailment across multi-document literature reviews.'
  },
  {
    id: 'gap-4',
    title: 'Low-Resource Multilingual Dense Indexing',
    tag: 'Cross-Lingual Gap',
    tagVariant: 'primary',
    citationSources: 'Lewis p. 9 · Wei p. 15',
    summary: 'All four studies evaluate primarily on English corpora, leaving cross-lingual retrieval and reasoning performance largely unquantified.',
    whyThisMatters: 'Non-English scientific literature remains inaccessible to standard English-centric RAG pipelines without translation loss.',
    suggestedFutureDirection: 'Benchmark multilingual bi-encoders with cross-lingual CoT prompting on regional scientific repositories.'
  }
];

