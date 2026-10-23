import React, { useState, useRef, useEffect } from 'react';
import { CommentThread, AnchorData } from '../types';
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  RotateCcw, 
  FastForward, 
  Clock, 
  Sparkles, 
  Send, 
  X,
  Check,
  Film
} from 'lucide-react';

interface VideoPlayerAnnotatorProps {
  videoUrl: string;
  threads: CommentThread[];
  activeThreadId: string | null;
  onSelectThread: (threadId: string) => void;
  onAddTimestampThread: (timestampMs: number, formattedTime: string, comment: string) => void;
  seekToTimestampMs: number | null;
  canComment: boolean;
}

export const VideoPlayerAnnotator: React.FC<VideoPlayerAnnotatorProps> = ({
  videoUrl,
  threads,
  activeThreadId,
  onSelectThread,
  onAddTimestampThread,
  seekToTimestampMs,
  canComment
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);

  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTimeMs, setCurrentTimeMs] = useState<number>(0);
  const [durationMs, setDurationMs] = useState<number>(30000); // 30s fallback
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [playbackRate, setPlaybackRate] = useState<number>(1);

  // Draft comment at paused timestamp
  const [draftOpen, setDraftOpen] = useState<boolean>(false);
  const [draftTimestampMs, setDraftTimestampMs] = useState<number>(0);
  const [draftComment, setDraftComment] = useState<string>('');

  // Handle external seek requests (e.g., user clicked a thread in the sidebar)
  useEffect(() => {
    if (seekToTimestampMs !== null && videoRef.current) {
      videoRef.current.currentTime = seekToTimestampMs / 1000;
      setCurrentTimeMs(seekToTimestampMs);
      videoRef.current.pause();
      setIsPlaying(false);
    }
  }, [seekToTimestampMs]);

  const formatTime = (ms: number) => {
    const totalSecs = Math.floor(ms / 1000);
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTimeMs(Math.round(videoRef.current.currentTime * 1000));
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDurationMs(Math.round(videoRef.current.duration * 1000) || 30000);
    }
  };

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!progressBarRef.current || !videoRef.current) return;
    const rect = progressBarRef.current.getBoundingClientRect();
    const pos = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const targetMs = Math.round(pos * durationMs);
    videoRef.current.currentTime = targetMs / 1000;
    setCurrentTimeMs(targetMs);
  };

  const handleOpenDraftComment = () => {
    if (!canComment) return;
    if (videoRef.current) {
      videoRef.current.pause();
      setIsPlaying(false);
    }
    setDraftTimestampMs(currentTimeMs);
    setDraftComment('');
    setDraftOpen(true);
  };

  const handlePostComment = () => {
    if (!draftComment.trim()) return;
    onAddTimestampThread(
      draftTimestampMs,
      formatTime(draftTimestampMs),
      draftComment.trim()
    );
    setDraftOpen(false);
    setDraftComment('');
  };

  const handleSpeedChange = () => {
    const speeds = [0.75, 1, 1.25, 1.5, 2];
    const nextIdx = (speeds.indexOf(playbackRate) + 1) % speeds.length;
    const newSpeed = speeds[nextIdx];
    setPlaybackRate(newSpeed);
    if (videoRef.current) {
      videoRef.current.playbackRate = newSpeed;
    }
  };

  const progressPercent = durationMs > 0 ? (currentTimeMs / durationMs) * 100 : 0;

  return (
    <div className="relative flex-1 flex flex-col bg-slate-950 rounded-xl overflow-hidden border border-slate-800 shadow-2xl">
      {/* Video Viewport Area */}
      <div className="relative flex-1 flex items-center justify-center bg-black min-h-[380px] max-h-[62vh]">
        <video
          ref={videoRef}
          src={videoUrl}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onEnded={() => setIsPlaying(false)}
          onClick={togglePlay}
          muted={isMuted}
          className="max-h-full max-w-full object-contain cursor-pointer"
          playsInline
        />

        {/* Big Center Play Icon overlay when paused */}
        {!isPlaying && !draftOpen && (
          <button
            onClick={togglePlay}
            className="absolute inset-auto w-16 h-16 rounded-full bg-indigo-600/90 text-white flex items-center justify-center shadow-2xl hover:bg-indigo-500 hover:scale-110 transition backdrop-blur-sm ring-4 ring-indigo-400/30"
          >
            <Play className="w-8 h-8 ml-1" />
          </button>
        )}

        {/* Timestamp Draft Modal/Popover Overlay */}
        {draftOpen && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-30">
            <div className="bg-slate-900 border border-slate-700 rounded-xl shadow-2xl p-4 text-white w-full max-w-md animate-pin-drop">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-indigo-600/30 text-indigo-400 flex items-center justify-center">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-semibold text-sm">Add Feedback at {formatTime(draftTimestampMs)}</span>
                    <span className="text-[11px] text-slate-400 block -mt-0.5">Paused frame review</span>
                  </div>
                </div>
                <button 
                  onClick={() => setDraftOpen(false)}
                  className="text-slate-400 hover:text-white p-1"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <textarea
                autoFocus
                value={draftComment}
                onChange={(e) => setDraftComment(e.target.value)}
                placeholder="Describe pacing, audio sync, color grading, or VFX change at this exact timestamp..."
                className="w-full mt-3 bg-slate-950 border border-slate-700 rounded-lg p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none h-24"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                    handlePostComment();
                  }
                }}
              />

              <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-800 text-xs">
                <span className="text-[10px] text-slate-400">Ctrl+Enter to post</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setDraftOpen(false)}
                    className="px-3 py-1.5 text-slate-400 hover:text-white rounded-md"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handlePostComment}
                    disabled={!draftComment.trim()}
                    className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white px-4 py-1.5 rounded-lg font-semibold transition"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Post Feedback</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Video Custom Control & Timeline Bar */}
      <div className="bg-slate-900 border-t border-slate-800 p-3 flex flex-col gap-2.5">
        {/* Timeline Scrub Bar with Timestamp Comment Markers */}
        <div className="relative pt-1 select-none">
          <div 
            ref={progressBarRef}
            onClick={handleSeek}
            className="relative h-2.5 bg-slate-800 hover:h-3.5 rounded-full cursor-pointer transition-all overflow-visible group"
          >
            {/* Played track */}
            <div 
              className="absolute left-0 top-0 bottom-0 bg-indigo-500 rounded-full"
              style={{ width: `${progressPercent}%` }}
            ></div>

            {/* Current Playhead thumb */}
            <div 
              className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-white shadow-lg ring-2 ring-indigo-600 group-hover:scale-125 transition-transform"
              style={{ left: `${progressPercent}%` }}
            ></div>

            {/* Comment Timestamp Pins on Timeline */}
            {threads.map((thread) => {
              if (thread.anchorType !== 'TIMESTAMP' || thread.anchorData.timestampMs === undefined) return null;
              const markerPos = (thread.anchorData.timestampMs / durationMs) * 100;
              const isActive = thread.id === activeThreadId;
              const isResolved = thread.status === 'RESOLVED';

              return (
                <div
                  key={thread.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (videoRef.current) {
                      videoRef.current.currentTime = thread.anchorData.timestampMs! / 1000;
                      setCurrentTimeMs(thread.anchorData.timestampMs!);
                      videoRef.current.pause();
                      setIsPlaying(false);
                    }
                    onSelectThread(thread.id);
                  }}
                  className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 z-10 cursor-pointer group/pin"
                  style={{ left: `${markerPos}%` }}
                >
                  <div className={`w-3.5 h-3.5 rounded-full flex items-center justify-center transition-all ${
                    isActive 
                      ? 'bg-amber-400 ring-4 ring-amber-400/40 scale-125' 
                      : isResolved
                        ? 'bg-emerald-500 ring-2 ring-emerald-300'
                        : 'bg-indigo-400 ring-2 ring-white hover:scale-125'
                  }`}>
                    {isResolved && <Check className="w-2 h-2 text-white stroke-[3]" />}
                  </div>

                  {/* Marker Tooltip */}
                  <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 hidden group-hover/pin:block z-20 pointer-events-none">
                    <div className="bg-slate-950 text-white text-[10px] px-2 py-1 rounded shadow-xl border border-slate-700 whitespace-nowrap">
                      <span className="font-mono text-indigo-300 font-semibold">{thread.anchorData.formattedTime}</span> · {thread.comments[0]?.body.slice(0, 30)}...
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Playback Controls Row */}
        <div className="flex items-center justify-between text-xs text-slate-300">
          <div className="flex items-center gap-3">
            <button
              onClick={togglePlay}
              className="p-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg text-white transition"
              title={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </button>

            {/* Jump -5s / +5s */}
            <button
              onClick={() => {
                if (videoRef.current) {
                  videoRef.current.currentTime = Math.max(0, videoRef.current.currentTime - 5);
                }
              }}
              className="p-1 text-slate-400 hover:text-white"
              title="Back 5s"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => {
                if (videoRef.current) {
                  videoRef.current.currentTime = Math.min(durationMs / 1000, videoRef.current.currentTime + 5);
                }
              }}
              className="p-1 text-slate-400 hover:text-white"
              title="Forward 5s"
            >
              <FastForward className="w-3.5 h-3.5" />
            </button>

            {/* Time readout */}
            <div className="font-mono text-[11px] text-slate-400">
              <span className="text-white font-semibold">{formatTime(currentTimeMs)}</span>
              <span className="mx-1">/</span>
              <span>{formatTime(durationMs)}</span>
            </div>
          </div>

          {/* Right Action: Pause & Add Comment Button */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleSpeedChange}
              className="px-2 py-1 rounded bg-slate-800 text-[11px] font-mono hover:bg-slate-700 text-slate-300"
              title="Playback speed"
            >
              {playbackRate}x
            </button>

            <button
              onClick={() => {
                setIsMuted(!isMuted);
                if (videoRef.current) videoRef.current.muted = !isMuted;
              }}
              className="p-1 text-slate-400 hover:text-white"
              title={isMuted ? "Unmute" : "Mute"}
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>

            <button
              onClick={handleOpenDraftComment}
              disabled={!canComment}
              className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white px-3 py-1.5 rounded-lg text-xs font-semibold shadow-md transition"
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Comment at {formatTime(currentTimeMs)}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
