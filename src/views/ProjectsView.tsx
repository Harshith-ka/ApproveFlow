import React from 'react';
import { useApp } from '../context/AppContext';
import { FolderKanban, Clock, FileCheck2, ArrowRight, Building2, Plus } from 'lucide-react';

export const ProjectsView: React.FC = () => {
  const { projects, deliverables, selectDeliverable, setCurrentNav } = useApp();

  return (
    <div className="flex-1 overflow-y-auto bg-slate-50 p-6 lg:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Active Client Projects</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage projects, client organizations, and deliverable review stages
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((proj) => {
          const projectDeliverables = deliverables.filter(d => d.projectId === proj.id);
          const approvedCount = projectDeliverables.filter(d => 
            d.versions[d.versions.length - 1].reviewRequest.status === 'APPROVED'
          ).length;
          const progressPercent = projectDeliverables.length > 0 
            ? Math.round((approvedCount / projectDeliverables.length) * 100) 
            : 0;

          return (
            <div
              key={proj.id}
              className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="flex items-center gap-1.5 text-xs font-semibold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2.5 py-1 rounded-lg">
                    <Building2 className="w-3.5 h-3.5" />
                    <span>{proj.clientName}</span>
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                    {proj.status}
                  </span>
                </div>

                <h3 className="font-bold text-slate-900 text-base mt-2">{proj.name}</h3>
                <p className="text-xs text-slate-500 mt-1 line-clamp-2">{proj.description}</p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 space-y-3">
                {/* Progress */}
                <div>
                  <div className="flex items-center justify-between text-xs text-slate-600 mb-1">
                    <span>Deliverable Approvals</span>
                    <span className="font-bold text-slate-900">{approvedCount} / {projectDeliverables.length} ({progressPercent}%)</span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-emerald-500 rounded-full transition-all duration-300"
                      style={{ width: `${progressPercent}%` }}
                    ></div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs pt-1">
                  <div className="flex items-center gap-1 text-slate-400">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Due: {new Date(proj.dueAt).toLocaleDateString()}</span>
                  </div>

                  <button
                    onClick={() => {
                      if (projectDeliverables[0]) {
                        selectDeliverable(projectDeliverables[0].id);
                      } else {
                        setCurrentNav('deliverables');
                      }
                    }}
                    className="flex items-center gap-1 text-indigo-600 font-bold hover:text-indigo-800 transition"
                  >
                    <span>View Assets</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
