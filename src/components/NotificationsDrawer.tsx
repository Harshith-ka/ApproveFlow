import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  Bell, 
  X, 
  Check, 
  ShieldCheck, 
  MessageSquare, 
  UploadCloud, 
  AlertCircle,
  Clock
} from 'lucide-react';

interface NotificationsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationsDrawer: React.FC<NotificationsDrawerProps> = ({ isOpen, onClose }) => {
  const { notifications, markNotificationRead, selectDeliverable } = useApp();

  if (!isOpen) return null;

  const getIcon = (type: string) => {
    switch (type) {
      case 'DECISION_SUBMITTED':
        return <ShieldCheck className="w-4 h-4 text-emerald-500" />;
      case 'COMMENT_ADDED':
        return <MessageSquare className="w-4 h-4 text-indigo-500" />;
      case 'REVIEW_REQUESTED':
        return <UploadCloud className="w-4 h-4 text-purple-500" />;
      default:
        return <Bell className="w-4 h-4 text-blue-500" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/50 backdrop-blur-xs">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-indigo-400" />
              <h3 className="font-bold text-sm">Notifications & Dispatch Activity</h3>
            </div>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-100 p-2">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-xs">
                No notifications to display.
              </div>
            ) : (
              notifications.map((notif) => (
                <div
                  key={notif.id}
                  onClick={() => {
                    markNotificationRead(notif.id);
                    if (notif.deliverableId) {
                      selectDeliverable(notif.deliverableId);
                      onClose();
                    }
                  }}
                  className={`p-3 rounded-xl transition cursor-pointer flex items-start gap-3 ${
                    notif.read ? 'hover:bg-slate-50 opacity-80' : 'bg-indigo-50/40 hover:bg-indigo-50/70 border border-indigo-100'
                  }`}
                >
                  <div className="p-2 rounded-lg bg-white shadow-xs border border-slate-200 mt-0.5">
                    {getIcon(notif.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <h4 className="font-bold text-xs text-slate-900 truncate">{notif.title}</h4>
                      <span className="text-[10px] text-slate-400 font-mono whitespace-nowrap">{notif.time}</span>
                    </div>
                    <p className="text-xs text-slate-600 leading-snug">{notif.message}</p>
                    {!notif.read && (
                      <span className="inline-block mt-1.5 text-[9px] font-bold text-indigo-600 bg-indigo-100 px-1.5 py-0.2 rounded">
                        UNREAD
                      </span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
