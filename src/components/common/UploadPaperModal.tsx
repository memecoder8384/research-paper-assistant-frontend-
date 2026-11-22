import React, { useState, useRef } from 'react';
import { useWorkspace } from '../../context/WorkspaceContext';
import { uploadPaperFile } from '../../services/api';

export const UploadPaperModal: React.FC = () => {
  const { isUploadModalOpen, setIsUploadModalOpen, addPaper, showToast } = useWorkspace();
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isUploadModalOpen) return null;

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const processFile = async (file: File) => {
    if (!file.name.toLowerCase().endsWith('.pdf')) {
      showToast('Please upload a PDF document.', 'warning');
      return;
    }
    if (file.size > 50 * 1024 * 1024) {
      showToast('File size exceeds the 50 MB limit.', 'error');
      return;
    }

    setUploading(true);
    setUploadProgress(15);

    const progressTimer = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressTimer);
          return 90;
        }
        return prev + 25;
      });
    }, 200);

    try {
      const newPaper = await uploadPaperFile(file);
      clearInterval(progressTimer);
      setUploadProgress(100);
      setTimeout(() => {
        addPaper(newPaper);
        setUploading(false);
        setUploadProgress(0);
        setIsUploadModalOpen(false);
      }, 400);
    } catch (err) {
      clearInterval(progressTimer);
      setUploading(false);
      showToast('Failed to upload paper. Please try again.', 'error');
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFile(e.target.files[0]);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
        onClick={() => !uploading && setIsUploadModalOpen(false)}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-lg bg-surface border border-outline-variant rounded-xl shadow-2xl overflow-hidden z-10 flex flex-col animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-outline-variant">
          <div className="flex items-center gap-2.5">
            <span className="w-8 h-8 rounded bg-primary-container text-primary flex items-center justify-center">
              <span className="material-symbols-outlined text-[20px]">upload_file</span>
            </span>
            <h2 className="font-headline text-headline-sm text-on-surface">Upload Research Paper</h2>
          </div>
          {!uploading && (
            <button
              onClick={() => setIsUploadModalOpen(false)}
              className="p-1.5 rounded text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          )}
        </div>

        {/* Content */}
        <div className="p-6 flex flex-col gap-4">
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf"
            className="hidden"
            onChange={handleFileInputChange}
          />

          {uploading ? (
            <div className="py-8 flex flex-col items-center justify-center gap-4 text-center">
              <span className="w-12 h-12 rounded-full bg-primary-container text-primary flex items-center justify-center animate-spin">
                <span className="material-symbols-outlined text-[24px]">sync</span>
              </span>
              <div className="flex flex-col gap-1 w-full max-w-xs">
                <span className="font-title text-title-md text-on-surface">Uploading &amp; Indexing Paper...</span>
                <span className="font-body text-body-sm text-on-surface-variant">Extracting text, figures, and vector embeddings</span>
                <div className="w-full bg-surface-container-low rounded-full h-2 mt-2 overflow-hidden">
                  <div
                    className="bg-primary h-full rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </div>
            </div>
          ) : (
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-lg p-8 flex flex-col items-center justify-center gap-3 text-center cursor-pointer transition-colors ${
                isDragging
                  ? 'border-primary bg-primary-container/20'
                  : 'border-outline hover:border-primary hover:bg-surface-container-low/50'
              }`}
            >
              <span className="w-14 h-14 rounded-full bg-primary-container text-primary flex items-center justify-center">
                <span className="material-symbols-outlined text-[28px]">cloud_upload</span>
              </span>
              <div className="flex flex-col gap-1">
                <span className="font-title text-title-md text-on-surface">
                  Click to browse or drop academic PDF
                </span>
                <span className="font-body text-body-sm text-on-surface-variant">
                  Supports papers up to 50 MB · Automatic section parsing &amp; DPR indexing
                </span>
              </div>
              <button
                type="button"
                className="mt-2 inline-flex items-center gap-1.5 px-4 py-2 bg-surface hover:bg-surface-container-low text-on-surface border border-outline-variant rounded font-label text-label-md transition-colors"
              >
                <span className="material-symbols-outlined text-[16px]">folder_open</span>
                <span>Select from Computer</span>
              </button>
            </div>
          )}

          {/* Hint Info */}
          <div className="bg-surface-container-low rounded-md p-3 flex items-start gap-2.5 text-xs text-on-surface-variant">
            <span className="material-symbols-outlined text-[16px] text-primary shrink-0 mt-0.5">info</span>
            <span>
              Uploaded documents are automatically chunked and indexed into the active workspace vector database, enabling instant citation-grounded research chat, structured summaries, and matrix comparison.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

