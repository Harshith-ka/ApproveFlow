import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  ShieldCheck, 
  Layers, 
  FolderKanban, 
  FileCheck2, 
  Users2, 
  FileText, 
  Activity, 
  Settings, 
  Bell, 
  ChevronDown, 
  Check, 
  ExternalLink,
  Sparkles,
  RotateCcw,
  UserCheck
} from 'lucide-react';

interface NavbarProps {
  onOpenNotifications: () => void;
  onOpenNewDeliverable: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenNotifications, onOpenNewDeliverable }) => {
  const { 
    currentUser, 
    switchUser, 
    availableUsers, 
    workspace, 
    viewMode, 
    setViewMode, 
    currentNav, 
    setCurrentNav,
    notifications,
    resetDemoData,
    isApprover
  } = useApp();

  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const unreadCount = notifications.filter(n => !n.read).length;

  const agencyNavItems = [
    { id: 'overview', label: 'Overview', icon: Layers },
    { id: 'projects', label: 'Projects', icon: FolderKanban },
    { id: 'deliverables', label: 'Deliverables', icon: FileCheck2 },
    { id: 'clients', label: 'Clients', icon: Users2 },
    { id: 'approvals', label: 'Approvals & Audit', icon: ShieldCheck },
    { id: 'activity', label: 'Activity Log', icon: Activity },
    { id: 'team', label: 'Team', icon: Users2 },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const portalNavItems = [
    { id: 'portal-reviews', label: 'Pending Reviews', icon: FileCheck2 },
    { id: 'portal-approved', label: 'Approved Vault', icon: ShieldCheck },
    { id: 'portal-projects', label: 'Assigned Projects', icon: FolderKanban },
  ];

  const navItems = viewMode === 'AGENCY' ? agencyNavItems : portalNavItems;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      {/* Top Banner Bar: Role Simulator & Tenant Context */}
      <div className="bg-slate-900 text-slate-300 text-xs px-4 py-1.5 flex flex-wrap items-center justify-between gap-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="font-medium text-slate-200">Tenant:</span>
          <span className="bg-slate-800 text-slate-300 px-2 py-0.5 rounded font-mono text-[11px]">
            {workspace.slug} ({workspace.plan} Tier)
          </span>
          <span className="text-slate-500 hidden sm:inline">|</span>
          <span className="text-slate-400 hidden sm:inline">Timezone: {workspace.timezone}</span>
        </div>

        {/* Persona / Role Simulator */}
        <div className="flex items-center gap-2">
          <span className="text-slate-400">Viewing as:</span>
          <div className="relative">
            <button
              onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
              className="flex items-center gap-2 bg-indigo-950/80 hover:bg-indigo-900 border border-indigo-700/60 text-indigo-200 px-2.5 py-1 rounded-md transition-all shadow-sm"
              title="Click to switch persona and test permission boundaries"
            >
              <img 
                src={currentUser.avatarUrl} 
                alt={currentUser.name} 
                className="w-4 h-4 rounded-full object-cover border border-indigo-400/50" 
              />
              <span className="font-semibold text-white">{currentUser.name}</span>
              <span className={`px-1.5 py-0.2 rounded text-[10px] font-mono uppercase ${
                currentUser.role === 'CLIENT_APPROVER' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                currentUser.role === 'CLIENT_REVIEWER' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                currentUser.role === 'OWNER' ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' :
                'bg-blue-500/20 text-blue-300 border border-blue-500/30'
              }`}>
                {currentUser.role.replace('_', ' ')}
              </span>
              <ChevronDown className="w-3 h-3 text-indigo-300" />
            </button>

            {roleDropdownOpen && (
              <div 
                className="absolute right-0 mt-1.5 w-72 bg-slate-900 border border-slate-700 rounded-lg shadow-2xl py-1 z-50 text-slate-200"
                onMouseLeave={() => setRoleDropdownOpen(false)}
              >
                <div className="px-3 py-2 border-b border-slate-800 text-[11px] text-slate-400">
                  Select persona to test permission matrix:
                </div>
                {availableUsers.map((u) => {
                  const isCurrent = u.id === currentUser.id;
                  const isClient = u.role.startsWith('CLIENT_');
                  return (
                    <button
                      key={u.id}
                      onClick={() => {
                        switchUser(u.id);
                        setRoleDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2.5 flex items-center justify-between hover:bg-slate-800 transition-colors ${
                        isCurrent ? 'bg-indigo-950/60 text-white' : ''
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <img src={u.avatarUrl} alt={u.name} className="w-7 h-7 rounded-full object-cover" />
                        <div>
                          <div className="font-medium text-xs text-slate-100 flex items-center gap-1.5">
                            {u.name}
                            {isCurrent && <Check className="w-3.5 h-3.5 text-indigo-400 inline" />}
                          </div>
                          <div className="text-[11px] text-slate-400">
                            {u.organizationName} · <span className="font-mono text-indigo-300">{u.role}</span>
                          </div>
                        </div>
                      </div>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded ${
                        isClient ? 'bg-amber-950/80 text-amber-300 border border-amber-800/40' : 'bg-slate-800 text-slate-300'
                      }`}>
                        {isClient ? 'Client' : 'Agency'}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          <button
            onClick={resetDemoData}
            className="text-slate-400 hover:text-slate-200 p-1 hover:bg-slate-800 rounded transition"
            title="Reset demo data to initial state"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Workspace Brand */}
          <div className="flex items-center gap-6">
            <div 
              onClick={() => {
                if (viewMode === 'AGENCY') setCurrentNav('overview');
                else setCurrentNav('portal-reviews');
              }}
              className="flex items-center gap-2.5 cursor-pointer group"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-700 flex items-center justify-center text-white shadow-md shadow-indigo-500/25 group-hover:scale-105 transition-transform">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900 tracking-tight text-lg">ApproveFlow</span>
                  <span className="text-[10px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200 px-1.5 py-0.5 rounded">
                    SaaS v1.0
                  </span>
                </div>
                <div className="text-[11px] text-slate-500 font-medium -mt-0.5">
                  {viewMode === 'AGENCY' ? workspace.name : `${currentUser.organizationName} · Review Portal`}
                </div>
              </div>
            </div>

            {/* Portal / Agency Mode Pill Switcher */}
            <div className="hidden md:flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200">
              <button
                onClick={() => {
                  setViewMode('AGENCY');
                  setCurrentNav('overview');
                }}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                  viewMode === 'AGENCY'
                    ? 'bg-white text-indigo-700 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Agency Workspace
              </button>
              <button
                onClick={() => {
                  setViewMode('PORTAL');
                  setCurrentNav('portal-reviews');
                }}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  viewMode === 'PORTAL'
                    ? 'bg-white text-indigo-700 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span>Client Review Portal</span>
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              </button>
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            {/* Upload Deliverable Button (Agency only) */}
            {viewMode === 'AGENCY' && (
              <button
                onClick={onOpenNewDeliverable}
                className="hidden sm:inline-flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white px-3.5 py-1.5 rounded-lg text-xs font-semibold shadow-sm shadow-indigo-600/30 transition hover:shadow-md"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>New Deliverable</span>
              </button>
            )}

            {/* Notifications Bell */}
            <button
              onClick={onOpenNotifications}
              className="relative p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition"
              title="Notifications"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white ring-2 ring-white">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* User Avatar badge */}
            <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
              <img 
                src={currentUser.avatarUrl} 
                alt={currentUser.name} 
                className="w-8 h-8 rounded-full object-cover ring-2 ring-indigo-600/20" 
              />
              <div className="hidden lg:block text-left text-xs">
                <div className="font-semibold text-slate-800 leading-tight">{currentUser.name}</div>
                <div className="text-[11px] text-slate-500 font-mono">
                  {currentUser.role.replace('_', ' ')}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs Bar */}
        <nav className="flex space-x-1 border-t border-slate-100 overflow-x-auto py-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentNav === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentNav(item.id)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-indigo-50 text-indigo-700 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-600' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
