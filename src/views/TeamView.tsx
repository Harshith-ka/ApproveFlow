import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  Users2, 
  ShieldCheck, 
  Check, 
  Minus, 
  Sparkles, 
  UserPlus, 
  Lock 
} from 'lucide-react';

export const TeamView: React.FC = () => {
  const { availableUsers, currentUser, switchUser } = useApp();

  const permissionsMatrix = [
    { capability: 'Manage workspace billing', owner: true, admin: false, manager: false, member: false, clientRev: false, clientApp: false },
    { capability: 'Manage workspace settings', owner: true, admin: true, manager: false, member: false, clientRev: false, clientApp: false },
    { capability: 'Invite internal members', owner: true, admin: true, manager: false, member: false, clientRev: false, clientApp: false },
    { capability: 'Create client projects', owner: true, admin: true, manager: true, member: false, clientRev: false, clientApp: false },
    { capability: 'Upload deliverables & versions', owner: true, admin: true, manager: true, member: true, clientRev: false, clientApp: false },
    { capability: 'Request client reviews', owner: true, admin: true, manager: true, member: false, clientRev: false, clientApp: false },
    { capability: 'View assigned deliverables', owner: true, admin: true, manager: true, member: true, clientRev: true, clientApp: true },
    { capability: 'Annotate & comment on proofs', owner: true, admin: true, manager: true, member: true, clientRev: true, clientApp: true },
    { capability: 'Approve or reject formally (Sign-Off)', owner: false, admin: false, manager: false, member: false, clientRev: false, clientApp: true },
    { capability: 'View workspace audit logs', owner: true, admin: true, manager: false, member: false, clientRev: false, clientApp: false },
  ];

  return (
    <div className="flex-1 overflow-y-auto bg-slate-50 p-6 lg:p-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Team & Role Permissions</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Tenant role boundaries, internal agency collaborators, and external client reviewer assignments
        </p>
      </div>

      {/* Available Personas Grid */}
      <div className="space-y-3">
        <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
          Workspace Personas (Click to switch view)
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {availableUsers.map((u) => {
            const isCurrent = u.id === currentUser.id;
            const isClient = u.role.startsWith('CLIENT_');

            return (
              <div
                key={u.id}
                onClick={() => switchUser(u.id)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                  isCurrent
                    ? 'bg-indigo-50/80 border-indigo-500 ring-2 ring-indigo-500/30 shadow-md'
                    : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-sm'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <img
                      src={u.avatarUrl}
                      alt={u.name}
                      className="w-10 h-10 rounded-full object-cover ring-2 ring-slate-200"
                    />
                    {isCurrent && (
                      <span className="bg-indigo-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded uppercase">
                        Active
                      </span>
                    )}
                  </div>
                  <h3 className="font-bold text-xs text-slate-900">{u.name}</h3>
                  <div className="text-[11px] text-slate-500 truncate">{u.organizationName}</div>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between">
                  <span className={`text-[10px] font-mono font-bold uppercase px-1.5 py-0.5 rounded ${
                    u.role === 'CLIENT_APPROVER' ? 'bg-emerald-100 text-emerald-800' :
                    u.role === 'OWNER' ? 'bg-purple-100 text-purple-800' :
                    'bg-slate-100 text-slate-700'
                  }`}>
                    {u.role.replace('_', ' ')}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Permission Matrix Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-200 bg-slate-50/60">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-indigo-600" />
            <h2 className="text-sm font-bold text-slate-900">
              Role Permission Enforcement Matrix (PRD Section 6)
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Backend-enforced capability boundaries. Agency staff cannot impersonate a client approver for formal sign-offs.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-bold text-[11px]">
                <th className="py-3 px-4">System Capability</th>
                <th className="py-3 px-3 text-center">Owner</th>
                <th className="py-3 px-3 text-center">Admin</th>
                <th className="py-3 px-3 text-center">Manager</th>
                <th className="py-3 px-3 text-center">Member</th>
                <th className="py-3 px-3 text-center bg-amber-50/50">Client Reviewer</th>
                <th className="py-3 px-3 text-center bg-emerald-50/50">Client Approver</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {permissionsMatrix.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-50/50 transition">
                  <td className="py-3 px-4 font-medium text-slate-800 flex items-center gap-2">
                    {row.capability.includes('Approve') && <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />}
                    <span>{row.capability}</span>
                  </td>
                  <td className="py-3 px-3 text-center">
                    {row.owner ? <Check className="w-4 h-4 text-indigo-600 mx-auto" /> : <Minus className="w-4 h-4 text-slate-300 mx-auto" />}
                  </td>
                  <td className="py-3 px-3 text-center">
                    {row.admin ? <Check className="w-4 h-4 text-indigo-600 mx-auto" /> : <Minus className="w-4 h-4 text-slate-300 mx-auto" />}
                  </td>
                  <td className="py-3 px-3 text-center">
                    {row.manager ? <Check className="w-4 h-4 text-indigo-600 mx-auto" /> : <Minus className="w-4 h-4 text-slate-300 mx-auto" />}
                  </td>
                  <td className="py-3 px-3 text-center">
                    {row.member ? <Check className="w-4 h-4 text-indigo-600 mx-auto" /> : <Minus className="w-4 h-4 text-slate-300 mx-auto" />}
                  </td>
                  <td className="py-3 px-3 text-center bg-amber-50/20">
                    {row.clientRev ? <Check className="w-4 h-4 text-amber-600 mx-auto" /> : <Minus className="w-4 h-4 text-slate-300 mx-auto" />}
                  </td>
                  <td className="py-3 px-3 text-center bg-emerald-50/20">
                    {row.clientApp ? <Check className="w-4 h-4 text-emerald-600 font-bold mx-auto" /> : <Minus className="w-4 h-4 text-slate-300 mx-auto" />}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
