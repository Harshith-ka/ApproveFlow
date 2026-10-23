import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Settings, CreditCard, Shield, Clock, Check, Sparkles } from 'lucide-react';

export const SettingsView: React.FC = () => {
  const { workspace } = useApp();

  const [activePlan, setActivePlan] = useState<'Starter' | 'Studio' | 'Agency'>('Studio');
  const [wsName, setWsName] = useState(workspace.name);
  const [wsSlug, setWsSlug] = useState(workspace.slug);
  const [timezone, setTimezone] = useState(workspace.timezone);

  return (
    <div className="flex-1 overflow-y-auto bg-slate-50 p-6 lg:p-8 space-y-8">
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Workspace & Plan Settings</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Configure branding, multi-tenant parameters, and subscription entitlements
        </p>
      </div>

      {/* Subscription Entitlement Tiers per PRD Section 15 */}
      <div className="space-y-4">
        <div>
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
            Plan Entitlements (PRD Section 15)
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Server-enforced quota limits for storage, team seats, and active projects
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Starter */}
          <div className={`p-6 rounded-2xl border transition-all ${
            activePlan === 'Starter'
              ? 'bg-white border-indigo-600 ring-2 ring-indigo-500/30 shadow-md'
              : 'bg-white border-slate-200'
          }`}>
            <h3 className="font-bold text-slate-900 text-base">Starter</h3>
            <p className="text-xs text-slate-500 mt-1">For boutique design studios</p>
            <div className="mt-4 text-3xl font-black text-slate-900">$49<span className="text-xs font-normal text-slate-500">/mo</span></div>

            <ul className="mt-5 space-y-2.5 text-xs text-slate-600">
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-indigo-600" /> 2 Team Seats</li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-indigo-600" /> 5 Active Projects</li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-indigo-600" /> 10 GB Secure Storage</li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-indigo-600" /> Unlimited Client Reviewers</li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-indigo-600" /> Image & Video Visual Proofing</li>
            </ul>

            <button
              onClick={() => setActivePlan('Starter')}
              className={`w-full mt-6 py-2 rounded-xl text-xs font-bold transition ${
                activePlan === 'Starter'
                  ? 'bg-slate-900 text-white'
                  : 'border border-slate-300 text-slate-700 hover:bg-slate-50'
              }`}
            >
              {activePlan === 'Starter' ? 'Current Plan' : 'Select Starter'}
            </button>
          </div>

          {/* Studio (Active) */}
          <div className={`p-6 rounded-2xl border relative transition-all ${
            activePlan === 'Studio'
              ? 'bg-white border-indigo-600 ring-2 ring-indigo-500/30 shadow-lg'
              : 'bg-white border-slate-200'
          }`}>
            <div className="absolute -top-3 right-5 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white font-bold text-[10px] px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-sm">
              Popular
            </div>
            <h3 className="font-bold text-slate-900 text-base">Studio</h3>
            <p className="text-xs text-slate-500 mt-1">For growing creative agencies</p>
            <div className="mt-4 text-3xl font-black text-slate-900">$149<span className="text-xs font-normal text-slate-500">/mo</span></div>

            <ul className="mt-5 space-y-2.5 text-xs text-slate-600">
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-indigo-600" /> 10 Team Seats</li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-indigo-600" /> 50 Active Projects</li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-indigo-600" /> 100 GB Fast Object Storage</li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-indigo-600" /> Unlimited Client Reviewers</li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-indigo-600" /> Custom Agency Branding</li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-indigo-600" /> Advanced Turnaround Metrics</li>
            </ul>

            <button
              onClick={() => setActivePlan('Studio')}
              className={`w-full mt-6 py-2 rounded-xl text-xs font-bold transition ${
                activePlan === 'Studio'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'border border-slate-300 text-slate-700 hover:bg-slate-50'
              }`}
            >
              {activePlan === 'Studio' ? 'Current Active Tier' : 'Select Studio'}
            </button>
          </div>

          {/* Agency */}
          <div className={`p-6 rounded-2xl border transition-all ${
            activePlan === 'Agency'
              ? 'bg-white border-indigo-600 ring-2 ring-indigo-500/30 shadow-md'
              : 'bg-white border-slate-200'
          }`}>
            <h3 className="font-bold text-slate-900 text-base">Agency</h3>
            <p className="text-xs text-slate-500 mt-1">For multi-team enterprise studios</p>
            <div className="mt-4 text-3xl font-black text-slate-900">$399<span className="text-xs font-normal text-slate-500">/mo</span></div>

            <ul className="mt-5 space-y-2.5 text-xs text-slate-600">
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-indigo-600" /> 30 Team Seats</li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-indigo-600" /> Unlimited Active Projects</li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-indigo-600" /> 500 GB Storage Quota</li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-indigo-600" /> Custom Whitelabel Domain</li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-indigo-600" /> REST & Webhook API Access</li>
            </ul>

            <button
              onClick={() => setActivePlan('Agency')}
              className={`w-full mt-6 py-2 rounded-xl text-xs font-bold transition ${
                activePlan === 'Agency'
                  ? 'bg-slate-900 text-white'
                  : 'border border-slate-300 text-slate-700 hover:bg-slate-50'
              }`}
            >
              {activePlan === 'Agency' ? 'Current Plan' : 'Select Agency'}
            </button>
          </div>
        </div>
      </div>

      {/* Workspace General Config */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4 max-w-2xl">
        <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
          Workspace Identification
        </h2>

        <div className="space-y-3">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Workspace Name</label>
            <input
              type="text"
              value={wsName}
              onChange={(e) => setWsName(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Unique Tenant Slug</label>
            <div className="flex items-center">
              <span className="bg-slate-100 border border-r-0 border-slate-300 px-3 py-2 text-xs text-slate-500 rounded-l-xl">
                approveflow.com/
              </span>
              <input
                type="text"
                value={wsSlug}
                onChange={(e) => setWsSlug(e.target.value)}
                className="flex-1 bg-slate-50 border border-slate-300 rounded-r-xl px-3 py-2 text-xs font-mono text-slate-800"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Workspace Timezone</label>
            <input
              type="text"
              value={timezone}
              onChange={(e) => setTimezone(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
