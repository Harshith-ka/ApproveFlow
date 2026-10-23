import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  ShieldCheck, 
  Clock, 
  FileCheck2, 
  TrendingUp, 
  AlertCircle, 
  CheckCircle2, 
  ArrowRight, 
  Sparkles, 
  FolderKanban, 
  Users, 
  Eye,
  MessageSquare
} from 'lucide-react';

export const DashboardView: React.FC = () => {
  const { 
    deliverables, 
    projects, 
    clients, 
    threads, 
    selectDeliverable, 
    setCurrentNav,
    workspace,
    currentUser
  } = useApp();

  // Metrics
  const totalDeliverables = deliverables.length;
  const pendingReviews = deliverables.filter(d => 
    d.versions[d.versions.length - 1].reviewRequest.status === 'IN_REVIEW'
  );
  const approvedDeliverables = deliverables.filter(d => 
    d.versions[d.versions.length - 1].reviewRequest.status === 'APPROVED'
  );
  const totalComments = threads.length;

  return (
    <div className="flex-1 overflow-y-auto bg-slate-50 p-6 lg:p-8 space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold uppercase tracking-wider mb-1">
            <Sparkles className="w-4 h-4" />
            <span>Workspace Operations Center</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            Welcome back, {currentUser.name}
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm mt-1 max-w-xl leading-relaxed">
            {workspace.name} currently has <strong className="text-white">{pendingReviews.length} deliverable reviews pending client sign-off</strong>. All comments and approvals are strictly isolated per tenant.
          </p>
        </div>

        <div className="flex items-center gap-3 relative z-10">
          <button
            onClick={() => setCurrentNav('approvals')}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2.5 rounded-xl text-xs font-bold shadow-lg shadow-indigo-600/30 transition hover:scale-102"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Audit Vault</span>
          </button>
        </div>

        {/* Decorative background glow */}
        <div className="absolute -right-20 -top-20 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Pending Reviews</span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900">{pendingReviews.length}</span>
            <span className="text-xs text-amber-600 font-semibold">Active cycles</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Awaiting client review response</div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Median Turnaround</span>
            <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900">1.8</span>
            <span className="text-xs font-bold text-slate-600">Days</span>
            <span className="text-[11px] text-emerald-600 font-semibold ml-auto">-22% vs goal</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Target is under 3 days (PRD §19)</div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">On-Time Approval</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900">92%</span>
            <span className="text-xs text-emerald-600 font-semibold">+4% this month</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Hypothesis target: 75%</div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Feedback Annotations</span>
            <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <MessageSquare className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900">{totalComments}</span>
            <span className="text-xs text-purple-600 font-semibold">Pins & timestamps</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Attached strictly per file version</div>
        </div>
      </div>

      {/* Primary Section: Active Deliverables in Review */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-200 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-bold text-slate-900">Deliverables Pipeline</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Live review requests, version states, and client sign-off progress
            </p>
          </div>
          <button
            onClick={() => setCurrentNav('deliverables')}
            className="flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-800 transition"
          >
            <span>View All Deliverables</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="divide-y divide-slate-100">
          {deliverables.map((del) => {
            const currentVer = del.versions[del.versions.length - 1];
            const revReq = currentVer.reviewRequest;
            const isApproved = revReq.status === 'APPROVED';

            return (
              <div
                key={del.id}
                onClick={() => selectDeliverable(del.id)}
                className="p-5 hover:bg-slate-50 transition cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4 group"
              >
                <div className="flex items-start gap-4">
                  {/* Thumbnail */}
                  <div className="w-16 h-14 rounded-xl overflow-hidden bg-slate-900 border border-slate-200 flex-shrink-0 relative group-hover:scale-102 transition-transform">
                    {del.category === 'VIDEO' ? (
                      <div className="w-full h-full flex items-center justify-center bg-slate-950 text-indigo-400">
                        <Clock className="w-6 h-6" />
                      </div>
                    ) : (
                      <img
                        src={currentVer.fileUrl}
                        alt={del.title}
                        className="w-full h-full object-cover"
                      />
                    )}
                    <span className="absolute bottom-1 right-1 bg-black/75 text-white font-mono text-[9px] px-1 rounded">
                      v{currentVer.versionNumber}
                    </span>
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-semibold text-indigo-600 bg-indigo-50 border border-indigo-200 px-2 py-0.2 rounded">
                        {del.projectName}
                      </span>
                      <span className="text-slate-400 text-xs">·</span>
                      <span className="text-xs text-slate-500 font-medium">{del.clientName}</span>
                    </div>
                    <h3 className="font-bold text-sm text-slate-900 group-hover:text-indigo-600 transition-colors mt-0.5">
                      {del.title}
                    </h3>
                    <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">
                      {del.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 self-end md:self-center">
                  <div className="text-right">
                    <span className="text-[11px] text-slate-400 block">Due Date</span>
                    <span className="text-xs font-semibold text-slate-700">
                      {new Date(revReq.dueAt).toLocaleDateString()}
                    </span>
                  </div>

                  {/* Status Pill */}
                  <div>
                    {revReq.status === 'APPROVED' ? (
                      <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-300 font-bold text-xs px-2.5 py-1 rounded-xl">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>APPROVED</span>
                      </span>
                    ) : revReq.status === 'CHANGES_REQUESTED' ? (
                      <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-800 border border-amber-300 font-bold text-xs px-2.5 py-1 rounded-xl">
                        <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                        <span>REVISIONS</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 bg-indigo-50 text-indigo-700 border border-indigo-200 font-bold text-xs px-2.5 py-1 rounded-xl">
                        <Clock className="w-3.5 h-3.5 text-indigo-600" />
                        <span>IN REVIEW</span>
                      </span>
                    )}
                  </div>

                  <button className="p-2 text-slate-400 group-hover:text-indigo-600 rounded-lg hover:bg-slate-200 transition">
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
