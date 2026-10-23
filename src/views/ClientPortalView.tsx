import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  ShieldCheck, 
  Clock, 
  CheckCircle2, 
  ArrowRight, 
  Sparkles, 
  FileCheck2, 
  UserCheck, 
  AlertCircle,
  FolderKanban
} from 'lucide-react';

export const ClientPortalView: React.FC = () => {
  const { 
    currentUser, 
    deliverables, 
    selectDeliverable, 
    workspace,
    setCurrentNav 
  } = useApp();

  // Filter deliverables assigned to this client organization
  const assignedDeliverables = deliverables.filter(d => 
    d.clientName.toLowerCase().includes('starlight') || 
    currentUser.organizationName?.toLowerCase().includes(d.clientName.toLowerCase().split(' ')[0])
  );

  const pendingSignOff = assignedDeliverables.filter(d => {
    const latest = d.versions[d.versions.length - 1];
    return latest.reviewRequest.status === 'IN_REVIEW' || latest.reviewRequest.status === 'CHANGES_REQUESTED';
  });

  const completedApprovals = assignedDeliverables.filter(d => {
    const latest = d.versions[d.versions.length - 1];
    return latest.reviewRequest.status === 'APPROVED';
  });

  const isClientApprover = currentUser.role === 'CLIENT_APPROVER';

  return (
    <div className="flex-1 overflow-y-auto bg-slate-50 p-6 lg:p-8 space-y-8">
      {/* Streamlined Client Portal Banner */}
      <div className="bg-gradient-to-r from-indigo-900 via-indigo-950 to-slate-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-indigo-800/40 relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <div className="flex items-center gap-2 text-indigo-300 text-xs font-bold uppercase tracking-wider mb-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Client Sign-Off Portal · {currentUser.organizationName || 'Starlight Brands'}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            Welcome, {currentUser.name}
          </h1>
          <p className="text-indigo-200 text-xs sm:text-sm mt-1.5 leading-relaxed">
            Review creative deliverables submitted by <strong>{workspace.name}</strong>. Drop visual annotation pins on designs, comment on video timestamps, and execute binding approvals.
          </p>

          <div className="mt-4 flex flex-wrap items-center gap-3">
            <div className={`px-3 py-1 rounded-xl text-xs font-bold flex items-center gap-1.5 ${
              isClientApprover 
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/30' 
                : 'bg-amber-500/20 text-amber-300 border border-amber-400/30'
            }`}>
              <UserCheck className="w-3.5 h-3.5" />
              <span>
                {isClientApprover ? 'Authorized Client Signatory (Full Sign-Off Privileges)' : 'Client Reviewer (Feedback Only)'}
              </span>
            </div>
          </div>
        </div>

        {/* Decorative circle */}
        <div className="absolute right-0 top-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
      </div>

      {/* Pending Reviews Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-indigo-600" />
            <h2 className="text-lg font-bold text-slate-900">
              Pending Your Review ({pendingSignOff.length})
            </h2>
          </div>
          <span className="text-xs text-slate-500">Click any deliverable to open proof viewer</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {pendingSignOff.map((del) => {
            const latestVer = del.versions[del.versions.length - 1];
            const rev = latestVer.reviewRequest;

            return (
              <div
                key={del.id}
                onClick={() => selectDeliverable(del.id)}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md hover:border-indigo-400 transition cursor-pointer flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 border border-indigo-200 px-2.5 py-0.5 rounded-lg">
                      {del.projectName}
                    </span>
                    <span className="font-mono text-xs font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                      v{latestVer.versionNumber}.0
                    </span>
                  </div>

                  <h3 className="font-bold text-slate-900 text-base group-hover:text-indigo-600 transition-colors">
                    {del.title}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                    {del.description}
                  </p>
                </div>

                <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs text-slate-500">
                    <Clock className="w-3.5 h-3.5 text-amber-500" />
                    <span>Due: {new Date(rev.dueAt).toLocaleDateString()}</span>
                  </div>

                  <button className="flex items-center gap-1.5 bg-indigo-600 group-hover:bg-indigo-700 text-white font-bold text-xs px-3.5 py-1.5 rounded-xl transition shadow-xs">
                    <span>Open Review</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Completed Approvals Section */}
      {completedApprovals.length > 0 && (
        <div className="space-y-4 pt-4 border-t border-slate-200">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <h2 className="text-lg font-bold text-slate-900">
              Approved Deliverables Vault ({completedApprovals.length})
            </h2>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 divide-y divide-slate-100 overflow-hidden shadow-sm">
            {completedApprovals.map((del) => {
              const latestVer = del.versions[del.versions.length - 1];
              return (
                <div
                  key={del.id}
                  onClick={() => selectDeliverable(del.id)}
                  className="p-4 hover:bg-slate-50 transition flex items-center justify-between cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-xs">
                      v{latestVer.versionNumber}
                    </div>
                    <div>
                      <h4 className="font-bold text-xs text-slate-900">{del.title}</h4>
                      <p className="text-[11px] text-slate-400">
                        Project: {del.projectName} · Certified on {new Date(latestVer.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <span className="flex items-center gap-1.5 text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-xl text-xs font-bold">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>APPROVED</span>
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
