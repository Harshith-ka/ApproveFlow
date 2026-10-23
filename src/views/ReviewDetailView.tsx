import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ImageAnnotator } from '../components/ImageAnnotator';
import { VideoPlayerAnnotator } from '../components/VideoPlayerAnnotator';
import { CommentsSidebar } from '../components/CommentsSidebar';
import { ApprovalModal } from '../components/ApprovalModal';
import { ApprovalCertificateModal } from '../components/ApprovalCertificateModal';
import { VersionCompare } from '../components/VersionCompare';
import { 
  ShieldCheck, 
  ArrowLeft, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  ArrowLeftRight, 
  Plus, 
  ChevronDown, 
  FileCheck, 
  Share2, 
  Info,
  Lock,
  Sparkles
} from 'lucide-react';
import { NormalizedPoint, ReviewDecisionType } from '../types';

export const ReviewDetailView: React.FC = () => {
  const { 
    selectedDeliverableId, 
    deliverables, 
    threads, 
    currentUser, 
    setCurrentNav,
    addCommentThread,
    addCommentReply,
    toggleResolveThread,
    submitReviewDecision,
    uploadNewVersion,
    isApprover
  } = useApp();

  const deliverable = deliverables.find(d => d.id === selectedDeliverableId) || deliverables[0];

  // Active version state within the deliverable
  const [selectedVersionNumber, setSelectedVersionNumber] = useState<number>(
    deliverable.currentVersionNumber
  );

  const activeVersion = deliverable.versions.find(v => v.versionNumber === selectedVersionNumber) 
    || deliverable.versions[deliverable.versions.length - 1];

  // Filter threads strictly to this version
  const versionThreads = threads.filter(t => t.versionId === activeVersion.id);

  // Active highlighted thread state
  const [activeThreadId, setActiveThreadId] = useState<string | null>(null);

  // Video seeking trigger
  const [seekToTimestampMs, setSeekToTimestampMs] = useState<number | null>(null);

  // Modals
  const [approvalModalOpen, setApprovalModalOpen] = useState(false);
  const [certificateModalOpen, setCertificateModalOpen] = useState(false);
  const [compareModalOpen, setCompareModalOpen] = useState(false);
  const [uploadRevisionOpen, setUploadRevisionOpen] = useState(false);
  const [revisionChangelog, setRevisionChangelog] = useState('');

  const canComment = true; // All internal and client roles can comment per Section 6
  const reviewRequest = activeVersion.reviewRequest;
  const isApproved = reviewRequest.status === 'APPROVED';

  const handleAddPointThread = (point: NormalizedPoint, initialComment: string) => {
    addCommentThread(
      activeVersion.id,
      reviewRequest.id,
      'POINT',
      { point },
      initialComment
    );
  };

  const handleAddTimestampThread = (timestampMs: number, formattedTime: string, initialComment: string) => {
    addCommentThread(
      activeVersion.id,
      reviewRequest.id,
      'TIMESTAMP',
      { timestampMs, formattedTime },
      initialComment
    );
  };

  const handleExecuteDecision = (
    decision: ReviewDecisionType,
    note: string,
    confirmationText: string
  ) => {
    submitReviewDecision(
      reviewRequest.id,
      activeVersion.id,
      decision,
      note,
      confirmationText
    );
  };

  const handleUploadRevisionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!revisionChangelog.trim()) return;
    uploadNewVersion(deliverable.id, revisionChangelog.trim());
    setSelectedVersionNumber(deliverable.versions.length + 1);
    setUploadRevisionOpen(false);
    setRevisionChangelog('');
  };

  return (
    <div className="flex-1 flex flex-col h-[calc(100vh-112px)] overflow-hidden bg-slate-100">
      {/* Top Review Control Bar */}
      <div className="bg-white border-b border-slate-200 px-6 py-3 flex flex-wrap items-center justify-between gap-4 z-20">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setCurrentNav('overview')}
            className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-500 hover:text-slate-800 transition"
            title="Back to dashboard"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded">
                {deliverable.projectName}
              </span>
              <span className="text-slate-400 text-xs">/</span>
              <span className="text-xs text-slate-500 font-medium">
                Client: {deliverable.clientName}
              </span>
            </div>
            <h1 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2 mt-0.5">
              <span>{deliverable.title}</span>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                {deliverable.category}
              </span>
            </h1>
          </div>
        </div>

        {/* Center: Version Selector & Compare Tools */}
        <div className="flex items-center gap-2.5">
          {/* Version Switcher Dropdown */}
          <div className="flex items-center bg-slate-100 border border-slate-200 rounded-xl p-1">
            <span className="text-xs text-slate-500 font-semibold px-2">Version:</span>
            <select
              value={selectedVersionNumber}
              onChange={(e) => setSelectedVersionNumber(Number(e.target.value))}
              className="bg-white text-slate-900 text-xs font-bold font-mono py-1 px-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {deliverable.versions.map((v) => (
                <option key={v.id} value={v.versionNumber}>
                  v{v.versionNumber}.0 ({v.reviewRequest.status})
                </option>
              ))}
            </select>
          </div>

          {/* Side-by-Side Compare Button (available if > 1 version) */}
          {deliverable.versions.length > 1 && (
            <button
              onClick={() => setCompareModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold transition"
              title="Compare v1 and v2 visual differences"
            >
              <ArrowLeftRight className="w-3.5 h-3.5 text-indigo-600" />
              <span>Compare Revisions</span>
            </button>
          )}

          {/* New Revision Upload (Agency team) */}
          <button
            onClick={() => setUploadRevisionOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition"
            title="Upload new sequential version"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Upload v{deliverable.versions.length + 1}</span>
          </button>
        </div>

        {/* Right: State Machine Status & Formal Action Bar */}
        <div className="flex items-center gap-3">
          {/* Status Badge */}
          <div className="flex items-center gap-1.5">
            {reviewRequest.status === 'APPROVED' && (
              <span className="flex items-center gap-1.5 bg-emerald-50 text-emerald-700 border border-emerald-300 font-bold text-xs px-3 py-1.5 rounded-xl">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>APPROVED</span>
              </span>
            )}
            {reviewRequest.status === 'CHANGES_REQUESTED' && (
              <span className="flex items-center gap-1.5 bg-amber-50 text-amber-800 border border-amber-300 font-bold text-xs px-3 py-1.5 rounded-xl">
                <AlertCircle className="w-4 h-4 text-amber-600" />
                <span>CHANGES REQUESTED</span>
              </span>
            )}
            {reviewRequest.status === 'IN_REVIEW' && (
              <span className="flex items-center gap-1.5 bg-indigo-50 text-indigo-700 border border-indigo-200 font-bold text-xs px-3 py-1.5 rounded-xl">
                <Clock className="w-4 h-4 text-indigo-600 animate-spin-slow" />
                <span>IN CLIENT REVIEW</span>
              </span>
            )}
            {reviewRequest.status === 'SUPERSEDED' && (
              <span className="flex items-center gap-1.5 bg-slate-100 text-slate-600 border border-slate-300 font-bold text-xs px-3 py-1.5 rounded-xl">
                <Lock className="w-4 h-4 text-slate-400" />
                <span>SUPERSEDED</span>
              </span>
            )}
          </div>

          {/* Action Decision Button */}
          {isApproved && reviewRequest.decision ? (
            <button
              onClick={() => setCertificateModalOpen(true)}
              className="flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white font-bold text-xs px-4 py-2 rounded-xl shadow-md shadow-emerald-600/30 transition hover:scale-102"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>View Approval Certificate</span>
            </button>
          ) : (
            <div className="relative group">
              <button
                onClick={() => setApprovalModalOpen(true)}
                className={`flex items-center gap-2 font-bold text-xs px-4 py-2 rounded-xl shadow-md transition ${
                  isApprover()
                    ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white shadow-indigo-600/30'
                    : 'bg-indigo-600/80 hover:bg-indigo-600 text-white'
                }`}
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Approve / Sign Off</span>
              </button>

              {/* Tooltip if not approver */}
              {!isApprover() && (
                <div className="absolute right-0 top-full mt-2 hidden group-hover:block w-64 bg-slate-900 text-white text-[11px] p-2 rounded-lg shadow-xl z-30">
                  <span className="font-semibold text-amber-300">Approver Role Note:</span> You are currently viewing as <strong>{currentUser.name}</strong> ({currentUser.role}). Only Client Approvers can submit formal approvals.
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Main Review Viewport & Comments Sidebar Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Media Canvas Workspace */}
        <main className="flex-1 flex flex-col p-4 overflow-hidden">
          {deliverable.category === 'IMAGE' ? (
            <ImageAnnotator
              imageUrl={activeVersion.fileUrl}
              threads={versionThreads}
              activeThreadId={activeThreadId}
              onSelectThread={(id) => setActiveThreadId(id)}
              onAddPointThread={handleAddPointThread}
              canComment={canComment}
            />
          ) : (
            <VideoPlayerAnnotator
              videoUrl={activeVersion.fileUrl}
              threads={versionThreads}
              activeThreadId={activeThreadId}
              onSelectThread={(id) => setActiveThreadId(id)}
              onAddTimestampThread={handleAddTimestampThread}
              seekToTimestampMs={seekToTimestampMs}
              canComment={canComment}
            />
          )}

          {/* Bottom Version Meta Strip */}
          <div className="mt-2.5 px-3 py-1.5 bg-white rounded-lg border border-slate-200 text-xs text-slate-500 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="font-semibold text-slate-700">File: {activeVersion.fileName}</span>
              <span>·</span>
              <span className="font-mono text-[11px] text-slate-400">
                SHA-256: {activeVersion.checksum.substring(0, 24)}...
              </span>
            </div>
            <div className="text-[11px]">
              Uploaded by <strong className="text-slate-800">{activeVersion.createdBy.name}</strong> on {new Date(activeVersion.createdAt).toLocaleDateString()}
            </div>
          </div>
        </main>

        {/* Right Review Comments Sidebar */}
        <CommentsSidebar
          threads={versionThreads}
          activeThreadId={activeThreadId}
          onSelectThread={(id) => setActiveThreadId(id)}
          onAddReply={addCommentReply}
          onToggleResolve={toggleResolveThread}
          currentUser={currentUser}
          canComment={canComment}
          onSeekVideo={(ms) => setSeekToTimestampMs(ms)}
        />
      </div>

      {/* Modals */}
      <ApprovalModal
        isOpen={approvalModalOpen}
        onClose={() => setApprovalModalOpen(false)}
        deliverable={deliverable}
        version={activeVersion}
        currentUser={currentUser}
        onSubmitDecision={handleExecuteDecision}
      />

      {isApproved && reviewRequest.decision && (
        <ApprovalCertificateModal
          isOpen={certificateModalOpen}
          onClose={() => setCertificateModalOpen(false)}
          deliverable={deliverable}
          version={activeVersion}
          decision={reviewRequest.decision}
        />
      )}

      {compareModalOpen && deliverable.versions.length > 1 && (
        <VersionCompare
          versionA={deliverable.versions[0]}
          versionB={deliverable.versions[deliverable.versions.length - 1]}
          onClose={() => setCompareModalOpen(false)}
        />
      )}

      {/* Upload New Revision Modal */}
      {uploadRevisionOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-pin-drop">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden">
            <div className="bg-slate-900 text-white p-4 flex items-center justify-between">
              <h3 className="font-bold text-sm">Upload Version {deliverable.versions.length + 1}.0</h3>
              <button onClick={() => setUploadRevisionOpen(false)} className="text-slate-400 hover:text-white">
                ✕
              </button>
            </div>
            <form onSubmit={handleUploadRevisionSubmit} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Revision Improvements & Changelog
                </label>
                <textarea
                  required
                  value={revisionChangelog}
                  onChange={(e) => setRevisionChangelog(e.target.value)}
                  placeholder="Detail the exact client feedback addressed in this revision..."
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none h-24"
                />
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-[11px] text-slate-500">
                Notice: Existing comments remain strictly bound to prior versions. Version {deliverable.versions.length + 1}.0 will start a clean review request cycle.
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setUploadRevisionOpen(false)}
                  className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-md"
                >
                  Submit Revision v{deliverable.versions.length + 1}.0
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
