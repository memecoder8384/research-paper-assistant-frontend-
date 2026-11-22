import React from "react";
import { useNavigate } from "react-router-dom";
import { useWorkspace } from "../../context/WorkspaceContext";
import {
  SearchModal,
  SearchTag,
  SearchResult,
  QuickAction,
  SearchFile,
} from "./SearchModal";
import {
  ChatTeardropText,
  ListPlus,
  Plus,
  RadioButton,
  SlidersHorizontal,
  MagnifyingGlass,
  FileArrowDown,
} from "@phosphor-icons/react";

export const GlobalSearchModal: React.FC = () => {
  const {
    isSearchModalOpen,
    setIsSearchModalOpen,
    papers,
    setIsUploadModalOpen,
    showToast,
  } = useWorkspace();
  const navigate = useNavigate();

  // Search tags
  const tags: SearchTag[] = [
    { label: "LLM Reasoning", icon: <RadioButton className="h-4 w-4" /> },
    { label: "Retrieval & RAG", icon: <RadioButton className="h-4 w-4" /> },
    { label: "Alignment & Safety", icon: <RadioButton className="h-4 w-4" /> },
    { label: "Benchmarks", icon: <RadioButton className="h-4 w-4" /> },
  ];

  // Dynamic search results from research papers
  const results: SearchResult[] = papers.map((paper) => ({
    name: paper.title,
    meta: `${paper.authors} (${paper.year})`,
    href: "#",
    actions: [
      {
        icon: <ChatTeardropText className="h-4 w-4" />,
        label: "Chat with paper",
        onClick: () => {
          navigate("/chat");
          setIsSearchModalOpen(false);
        },
      },
      {
        icon: <ListPlus className="h-4 w-4" />,
        label: "Summarize",
        onClick: () => {
          navigate("/summarizer");
          setIsSearchModalOpen(false);
        },
      },
    ],
  }));

  // Quick actions with keyboard shortcuts
  const quickActions: QuickAction[] = [
    {
      label: "Start Research Chat",
      shortcut: "C",
      icon: <ChatTeardropText className="h-[15px] w-[15px]" />,
      onClick: () => {
        navigate("/chat");
        setIsSearchModalOpen(false);
      },
    },
    {
      label: "Upload Research Paper",
      shortcut: "U",
      icon: <Plus className="h-[15px] w-[15px]" />,
      onClick: () => {
        setIsUploadModalOpen(true);
        setIsSearchModalOpen(false);
      },
    },
    {
      label: "Compare Papers Matrix",
      shortcut: "M",
      icon: <SlidersHorizontal className="h-[15px] w-[15px]" />,
      onClick: () => {
        navigate("/comparison");
        setIsSearchModalOpen(false);
      },
    },
    {
      label: "Discover Research Gaps",
      shortcut: "G",
      icon: <MagnifyingGlass className="h-[15px] w-[15px]" />,
      onClick: () => {
        navigate("/gap-analyzer");
        setIsSearchModalOpen(false);
      },
    },
  ];

  // Indexed research PDF files
  const files: SearchFile[] = papers.slice(0, 4).map((p) => ({
    name: p.filename.replace(/\.pdf$/i, ""),
    ext: ".pdf",
    icon: <FileArrowDown className="h-[15px] w-[15px]" />,
    verified: p.status === "indexed",
    onShare: () => {
      navigator.clipboard?.writeText(window.location.href);
      showToast(`Copied share link for "${p.title}"`, "success");
    },
  }));

  return (
    <SearchModal
      modal={true}
      open={isSearchModalOpen}
      onOpenChange={setIsSearchModalOpen}
      placeholder="Search for action, papers, citations, concepts..."
      tags={tags}
      results={results}
      quickActions={quickActions}
      files={files}
      onSelectResult={() => {
        navigate("/library");
        setIsSearchModalOpen(false);
      }}
    />
  );
};

export default GlobalSearchModal;
