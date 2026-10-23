import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  FileCheck2, 
  Search, 
  Filter, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Plus, 
  ArrowRight,
  Image as ImageIcon,
  Film,
  FileText
} from 'lucide-react';

interface DeliverablesViewProps {
  onOpenNewDeliverable: () => void;
}

export const DeliverablesView: React.FC<DeliverablesViewProps> = ({ onOpenNewDeliverable }) => {
  const { deliverables, selectDeliverable } = useApp();
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [search, setSearch] = useState<string>('');

  const filtered = deliverables.filter(d => {
    const latest = d.versions[d.versions.length - 1];
    const matchesCat = categoryFilter === 'ALL' || d.category === categoryFilter;
    const matchesStatus = statusFilter === 'ALL' || latest.reviewRequest.status === statusFilter;
    const matchesSearch = d.title.toLowerCase().includes(search.toLowerCase()) || 
                          d.projectName.toLowerCase().includes(search.toLowerCase()) ||
                          d.clientName.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesStatus && matchesSearch;
  });

  return (
    <div className="flex-1 overflow-y-auto bg-slate-50 p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Deliverables Library</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Immutable versioned assets, review states, and client proofing links
          </p>
        </div>

        <button
          onClick={onOpenNewDeliverable}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-md shadow-indigo-600/30 transition self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Deliverable</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2">
          {/* Category Filters */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-semibold">
            <button
              onClick={() => setCategoryFilter('ALL')}
              className={`px-3 py-1 rounded-lg transition ${
                categoryFilter === 'ALL' ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-600'
              }`}
            >
              All Types
            </button>
            <button
              onClick={() => setCategoryFilter('IMAGE')}
              className={`flex items-center gap-1 px-3 py-1 rounded-lg transition ${
                categoryFilter === 'IMAGE' ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-600'
              }`}
            >
              <ImageIcon className="w-3.5 h-3.5" />
              <span>Images</span>
            </button>
            <button
              onClick={() => setCategoryFilter('VIDEO')}
              className={`flex items-center gap-1 px-3 py-1 rounded-lg transition ${
                categoryFilter === 'VIDEO' ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-600'
              }`}
            >
              <Film className="w-3.5 h-3.5" />
              <span>Videos</span>
            </button>
          </div>

          {/* Status Filters */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-semibold">
            <button
              onClick={() => setStatusFilter('ALL')}
              className={`px-3 py-1 rounded-lg transition ${
                statusFilter === 'ALL' ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-600'
              }`}
            >
              All Statuses
            </button>
            <button
              onClick={() => setStatusFilter('IN_REVIEW')}
              className={`px-3 py-1 rounded-lg transition ${
                statusFilter === 'IN_REVIEW' ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-600'
              }`}
            >
              In Review
            </button>
            <button
              onClick={() => setStatusFilter('APPROVED')}
              className={`px-3 py-1 rounded-lg transition ${
                statusFilter === 'APPROVED' ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-600'
              }`}
            >
              Approved
            </button>
          </div>
        </div>

        {/* Search Input */}
        <div className="relative flex-1 sm:max-w-xs">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search deliverables..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
          />
        </div>
      </div>

      {/* Deliverables Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((del) => {
          const currentVer = del.versions[del.versions.length - 1];
          const revReq = currentVer.reviewRequest;
          const isApproved = revReq.status === 'APPROVED';

          return (
            <div
              key={del.id}
              onClick={() => selectDeliverable(del.id)}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md hover:border-indigo-400 transition cursor-pointer flex flex-col justify-between group"
            >
              <div>
                {/* Media Preview Box */}
                <div className="h-44 bg-slate-900 relative overflow-hidden flex items-center justify-center">
                  {del.category === 'VIDEO' ? (
                    <div className="w-full h-full flex flex-col items-center justify-center text-indigo-300 bg-slate-950">
                      <Film className="w-10 h-10 mb-2 opacity-80" />
                      <span className="text-[11px] font-mono">HTML5 Video Proof</span>
                    </div>
                  ) : (
                    <img
                      src={currentVer.fileUrl}
                      alt={del.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  )}

                  {/* Badges on preview */}
                  <div className="absolute top-3 left-3 flex items-center gap-1.5">
                    <span className="bg-black/75 backdrop-blur-md text-white font-mono text-[10px] font-bold px-2 py-0.5 rounded-md">
                      v{currentVer.versionNumber}.0
                    </span>
                    <span className="bg-black/75 backdrop-blur-md text-slate-300 text-[10px] uppercase font-bold px-2 py-0.5 rounded-md">
                      {del.category}
                    </span>
                  </div>

                  <div className="absolute top-3 right-3">
                    {isApproved ? (
                      <span className="bg-emerald-600/90 backdrop-blur-md text-white font-bold text-[10px] px-2 py-0.5 rounded-md shadow-sm">
                        APPROVED
                      </span>
                    ) : (
                      <span className="bg-indigo-600/90 backdrop-blur-md text-white font-bold text-[10px] px-2 py-0.5 rounded-md shadow-sm">
                        IN REVIEW
                      </span>
                    )}
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">
                  <div className="text-[11px] text-slate-500 font-medium mb-1">
                    {del.clientName} · {del.projectName}
                  </div>
                  <h3 className="font-bold text-slate-900 text-sm group-hover:text-indigo-600 transition-colors">
                    {del.title}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                    {del.description}
                  </p>
                </div>
              </div>

              {/* Card Footer */}
              <div className="px-5 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-400 text-[11px]">
                  {del.versions.length} version{del.versions.length > 1 ? 's' : ''} on record
                </span>
                <span className="font-bold text-indigo-600 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  <span>Open Review</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
