import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { NotificationsDrawer } from './components/NotificationsDrawer';
import { NewDeliverableModal } from './components/NewDeliverableModal';
import { DashboardView } from './views/DashboardView';
import { ReviewDetailView } from './views/ReviewDetailView';
import { ProjectsView } from './views/ProjectsView';
import { DeliverablesView } from './views/DeliverablesView';
import { ClientsView } from './views/ClientsView';
import { ApprovalsView } from './views/ApprovalsView';
import { ClientPortalView } from './views/ClientPortalView';
import { TeamView } from './views/TeamView';
import { ActivityView } from './views/ActivityView';
import { SettingsView } from './views/SettingsView';

const MainContent: React.FC = () => {
  const { currentNav, viewMode } = useApp();
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [newDeliverableOpen, setNewDeliverableOpen] = useState(false);

  const renderView = () => {
    // If in Review Detail mode
    if (currentNav === 'review-detail') {
      return <ReviewDetailView />;
    }

    // Client Portal View Mode
    if (viewMode === 'PORTAL') {
      return <ClientPortalView />;
    }

    // Agency Workspace Views
    switch (currentNav) {
      case 'overview':
        return <DashboardView />;
      case 'projects':
        return <ProjectsView />;
      case 'deliverables':
        return <DeliverablesView onOpenNewDeliverable={() => setNewDeliverableOpen(true)} />;
      case 'clients':
        return <ClientsView />;
      case 'approvals':
        return <ApprovalsView />;
      case 'activity':
        return <ActivityView />;
      case 'team':
        return <TeamView />;
      case 'settings':
        return <SettingsView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <Navbar
        onOpenNotifications={() => setNotificationsOpen(true)}
        onOpenNewDeliverable={() => setNewDeliverableOpen(true)}
      />

      <div className="flex-1 flex overflow-hidden">
        {renderView()}
      </div>

      <NotificationsDrawer
        isOpen={notificationsOpen}
        onClose={() => setNotificationsOpen(false)}
      />

      <NewDeliverableModal
        isOpen={newDeliverableOpen}
        onClose={() => setNewDeliverableOpen(false)}
      />
    </div>
  );
};

export function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}

export default App;
