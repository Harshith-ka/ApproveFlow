import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { DeliverableCategory } from '../types';
import { 
  UploadCloud, 
  X, 
  FileCheck2, 
  Sparkles, 
  Image as ImageIcon, 
  Film, 
  FileText, 
  Check, 
  ArrowRight 
} from 'lucide-react';

interface NewDeliverableModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NewDeliverableModal: React.FC<NewDeliverableModalProps> = ({ isOpen, onClose }) => {
  const { projects, createDeliverable } = useApp();

  const [title, setTitle] = useState('');
  const [projectId, setProjectId] = useState(projects[0]?.id || '');
  const [category, setCategory] = useState<DeliverableCategory>('IMAGE');
  const [instructions, setInstructions] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !projectId) return;

    setIsUploading(true);
    setUploadProgress(20);

    const timer = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(() => {
            createDeliverable(title.trim(), projectId, category, instructions.trim());
            setIsUploading(false);
            onClose();
          }, 300);
          return 100;
        }
        return prev + 30;
      });
    }, 150);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-pin-drop">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden">
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-600/30 text-indigo-400 flex items-center justify-center">
              <UploadCloud className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base">Submit New Deliverable</h3>
              <p className="text-xs text-slate-400">Initialize deliverable v1.0 and review cycle</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Project Assignment
            </label>
            <select
              value={projectId}
              onChange={(e) => setProjectId(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.clientName})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Deliverable Title
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Summer Brand Hero Campaign — Key Visual"
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Deliverable Media Category
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setCategory('IMAGE')}
                className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition ${
                  category === 'IMAGE'
                    ? 'bg-indigo-50 text-indigo-700 border-indigo-600 shadow-sm'
                    : 'bg-slate-50 text-slate-600 border-slate-200'
                }`}
              >
                <ImageIcon className="w-4 h-4" />
                <span>Image / UI</span>
              </button>
              <button
                type="button"
                onClick={() => setCategory('VIDEO')}
                className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition ${
                  category === 'VIDEO'
                    ? 'bg-indigo-50 text-indigo-700 border-indigo-600 shadow-sm'
                    : 'bg-slate-50 text-slate-600 border-slate-200'
                }`}
              >
                <Film className="w-4 h-4" />
                <span>Video Motion</span>
              </button>
              <button
                type="button"
                onClick={() => setCategory('DOCUMENT')}
                className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition ${
                  category === 'DOCUMENT'
                    ? 'bg-indigo-50 text-indigo-700 border-indigo-600 shadow-sm'
                    : 'bg-slate-50 text-slate-600 border-slate-200'
                }`}
              >
                <FileText className="w-4 h-4" />
                <span>PDF Document</span>
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Client Review Instructions
            </label>
            <textarea
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              placeholder="Provide context or guidance on what elements the client should focus on..."
              className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none h-20"
            />
          </div>

          {/* S3 Signed Upload Intent Simulator Box */}
          <div className="border-2 border-dashed border-slate-300 rounded-xl p-4 text-center bg-slate-50/50">
            <UploadCloud className="w-7 h-7 text-indigo-500 mx-auto mb-1.5" />
            <div className="font-semibold text-xs text-slate-800">
              Direct S3/R2 Signed Upload Intent Ready
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">
              Supports PNG, JPG, MP4, PDF up to 1GB. Checksum SHA-256 automatically computed.
            </div>

            {isUploading && (
              <div className="mt-3">
                <div className="flex items-center justify-between text-[11px] text-slate-600 mb-1">
                  <span>Uploading and verifying checksum...</span>
                  <span className="font-mono">{uploadProgress}%</span>
                </div>
                <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-indigo-600 transition-all duration-200"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isUploading || !title.trim()}
              className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white px-5 py-2 rounded-xl text-xs font-bold shadow-md shadow-indigo-600/30 transition"
            >
              <span>Initialize Deliverable & Review</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
