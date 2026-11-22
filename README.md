# Academic AI Research Assistant — Frontend

Modern, high-performance web frontend for the **Academic AI Research Assistant Workspace**, converted and enhanced from the Google Stitch design specifications.

---

## 🚀 Quick Start

### 1. Install dependencies
```bash
npm install
```

### 2. Run the development server
```bash
npm run dev
```
Open your browser at **`http://localhost:3000`**.

### 3. Build for production
```bash
npm run build
```

---

## 🖥️ Included Pages & Features

| Page | Route | Description |
|---|---|---|
| **Research Dashboard** | `/` | Workspace overview with 4 key metrics, recent research papers with status indicators (Indexed, Processing, Failed), and quick action cards. |
| **Research Paper Library** | `/library` | Search and filter papers by category chips, sort, view states (Documents, Loading, Empty), drag-and-drop PDF uploader, and retry failed indexing. |
| **AI Research Chat** | `/chat` | Citation-grounded conversational interface with document context picker, prompt suggestions, message history, and verified inline page citation cards. |
| **Paper Summarizer** | `/summarizer` | Structured 8-part academic brief (Abstract, Objectives, Problem Statement, Methodology, Findings, Results, Limitations, Conclusion), keyword tags, key insight highlights, copy to clipboard, and Markdown export. |
| **Paper Comparison** | `/comparison` | Side-by-side comparative analysis of selected papers across 7 dimensions (Objectives, Methodology, Datasets, Findings, Limitations, etc.) with AI overview cards. |
| **Research Gap Analyzer** | `/gap-analyzer` | Literature synthesis uncovering thematic coverage bars, commonly explored vs. underexplored areas, and 4 detailed research gap cards with actionable future directions. |
| **Settings & Backend Connection** | `/settings` | Live backend endpoint tester, LLM temperature and backbone selection, and embedding model configuration. |

---

## 🔌 Connecting Your Backend Repository

This frontend is completely modular and ready to integrate with your backend repository whenever you are ready:

### 1. API Configuration
Edit `.env` (or set environment variables):
```env
VITE_API_BASE_URL=http://localhost:8000/api
VITE_USE_MOCK=false
```

You can also test and switch the backend URL live anytime in the **Settings** (`/settings`) screen in the UI.

### 2. Expected API Endpoints (`src/services/api.ts`)
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/health` | Health check endpoint for connection verification |
| `GET` | `/papers` | Returns list of uploaded research papers |
| `POST` | `/papers/upload` | Multipart form upload of PDF research paper |
| `POST` | `/chat` | Sends message query with selected paper IDs and returns grounded answer with page citations |
| `GET` | `/papers/:id/summary` | Returns structured 8-part academic summary |
| `GET` | `/comparison?paperA=...&paperB=...` | Returns comparative matrix across dimensions |
| `GET` | `/gaps` | Returns literature synthesis and underexplored research gaps |

---

## 🎨 Tech Stack
- **Framework:** React 18 + TypeScript + Vite
- **Styling:** Tailwind CSS with exact Stitch color, font, and spacing design tokens
- **Routing:** React Router v6
- **Icons:** Google Material Symbols Outlined & Lucide Icons
- **Typography:** Plus Jakarta Sans & Inter & JetBrains Mono

