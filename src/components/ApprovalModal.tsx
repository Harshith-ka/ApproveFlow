import React, { useState } from 'react';
import { DeliverableVersion, Deliverable, User, ReviewDecisionType } from '../types';
import { 
  ShieldCheck, 
  X, 
  AlertCircle, 
  FileCheck, 
  Lock, 
  Check, 
  Hash, 
  Calendar, 
  UserCheck,
  Send,
  Sparkles
} from 'lucide-react';

interface ApprovalModalProps {
  isOpen: boolean;
  onClose: () => void;
  deliverable: Deliverable;
  version: DeliverableVersion;
  currentUser: User;
  onSubmitDecision: (
    decision: ReviewDecisionType,
    note: string,
    confirmationText: string
  ) => void;
}

export const ApprovalModal: React.FC<ApprovalModalProps> = ({
  isOpen,
  onClose,
  deliverable,
  version,
  currentUser,
  onSubmitDecision
}) => {
  const [decisionType, setDecisionType] = useState<ReviewDecisionType>('APPROVED');
  const [confirmed, setConfirmed] = useState<boolean>(false);
  const [executiveNote, setExecutiveNote] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  if (!isOpen) return null;

  const isClientApprover = currentUser.role === 'CLIENT_APPROVER';

  const defaultConfirmation = `I confirm that I am authorized to formally sign off on Deliverable "${deliverable.title}" (Version ${version.versionNumber}.0) on behalf of ${deliverable.clientName}. This record is tamper-evident and binding.`;

  const handleSubmit = () => {
    if (!isClientApprover || !confirmed) return;
    setIsSubmitting(true);
    setTimeout(() => {
      onSubmitDecision(decisionType, executiveNote, defaultConfirmation);
      setIsSubmitting(false);
      onClose();
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-pin-drop">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-xl overflow-hidden">
        {/* Header with High-Security Aesthetic */}
        <div className="bg-gradient-to-r from-slate-900 to-indigo-950 text-white p-5 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-indigo-300">
              <ShieldCheck className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">Execute Formal Approval Sign-Off</h3>
              <p className="text-xs text-slate-300 mt-0.5">
                Cryptographically audited approval decision record
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-4">
          {/* Permission Alert if not Client Approver */}
          {!isClientApprover ? (
            <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-3 text-rose-800 text-xs">
              <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
              <div>
                <div className="font-bold">Unauthorized for Formal Decision</div>
                <div className="mt-0.5">
                  Your active persona is <span className="font-mono font-semibold">{currentUser.role}</span>. 
                  According to the ApproveFlow permission matrix (PRD Section 6), only designated <span className="font-mono font-semibold">CLIENT_APPROVER</span> accounts can submit binding approvals.
                </div>
                <div className="mt-2 text-[11px] text-rose-700">
                  Tip: Use the top bar persona dropdown to switch to <strong>Elena Rostova (Client Approver)</strong>.
                </div>
              </div>
            </div>
          ) : (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2.5 text-emerald-800 text-xs">
              <UserCheck className="w-4 h-4 text-emerald-600" />
              <span>
                Authorized Approver Verified: <strong>{currentUser.name}</strong> ({currentUser.organizationName})
              </span>
            </div>
          )}

          {/* Decision Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Decision Action
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setDecisionType('APPROVED')}
                className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition ${
                  decisionType === 'APPROVED'
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-500/20'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <Check className="w-4 h-4" />
                <span>Approve v{version.versionNumber}</span>
              </button>
              <button
                type="button"
                onClick={() => setDecisionType('CHANGES_REQUESTED')}
                className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition ${
                  decisionType === 'CHANGES_REQUESTED'
                    ? 'bg-amber-600 text-white border-amber-600 shadow-md shadow-amber-500/20'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <span>Request Revisions</span>
              </button>
              <button
                type="button"
                onClick={() => setDecisionType('REJECTED')}
                className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition ${
                  decisionType === 'REJECTED'
                    ? 'bg-rose-600 text-white border-rose-600 shadow-md shadow-rose-500/20'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <span>Reject</span>
              </button>
            </div>
          </div>

          {/* Immutable Evidence Snapshot */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-2 text-xs">
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Immutable Asset Fingerprint
            </div>
            <div className="grid grid-cols-2 gap-2 text-slate-700">
              <div>
                <span className="text-slate-400">Deliverable:</span>{' '}
                <span className="font-semibold">{deliverable.title}</span>
              </div>
              <div>
                <span className="text-slate-400">Version:</span>{' '}
                <span className="font-mono font-bold text-indigo-700">v{version.versionNumber}.0</span>
              </div>
              <div className="col-span-2">
                <span className="text-slate-400">File Asset Checksum:</span>{' '}
                <span className="font-mono text-[10px] bg-slate-200/80 px-1.5 py-0.5 rounded text-slate-800 break-all">
                  {version.checksum}
                </span>
              </div>
              <div>
                <span className="text-slate-400">Timestamp (Server UTC):</span>{' '}
                <span className="font-mono text-[11px]">{new Date().toUTCString()}</span>
              </div>
              <div>
                <span className="text-slate-400">Idempotency Key:</span>{' '}
                <span className="font-mono text-[10px] text-slate-600">req_idemp_{Date.now().toString(36)}</span>
              </div>
            </div>
          </div>

          {/* Executive Sign-off Note */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Executive Sign-Off Remarks / Handover Instructions
            </label>
            <textarea
              value={executiveNote}
              onChange={(e) => setExecutiveNote(e.target.value)}
              placeholder="e.g., Officially approved for final production export and marketing launch..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white resize-none h-20"
            />
          </div>

          {/* Mandatory Confirmation Checkbox */}
          <div className="pt-1">
            <label className="flex items-start gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={confirmed}
                onChange={(e) => setConfirmed(e.target.checked)}
                disabled={!isClientApprover}
                className="mt-0.5 h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 disabled:opacity-50"
              />
              <span className="text-xs text-slate-600 leading-snug">
                {defaultConfirmation}
              </span>
            </label>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-50 p-4 border-t border-slate-200 flex items-center justify-between">
          <div className="text-[11px] text-slate-400 flex items-center gap-1">
            <Lock className="w-3.5 h-3.5" />
            <span>Audit-sealed decision</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 rounded-lg"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={!isClientApprover || !confirmed || isSubmitting}
              className={`flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-bold text-white shadow-lg transition-all ${
                decisionType === 'APPROVED'
                  ? 'bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 shadow-emerald-600/30'
                  : decisionType === 'CHANGES_REQUESTED'
                    ? 'bg-amber-600 hover:bg-amber-500 disabled:opacity-40 shadow-amber-600/30'
                    : 'bg-rose-600 hover:bg-rose-500 disabled:opacity-40 shadow-rose-600/30'
              }`}
            >
              {isSubmitting ? (
                <span>Executing...</span>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>Execute Sign-Off Decision</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
