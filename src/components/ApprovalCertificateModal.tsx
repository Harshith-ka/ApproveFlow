import React from 'react';
import { Deliverable, DeliverableVersion, ReviewDecision } from '../types';
import { 
  ShieldCheck, 
  X, 
  Printer, 
  CheckCircle2, 
  FileCheck2, 
  Download, 
  Lock, 
  Hash, 
  Calendar, 
  Building2, 
  UserCheck 
} from 'lucide-react';

interface ApprovalCertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  deliverable: Deliverable;
  version: DeliverableVersion;
  decision: ReviewDecision;
}

export const ApprovalCertificateModal: React.FC<ApprovalCertificateModalProps> = ({
  isOpen,
  onClose,
  deliverable,
  version,
  decision
}) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-pin-drop">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden max-h-[92vh] flex flex-col">
        {/* Top Control Bar */}
        <div className="bg-slate-900 text-white px-5 py-3 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <span className="font-bold text-sm">Official Approval Certificate & Evidence Record</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold transition"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
            </button>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Certificate Printable Area */}
        <div className="p-8 overflow-y-auto bg-slate-50/50 flex-1">
          <div className="bg-white border-2 border-indigo-900/20 rounded-2xl p-8 shadow-xl relative overflow-hidden">
            {/* Watermark Seal */}
            <div className="absolute -right-12 -bottom-12 opacity-5 pointer-events-none">
              <ShieldCheck className="w-96 h-96 text-indigo-900" />
            </div>

            {/* Certificate Header */}
            <div className="border-b-2 border-slate-900 pb-5 mb-6 flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 text-indigo-600 font-bold text-xs uppercase tracking-widest">
                  <ShieldCheck className="w-4 h-4" />
                  <span>ApproveFlow Audit Network</span>
                </div>
                <h1 className="text-2xl font-black text-slate-900 mt-1 tracking-tight">
                  CERTIFICATE OF APPROVAL
                </h1>
                <p className="text-xs text-slate-500 mt-0.5">
                  Tamper-Evident Digital Sign-Off Evidence · SaaS PRD v1.0 Standard
                </p>
              </div>

              <div className="text-right">
                <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 font-bold text-xs px-2.5 py-1 rounded-full border border-emerald-300">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  OFFICIALLY APPROVED
                </span>
                <div className="font-mono text-[11px] text-slate-400 mt-1">
                  ID: {decision.id}
                </div>
              </div>
            </div>

            {/* Scope Details Table */}
            <div className="grid grid-cols-2 gap-4 text-xs mb-6">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">
                  Deliverable & Version
                </span>
                <span className="font-bold text-slate-900 text-sm block mt-0.5">
                  {deliverable.title}
                </span>
                <span className="text-indigo-600 font-semibold font-mono text-xs block mt-0.5">
                  Version {version.versionNumber}.0 ({version.mimeType})
                </span>
              </div>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">
                  Client Organization & Project
                </span>
                <span className="font-bold text-slate-900 text-sm block mt-0.5">
                  {deliverable.clientName}
                </span>
                <span className="text-slate-600 text-xs block mt-0.5">
                  Project: {deliverable.projectName}
                </span>
              </div>
            </div>

            {/* Checksum & Digital Signatures Box */}
            <div className="bg-indigo-950 text-white rounded-xl p-4 mb-6 space-y-2 text-xs">
              <div className="text-[10px] font-bold text-indigo-300 uppercase tracking-widest flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-indigo-400" />
                <span>Cryptographic Evidence Hashes</span>
              </div>
              <div className="space-y-1 font-mono text-[11px]">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between text-slate-300">
                  <span className="text-indigo-200">File Asset SHA-256:</span>
                  <span className="text-slate-100 break-all text-[10px]">{version.checksum}</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between text-slate-300 border-t border-indigo-900/80 pt-1">
                  <span className="text-indigo-200">Signature Proof Hash:</span>
                  <span className="text-emerald-400 break-all text-[10px]">{decision.signatureHash}</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between text-slate-300 border-t border-indigo-900/80 pt-1">
                  <span className="text-indigo-200">UTC Execution Timestamp:</span>
                  <span className="text-slate-100">{new Date(decision.decidedAt).toUTCString()}</span>
                </div>
              </div>
            </div>

            {/* Confirmation Statement */}
            <div className="mb-6 p-4 border-l-4 border-emerald-500 bg-emerald-50/50 rounded-r-xl">
              <div className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider mb-1">
                Attested Sign-Off Declaration
              </div>
              <p className="text-xs text-slate-800 italic leading-relaxed">
                "{decision.confirmationText}"
              </p>
              {decision.note && (
                <div className="mt-2 text-xs text-slate-700">
                  <strong className="text-slate-900">Signatory Remarks:</strong> {decision.note}
                </div>
              )}
            </div>

            {/* Signatory Attribution Signatures */}
            <div className="grid grid-cols-2 gap-8 pt-4 border-t border-slate-200 text-xs">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold block mb-1">
                  Authorized Client Signatory
                </span>
                <div className="font-bold text-slate-900 text-sm">{decision.actor.name}</div>
                <div className="text-slate-500">{decision.actor.email}</div>
                <div className="text-[11px] font-mono text-indigo-600 font-semibold mt-0.5">
                  Role: {decision.actor.role}
                </div>
              </div>

              <div className="text-right">
                <span className="text-[10px] text-slate-400 uppercase font-bold block mb-1">
                  Agency Workspace Host
                </span>
                <div className="font-bold text-slate-900 text-sm">Kinetic Creative Studio</div>
                <div className="text-slate-500">Tenant: kinetic-studio</div>
                <div className="text-[11px] font-mono text-slate-400 mt-0.5">
                  System Review Cycle: {decision.reviewRequestId}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
