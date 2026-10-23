import React, { useState, useRef } from 'react';
import { CommentThread, NormalizedPoint } from '../types';
import { 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Maximize2, 
  MapPin, 
  Check, 
  MessageSquarePlus, 
  Send,
  X,
  Sparkles
} from 'lucide-react';

interface ImageAnnotatorProps {
  imageUrl: string;
  threads: CommentThread[];
  activeThreadId: string | null;
  onSelectThread: (threadId: string) => void;
  onAddPointThread: (point: NormalizedPoint, initialComment: string) => void;
  canComment: boolean;
}

export const ImageAnnotator: React.FC<ImageAnnotatorProps> = ({
  imageUrl,
  threads,
  activeThreadId,
  onSelectThread,
  onAddPointThread,
  canComment
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  const [zoom, setZoom] = useState<number>(1);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Draft pin state for new comment
  const [draftPin, setDraftPin] = useState<{ point: NormalizedPoint; screenPos: { x: number; y: number } } | null>(null);
  const [draftComment, setDraftComment] = useState<string>('');
  const [isPinModeActive, setIsPinModeActive] = useState<boolean>(true);

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.25, 3));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.25, 0.5));
  const handleResetZoom = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button === 1 || (e.button === 0 && e.altKey)) {
      // Middle click or Alt+drag to pan
      setIsDragging(true);
      setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setPan({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleImageClick = (e: React.MouseEvent<HTMLImageElement>) => {
    if (!canComment) return;
    if (isDragging) return;

    const img = imageRef.current;
    if (!img) return;

    const rect = img.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    // Calculate normalized coordinates (0.0 to 1.0)
    const normX = Math.max(0, Math.min(1, clickX / rect.width));
    const normY = Math.max(0, Math.min(1, clickY / rect.height));

    setDraftPin({
      point: {
        x: parseFloat(normX.toFixed(4)),
        y: parseFloat(normY.toFixed(4))
      },
      screenPos: { x: clickX, y: clickY }
    });
    setDraftComment('');
  };

  const handlePostDraftComment = () => {
    if (!draftPin || !draftComment.trim()) return;
    onAddPointThread(draftPin.point, draftComment.trim());
    setDraftPin(null);
    setDraftComment('');
  };

  return (
    <div className="relative flex-1 flex flex-col bg-slate-900 rounded-xl overflow-hidden select-none border border-slate-800 shadow-inner">
      {/* Top Floating Controls Bar */}
      <div className="absolute top-4 left-4 z-20 flex items-center gap-1.5 bg-slate-950/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-700/80 shadow-xl text-white text-xs">
        <button
          onClick={handleZoomOut}
          className="p-1.5 hover:bg-slate-800 rounded-lg transition text-slate-300 hover:text-white"
          title="Zoom out"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        <span className="font-mono text-[11px] px-1 text-slate-400 min-w-[42px] text-center">
          {Math.round(zoom * 100)}%
        </span>
        <button
          onClick={handleZoomIn}
          className="p-1.5 hover:bg-slate-800 rounded-lg transition text-slate-300 hover:text-white"
          title="Zoom in"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button
          onClick={handleResetZoom}
          className="p-1.5 hover:bg-slate-800 rounded-lg transition text-slate-300 hover:text-white ml-1 border-l border-slate-700 pl-2"
          title="Reset zoom and center"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>

        <div className="h-4 w-px bg-slate-700 mx-1"></div>

        <button
          onClick={() => setIsPinModeActive(!isPinModeActive)}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition ${
            isPinModeActive 
              ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-500/50' 
              : 'text-slate-400 hover:text-slate-200'
          }`}
          title="Click on the image to drop a comment pin"
        >
          <MessageSquarePlus className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Click to Pin</span>
        </button>
      </div>

      {/* Helpful Hint Badge */}
      <div className="absolute top-4 right-4 z-20 hidden md:flex items-center gap-1.5 bg-slate-950/70 backdrop-blur-md px-2.5 py-1 rounded-lg border border-slate-800 text-[11px] text-slate-400">
        <MapPin className="w-3 h-3 text-indigo-400" />
        <span>Click anywhere to annotate · Alt+drag to pan</span>
      </div>

      {/* Canvas Viewport */}
      <div 
        ref={containerRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        className="flex-1 flex items-center justify-center overflow-hidden cursor-crosshair p-6"
      >
        <div 
          className="relative transition-transform duration-75 ease-out inline-block max-w-full max-h-full"
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
            transformOrigin: 'center center'
          }}
        >
          <img
            ref={imageRef}
            src={imageUrl}
            alt="Deliverable review asset"
            onClick={handleImageClick}
            className="max-h-[68vh] w-auto max-w-full object-contain rounded-lg shadow-2xl border border-slate-800 pointer-events-auto"
            draggable={false}
          />

          {/* Render Existing Pins */}
          {threads.map((thread) => {
            if (thread.anchorType !== 'POINT' || !thread.anchorData.point) return null;
            const { x, y } = thread.anchorData.point;
            const isActive = thread.id === activeThreadId;
            const isResolved = thread.status === 'RESOLVED';

            return (
              <div
                key={thread.id}
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectThread(thread.id);
                }}
                className={`absolute z-10 -translate-x-1/2 -translate-y-1/2 cursor-pointer group`}
                style={{
                  left: `${x * 100}%`,
                  top: `${y * 100}%`
                }}
              >
                {/* Pulsing ring for active or unresolved pin */}
                {isActive && (
                  <span className="absolute -inset-2 rounded-full bg-indigo-500/40 animate-ping"></span>
                )}

                {/* Pin Head */}
                <div 
                  className={`relative flex items-center justify-center w-7 h-7 rounded-full font-bold text-xs shadow-xl transition-all duration-200 transform group-hover:scale-125 ${
                    isActive 
                      ? 'bg-indigo-600 text-white ring-4 ring-indigo-400/40 scale-110' 
                      : isResolved
                        ? 'bg-emerald-600 text-white ring-2 ring-emerald-300/40'
                        : 'bg-indigo-500 text-white ring-2 ring-white/90 hover:bg-indigo-600'
                  }`}
                >
                  {isResolved ? (
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  ) : (
                    thread.pinNumber
                  )}

                  {/* Pin tail needle */}
                  <div className={`absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rotate-45 ${
                    isActive ? 'bg-indigo-600' : isResolved ? 'bg-emerald-600' : 'bg-indigo-500'
                  }`}></div>
                </div>

                {/* Hover Tooltip Preview */}
                <div className="absolute left-1/2 bottom-full mb-2 -translate-x-1/2 hidden group-hover:block z-30 pointer-events-none">
                  <div className="bg-slate-950/95 text-white text-[11px] px-2.5 py-1.5 rounded-lg shadow-2xl border border-slate-700 whitespace-nowrap max-w-xs">
                    <div className="font-semibold text-indigo-300 flex items-center gap-1">
                      <span>Pin #{thread.pinNumber}</span>
                      <span className="text-slate-400">· {thread.comments[0]?.author.name}</span>
                    </div>
                    <p className="text-slate-200 truncate mt-0.5">
                      {thread.comments[0]?.body}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Draft Pin Drop Popover */}
          {draftPin && (
            <div
              className="absolute z-30 -translate-x-1/2 -translate-y-1/2 animate-pin-drop"
              style={{
                left: `${draftPin.point.x * 100}%`,
                top: `${draftPin.point.y * 100}%`
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Draft Marker Pin */}
              <div className="flex items-center justify-center w-7 h-7 rounded-full bg-rose-600 text-white font-bold text-xs ring-4 ring-rose-400/50 shadow-2xl animate-bounce">
                +
              </div>

              {/* Popover Bubble */}
              <div className="absolute left-1/2 top-9 -translate-x-1/2 w-72 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl p-3 text-white z-40">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-[11px]">
                  <div className="flex items-center gap-1.5 text-indigo-400 font-medium">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>New Comment Pin</span>
                  </div>
                  <div className="font-mono text-slate-400 text-[10px]">
                    X: {Math.round(draftPin.point.x * 100)}% · Y: {Math.round(draftPin.point.y * 100)}%
                  </div>
                  <button 
                    onClick={() => setDraftPin(null)}
                    className="text-slate-400 hover:text-white p-0.5"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>

                <textarea
                  autoFocus
                  value={draftComment}
                  onChange={(e) => setDraftComment(e.target.value)}
                  placeholder="Type your feedback for this exact spot..."
                  className="w-full mt-2 bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none h-18"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                      handlePostDraftComment();
                    }
                  }}
                />

                <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-800">
                  <span className="text-[10px] text-slate-400">Ctrl+Enter to post</span>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => setDraftPin(null)}
                      className="px-2 py-1 text-[11px] text-slate-400 hover:text-white rounded"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handlePostDraftComment}
                      disabled={!draftComment.trim()}
                      className="flex items-center gap-1 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white px-3 py-1 rounded-md text-[11px] font-semibold transition"
                    >
                      <Send className="w-3 h-3" />
                      <span>Post</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
