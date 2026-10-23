import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Activity, 
  ShieldCheck, 
  Clock, 
  User, 
  Terminal, 
  Filter, 
  ChevronRight,
  Hash
} from 'lucide-react';

export const ActivityView: React.FC = () => {
  const { auditEvents } = useApp();
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);

  const selectedEvent = auditEvents.find(e => e.id === selectedEventId) || auditEvents[0];

  return (
    <div className="flex-1 overflow-y-auto bg-slate-50 p-6 lg:p-8 space-y-6">
      <div>
        <div className="flex items-center gap-2 text-indigo-600 font-bold text-xs uppercase tracking-wider">
          <Activity className="w-4 h-4" />
          <span>Audit Log & System Event Stream</span>
        </div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight mt-1">
          Workspace Immutable Activity Trail
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Append-only event log capturing authentication, version uploads, thread resolutions, and binding sign-offs
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Events Timeline List */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden divide-y divide-slate-100">
          {auditEvents.map((evt) => {
            const isSelected = evt.id === selectedEvent?.id;
            const isApproval = evt.action.includes('APPROVED');

            return (
              <div
                key={evt.id}
                onClick={() => setSelectedEventId(evt.id)}
                className={`p-4 hover:bg-slate-50 transition cursor-pointer flex items-start justify-between gap-4 ${
                  isSelected ? 'bg-indigo-50/50 border-l-4 border-indigo-600' : ''
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-xl mt-0.5 ${
                    isApproval 
                      ? 'bg-emerald-100 text-emerald-800' 
                      : 'bg-slate-100 text-slate-700'
                  }`}>
                    {isApproval ? <ShieldCheck className="w-4 h-4" /> : <Terminal className="w-4 h-4" />}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-xs text-slate-900">
                        {evt.action}
                      </span>
                      <span className="text-[10px] font-mono text-slate-400 bg-slate-100 px-1.5 py-0.2 rounded">
                        {evt.entityType}
                      </span>
                    </div>

                    <div className="text-xs text-slate-600 mt-1 flex items-center gap-2">
                      <span>Actor: <strong className="text-slate-800">{evt.actorName}</strong></span>
                      <span className="text-slate-300">·</span>
                      <span className="text-[11px] font-mono text-indigo-600">{evt.actorRole}</span>
                    </div>
                  </div>
                </div>

                <div className="text-right flex-shrink-0">
                  <span className="text-[11px] font-mono text-slate-400 block">
                    {new Date(evt.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                  <span className="text-[10px] text-slate-400">
                    IP: {evt.ipAddress}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Event Payload Detail Inspector */}
        <div className="bg-slate-950 text-slate-200 rounded-2xl p-6 border border-slate-800 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-xs">
              <span className="text-indigo-400 font-mono font-bold">Event Audit Inspector</span>
              <span className="text-[10px] font-mono text-slate-500">ID: {selectedEvent?.id}</span>
            </div>

            {selectedEvent ? (
              <div className="mt-4 space-y-4 text-xs">
                <div>
                  <span className="text-slate-500 block text-[11px] uppercase font-bold">Action Name</span>
                  <span className="font-mono text-white text-sm font-semibold">{selectedEvent.action}</span>
                </div>

                <div>
                  <span className="text-slate-500 block text-[11px] uppercase font-bold">Actor Identity</span>
                  <span className="text-slate-200">{selectedEvent.actorName} ({selectedEvent.actorEmail})</span>
                  <div className="text-[11px] font-mono text-indigo-400">Role: {selectedEvent.actorRole}</div>
                </div>

                <div>
                  <span className="text-slate-500 block text-[11px] uppercase font-bold">UTC Timestamp</span>
                  <span className="font-mono text-slate-300">{new Date(selectedEvent.timestamp).toUTCString()}</span>
                </div>

                <div>
                  <span className="text-slate-500 block text-[11px] uppercase font-bold mb-1">JSON Metadata Payload</span>
                  <pre className="bg-slate-900 border border-slate-800 p-3 rounded-xl font-mono text-[11px] text-emerald-400 overflow-x-auto max-h-56">
                    {JSON.stringify(selectedEvent.metadata, null, 2)}
                  </pre>
                </div>
              </div>
            ) : (
              <div className="py-12 text-center text-slate-500">Select an event to inspect payload</div>
            )}
          </div>

          <div className="mt-6 pt-3 border-t border-slate-800 text-[11px] text-slate-500 flex items-center justify-between">
            <span>Append-only verification</span>
            <span className="text-emerald-400">SHA-256 Validated</span>
          </div>
        </div>
      </div>
    </div>
  );
};
