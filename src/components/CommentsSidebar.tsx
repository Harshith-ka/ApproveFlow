import React, { useState } from 'react';
import { CommentThread, User } from '../types';
import { 
  CheckCircle2, 
  RotateCcw, 
  Send, 
  Clock, 
  MapPin, 
  MessageSquare, 
  Filter, 
  Check, 
  CornerDownRight,
  ShieldAlert
} from 'lucide-react';

interface CommentsSidebarProps {
  threads: CommentThread[];
  activeThreadId: string | null;
  onSelectThread: (threadId: string) => void;
  onAddReply: (threadId: string, text: string) => void;
  onToggleResolve: (threadId: string) => void;
  currentUser: User;
  canComment: boolean;
  onSeekVideo?: (timestampMs: number) => void;
}

export const CommentsSidebar: React.FC<CommentsSidebarProps> = ({
  threads,
  activeThreadId,
  onSelectThread,
  onAddReply,
  onToggleResolve,
  currentUser,
  canComment,
  onSeekVideo
}) => {
  const [filter, setFilter] = useState<'ALL' | 'UNRESOLVED' | 'RESOLVED'>('ALL');
  const [replyText, setReplyText] = useState<{ [threadId: string]: string }>({});

  const filteredThreads = threads.filter(t => {
    if (filter === 'UNRESOLVED') return t.status === 'OPEN';
    if (filter === 'RESOLVED') return t.status === 'RESOLVED';
    return true;
  });

  const unresolvedCount = threads.filter(t => t.status === 'OPEN').length;
  const resolvedCount = threads.filter(t => t.status === 'RESOLVED').length;

  const handleSendReply = (threadId: string) => {
    const text = replyText[threadId]?.trim();
    if (!text) return;
    onAddReply(threadId, text);
    setReplyText(prev => ({ ...prev, [threadId]: '' }));
  };

  return (
    <aside className="w-80 lg:w-96 flex flex-col bg-white border-l border-slate-200 h-full overflow-hidden">
      {/* Sidebar Header */}
      <div className="p-4 border-b border-slate-200 bg-slate-50/70">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-indigo-600" />
            <h3 className="font-bold text-slate-900 text-sm">Review Comments</h3>
            <span className="bg-slate-200 text-slate-700 font-mono text-[11px] px-1.5 py-0.2 rounded-full">
              {threads.length}
            </span>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 mt-3">
          <button
            onClick={() => setFilter('ALL')}
            className={`px-2.5 py-1 rounded-md text-xs font-semibold transition ${
              filter === 'ALL'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            All ({threads.length})
          </button>
          <button
            onClick={() => setFilter('UNRESOLVED')}
            className={`px-2.5 py-1 rounded-md text-xs font-semibold transition ${
              filter === 'UNRESOLVED'
                ? 'bg-amber-500 text-white shadow-sm'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            Open ({unresolvedCount})
          </button>
          <button
            onClick={() => setFilter('RESOLVED')}
            className={`px-2.5 py-1 rounded-md text-xs font-semibold transition ${
              filter === 'RESOLVED'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            Resolved ({resolvedCount})
          </button>
        </div>
      </div>

      {/* Threads Scrollable List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3.5">
        {filteredThreads.length === 0 ? (
          <div className="text-center py-12 px-4">
            <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
              <CheckCircle2 className="w-6 h-6 text-emerald-500" />
            </div>
            <h4 className="font-semibold text-slate-700 text-xs">No feedback matches filter</h4>
            <p className="text-[11px] text-slate-500 mt-1">
              {filter === 'UNRESOLVED' 
                ? 'All review pins have been successfully addressed and resolved!' 
                : 'Click on the deliverable image or pause video to leave contextual feedback.'}
            </p>
          </div>
        ) : (
          filteredThreads.map((thread) => {
            const isActive = thread.id === activeThreadId;
            const isResolved = thread.status === 'RESOLVED';
            const firstComment = thread.comments[0];

            return (
              <div
                key={thread.id}
                onClick={() => {
                  onSelectThread(thread.id);
                  if (thread.anchorType === 'TIMESTAMP' && thread.anchorData.timestampMs && onSeekVideo) {
                    onSeekVideo(thread.anchorData.timestampMs);
                  }
                }}
                className={`rounded-xl border transition-all duration-200 cursor-pointer overflow-hidden ${
                  isActive
                    ? 'border-indigo-500 shadow-md ring-2 ring-indigo-500/20 bg-indigo-50/20'
                    : isResolved
                      ? 'border-emerald-200 bg-emerald-50/10'
                      : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm'
                }`}
              >
                {/* Thread Card Header */}
                <div className="p-3 bg-slate-50/80 border-b border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {thread.anchorType === 'POINT' ? (
                      <span className={`flex items-center justify-center w-5 h-5 rounded-full text-[10px] font-bold ${
                        isResolved ? 'bg-emerald-600 text-white' : 'bg-indigo-600 text-white'
                      }`}>
                        {isResolved ? <Check className="w-3 h-3 stroke-[3]" /> : thread.pinNumber}
                      </span>
                    ) : (
                      <span 
                        onClick={(e) => {
                          e.stopPropagation();
                          if (thread.anchorData.timestampMs && onSeekVideo) {
                            onSeekVideo(thread.anchorData.timestampMs);
                          }
                        }}
                        className="flex items-center gap-1 bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 border border-amber-300 font-mono text-[10px] px-1.5 py-0.5 rounded font-bold cursor-pointer"
                        title="Click to jump video to this timestamp"
                      >
                        <Clock className="w-3 h-3" />
                        <span>{thread.anchorData.formattedTime || '00:00'}</span>
                      </span>
                    )}

                    <span className="font-semibold text-slate-800 text-xs truncate max-w-[150px]">
                      {thread.anchorData.label || 'Context Pin'}
                    </span>
                  </div>

                  {/* Resolve / Reopen Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleResolve(thread.id);
                    }}
                    className={`flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-md font-medium transition ${
                      isResolved
                        ? 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                        : 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                    }`}
                    title={isResolved ? "Reopen comment thread" : "Mark as resolved"}
                  >
                    {isResolved ? (
                      <>
                        <RotateCcw className="w-3 h-3" />
                        <span>Reopen</span>
                      </>
                    ) : (
                      <>
                        <Check className="w-3 h-3 text-emerald-600" />
                        <span>Resolve</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Primary Comment Body */}
                <div className="p-3">
                  {firstComment && (
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-2">
                          <img 
                            src={firstComment.author.avatarUrl} 
                            alt={firstComment.author.name} 
                            className="w-5 h-5 rounded-full object-cover" 
                          />
                          <span className="font-semibold text-slate-800 text-xs">
                            {firstComment.author.name}
                          </span>
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-100 text-slate-500 font-mono">
                            {firstComment.author.role.replace('_', ' ')}
                          </span>
                        </div>
                      </div>
                      <p className="text-slate-700 text-xs leading-relaxed">
                        {firstComment.body}
                      </p>
                    </div>
                  )}

                  {/* Thread Replies */}
                  {thread.comments.length > 1 && (
                    <div className="mt-2.5 pt-2 border-t border-slate-100 space-y-2 pl-3 border-l-2 border-indigo-200 ml-2">
                      {thread.comments.slice(1).map((reply) => (
                        <div key={reply.id} className="text-xs">
                          <div className="flex items-center gap-1.5 mb-0.5">
                            <span className="font-semibold text-slate-800 text-[11px]">
                              {reply.author.name}
                            </span>
                            <span className="text-[9px] text-slate-400 font-mono">
                              {reply.author.role.replace('_', ' ')}
                            </span>
                          </div>
                          <p className="text-slate-600 leading-snug">{reply.body}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Reply Input Box */}
                  {canComment && (
                    <div className="mt-3 pt-2 border-t border-slate-100 flex items-center gap-1.5">
                      <input
                        type="text"
                        value={replyText[thread.id] || ''}
                        onChange={(e) => setReplyText(prev => ({ ...prev, [thread.id]: e.target.value }))}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleSendReply(thread.id);
                          }
                        }}
                        placeholder="Reply to thread..."
                        className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:bg-white"
                      />
                      <button
                        onClick={() => handleSendReply(thread.id)}
                        disabled={!replyText[thread.id]?.trim()}
                        className="p-1.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white rounded-lg transition"
                      >
                        <Send className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </aside>
  );
};
