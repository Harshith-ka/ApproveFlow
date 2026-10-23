import React from 'react';
import { useApp } from '../context/AppContext';
import { Building2, Users2, Mail, FolderKanban, Plus, ExternalLink } from 'lucide-react';

export const ClientsView: React.FC = () => {
  const { clients, projects } = useApp();

  return (
    <div className="flex-1 overflow-y-auto bg-slate-50 p-6 lg:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Client Organizations</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage client stakeholder access, contact roles, and project assignments
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {clients.map((client) => {
          const clientProjects = projects.filter(p => p.clientOrganizationId === client.id);

          return (
            <div
              key={client.id}
              className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <img
                    src={client.logoUrl}
                    alt={client.name}
                    className="w-12 h-12 rounded-xl object-cover border border-slate-200 shadow-sm"
                  />
                  <div>
                    <h3 className="font-bold text-slate-900 text-base">{client.name}</h3>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      Active Client
                    </span>
                  </div>
                </div>

                <div className="space-y-2 text-xs text-slate-600 pt-2 border-t border-slate-100">
                  <div className="flex items-center gap-2">
                    <Users2 className="w-4 h-4 text-slate-400" />
                    <span>Primary Signatory: <strong className="text-slate-800">{client.primaryContact}</strong></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-slate-400" />
                    <span className="text-slate-500">{client.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FolderKanban className="w-4 h-4 text-slate-400" />
                    <span>{clientProjects.length} Active Assigned Project{clientProjects.length !== 1 ? 's' : ''}</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-indigo-600 font-semibold font-mono text-[11px]">
                  Tenant Grant: Isolated
                </span>
                <span className="text-slate-400 text-[11px]">
                  Role: Client Approver
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
