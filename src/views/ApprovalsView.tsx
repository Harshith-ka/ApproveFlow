import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  ShieldCheck, 
  FileCheck2, 
  Lock, 
  Calendar, 
  CheckCircle2, 
  ExternalLink, 
  Printer, 
  Search,
  Hash,
  Download
} from 'lucide-react';
import { ApprovalCertificateModal } from '../components/ApprovalCertificateModal';
import { Deliverable, DeliverableVersion, ReviewDecision } from '../types';

export const ApprovalsView: React.FC = () => {
  const { deliverables, selectDeliverable } = useApp();

  // Find all approved decisions across all deliverables and versions
  const approvalRecords: {
    deliverable: Deliverable;
    version: DeliverableVersion;
    decision: ReviewDecision;
  }[] = [];

  deliverables.forEach(del => {
    del.versions.forEach(ver => {
      if (ver.reviewRequest.decision && ver.reviewRequest.decision.decision === 'APPROVED') {
        approvalRecords.push({
          deliverable: del,
          version: ver,
          decision: ver.reviewRequest.decision
        });
      }
    });
  });

  const [selectedRecord, setSelectedRecord] = useState<{
    deliverable: Deliverable;
    version: DeliverableVersion;
    decision: ReviewDecision;
  } | null>(null);

  const [search, setSearch] = useState('');

  const filteredRecords = approvalRecords.filter(rec => 
    rec.deliverable.title.toLowerCase().includes(search.toLowerCase()) ||
    rec.deliverable.clientName.toLowerCase().includes(search.toLowerCase()) ||
    rec.decision.actor.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex-1 overflow-y-auto bg-slate-50 p-6 lg:p-8 space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-indigo-600 font-bold text-xs uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4" />
            <span>Audit & Compliance Vault</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight mt-1">
            Formal Approval Evidence Records
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Cryptographically sealed client sign-offs with immutable SHA-256 asset checksums and UTC timestamps
          </p>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search approvals by client, title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm w-72"
          />
        </div>
      </div>

      {/* Main Table / Cards */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                <th className="py-3.5 px-4">Approval ID & Deliverable</th>
                <th className="py-3.5 px-4">Version & Checksum</th>
                <th className="py-3.5 px-4">Client Signatory</th>
                <th className="py-3.5 px-4">Decision Date (UTC)</th>
                <th className="py-3.5 px-4">Audit Status</th>
                <th className="py-3.5 px-4 text-right">Certificate Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredRecords.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    <ShieldCheck className="w-10 h-10 mx-auto text-slate-300 mb-2" />
                    <p className="font-semibold text-slate-600">No approval records found.</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Open a review request and execute formal sign-off as a Client Approver.
                    </p>
                  </td>
                </tr>
              ) : (
                filteredRecords.map((rec) => (
                  <tr key={rec.decision.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-4 px-4">
                      <div className="font-mono text-[10px] text-slate-400 font-bold">
                        {rec.decision.id}
                      </div>
                      <div className="font-bold text-slate-900 text-xs mt-0.5">
                        {rec.deliverable.title}
                      </div>
                      <div className="text-[11px] text-indigo-600 font-medium">
                        {rec.deliverable.clientName}
                      </div>
                    </td>

                    <td className="py-4 px-4">
                      <span className="font-mono font-bold bg-slate-100 px-2 py-0.5 rounded text-indigo-700">
                        v{rec.version.versionNumber}.0
                      </span>
                      <div className="font-mono text-[10px] text-slate-400 mt-1 truncate max-w-[180px]">
                        {rec.version.checksum}
                      </div>
                    </td>

                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <img
                          src={rec.decision.actor.avatarUrl}
                          alt={rec.decision.actor.name}
                          className="w-6 h-6 rounded-full object-cover"
                        />
                        <div>
                          <div className="font-semibold text-slate-800">{rec.decision.actor.name}</div>
                          <div className="text-[10px] text-slate-400 font-mono">
                            {rec.decision.actor.role}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-4 font-mono text-[11px] text-slate-600">
                      {new Date(rec.decision.decidedAt).toUTCString()}
                    </td>

                    <td className="py-4 px-4">
                      <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-300 font-bold text-[11px] px-2 py-0.5 rounded-full">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        <span>SEALED</span>
                      </span>
                    </td>

                    <td className="py-4 px-4 text-right">
                      <button
                        onClick={() => setSelectedRecord(rec)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs transition shadow-sm"
                      >
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                        <span>View Certificate</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Selected Certificate Modal */}
      {selectedRecord && (
        <ApprovalCertificateModal
          isOpen={true}
          onClose={() => setSelectedRecord(null)}
          deliverable={selectedRecord.deliverable}
          version={selectedRecord.version}
          decision={selectedRecord.decision}
        />
      )}
    </div>
  );
};
