import React, { useState } from 'react';
import { DeliverableVersion } from '../types';
import { 
  Columns, 
  Split, 
  ArrowLeftRight, 
  Check, 
  AlertCircle, 
  Sparkles,
  X
} from 'lucide-react';

interface VersionCompareProps {
  versionA: DeliverableVersion;
  versionB: DeliverableVersion;
  onClose: () => void;
}

export const VersionCompare: React.FC<VersionCompareProps> = ({
  versionA,
  versionB,
  onClose
}) => {
  const [mode, setMode] = useState<'SIDE_BY_SIDE' | 'SLIDER'>('SIDE_BY_SIDE');
  const [sliderPos, setSliderPos] = useState<number>(50);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-pin-drop">
      <div className="bg-slate-900 text-white rounded-2xl shadow-2xl border border-slate-800 w-full max-w-6xl h-[90vh] flex flex-col overflow-hidden">
        {/* Top Comparison Header */}
        <div className="px-6 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-600/30 text-indigo-400 flex items-center justify-center">
              <ArrowLeftRight className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">Deliverable Revision Comparison</h3>
              <p className="text-xs text-slate-400">
                Evaluating <span className="text-indigo-300 font-mono">v{versionA.versionNumber}.0</span> vs <span className="text-emerald-300 font-mono">v{versionB.versionNumber}.0</span>
              </p>
            </div>
          </div>

          {/* Mode Switcher */}
          <div className="flex items-center gap-3">
            <div className="flex items-center bg-slate-800 p-0.5 rounded-lg border border-slate-700 text-xs">
              <button
                onClick={() => setMode('SIDE_BY_SIDE')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-semibold transition ${
                  mode === 'SIDE_BY_SIDE' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Columns className="w-3.5 h-3.5" />
                <span>Side-by-Side</span>
              </button>
              <button
                onClick={() => setMode('SLIDER')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-semibold transition ${
                  mode === 'SLIDER' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Split className="w-3.5 h-3.5" />
                <span>Split Slider</span>
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Viewport Comparison Canvas */}
        <div className="flex-1 bg-black p-6 overflow-hidden flex items-center justify-center relative">
          {mode === 'SIDE_BY_SIDE' ? (
            <div className="grid grid-cols-2 gap-6 w-full h-full items-center">
              {/* Version A (Prior) */}
              <div className="flex flex-col h-full bg-slate-950/60 rounded-xl border border-slate-800 p-4 overflow-hidden">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-xs mb-3">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono font-bold">
                      Version {versionA.versionNumber}.0
                    </span>
                    <span className="text-slate-400 truncate max-w-[200px]">{versionA.fileName}</span>
                  </div>
                  <span className="text-[11px] text-amber-400 font-medium">Prior Revision</span>
                </div>
                <div className="flex-1 flex items-center justify-center overflow-hidden">
                  <img
                    src={versionA.fileUrl}
                    alt={`Version ${versionA.versionNumber}`}
                    className="max-h-full max-w-full object-contain rounded-lg shadow-xl"
                  />
                </div>
                <div className="mt-3 text-xs text-slate-400 bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
                  <span className="font-semibold text-slate-300 block">Changelog:</span>
                  <span className="italic">{versionA.changelog}</span>
                </div>
              </div>

              {/* Version B (Latest) */}
              <div className="flex flex-col h-full bg-slate-950/60 rounded-xl border border-emerald-900/40 p-4 overflow-hidden">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-xs mb-3">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 font-mono font-bold">
                      Version {versionB.versionNumber}.0
                    </span>
                    <span className="text-slate-400 truncate max-w-[200px]">{versionB.fileName}</span>
                  </div>
                  <span className="text-[11px] text-emerald-400 font-medium flex items-center gap-1">
                    <Check className="w-3 h-3" />
                    <span>Latest Revision</span>
                  </span>
                </div>
                <div className="flex-1 flex items-center justify-center overflow-hidden">
                  <img
                    src={versionB.fileUrl}
                    alt={`Version ${versionB.versionNumber}`}
                    className="max-h-full max-w-full object-contain rounded-lg shadow-xl ring-2 ring-emerald-500/20"
                  />
                </div>
                <div className="mt-3 text-xs text-slate-300 bg-emerald-950/30 p-2.5 rounded-lg border border-emerald-900/50">
                  <span className="font-semibold text-emerald-300 block">Improvements Implemented:</span>
                  <span className="italic">{versionB.changelog}</span>
                </div>
              </div>
            </div>
          ) : (
            /* Split Scrub Slider Mode */
            <div className="relative w-full h-full max-w-4xl flex items-center justify-center select-none">
              <div className="relative max-h-[68vh] w-auto inline-block overflow-hidden rounded-xl border border-slate-800 shadow-2xl">
                {/* Background Image (Version B) */}
                <img
                  src={versionB.fileUrl}
                  alt={`Version ${versionB.versionNumber}`}
                  className="max-h-[68vh] w-auto max-w-full object-contain"
                  draggable={false}
                />

                {/* Foreground Image (Version A) clipped */}
                <div 
                  className="absolute inset-0 overflow-hidden"
                  style={{ width: `${sliderPos}%` }}
                >
                  <img
                    src={versionA.fileUrl}
                    alt={`Version ${versionA.versionNumber}`}
                    className="max-h-[68vh] w-auto max-w-none object-contain h-full"
                    style={{ minWidth: '100%' }}
                    draggable={false}
                  />
                </div>

                {/* Vertical Divider Line */}
                <div 
                  className="absolute top-0 bottom-0 w-0.5 bg-white shadow-2xl z-20 cursor-ew-resize flex items-center justify-center"
                  style={{ left: `${sliderPos}%` }}
                >
                  <div className="w-8 h-8 rounded-full bg-white text-slate-900 shadow-xl flex items-center justify-center font-bold text-xs">
                    <ArrowLeftRight className="w-4 h-4" />
                  </div>
                </div>

                {/* Labels */}
                <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-sm text-xs px-2.5 py-1 rounded text-white font-mono z-10">
                  v{versionA.versionNumber}.0
                </div>
                <div className="absolute top-3 right-3 bg-emerald-950/80 backdrop-blur-sm text-xs px-2.5 py-1 rounded text-emerald-300 font-mono z-10 border border-emerald-700/50">
                  v{versionB.versionNumber}.0
                </div>
              </div>

              {/* Slider Input Bar */}
              <div className="absolute bottom-4 inset-x-12 z-30 flex items-center gap-4 bg-slate-950/80 backdrop-blur-md px-6 py-2.5 rounded-full border border-slate-800 max-w-md mx-auto">
                <span className="text-xs font-mono text-slate-400">v{versionA.versionNumber}</span>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={sliderPos}
                  onChange={(e) => setSliderPos(Number(e.target.value))}
                  className="flex-1 accent-indigo-500 cursor-ew-resize"
                />
                <span className="text-xs font-mono text-emerald-400">v{versionB.versionNumber}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
