import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  User, 
  Workspace, 
  Project, 
  ClientOrganization, 
  Deliverable, 
  DeliverableVersion, 
  CommentThread, 
  NotificationItem, 
  AuditEventItem, 
  AnchorType, 
  AnchorData, 
  ReviewDecisionType,
  ReviewDecision
} from '../types';
import { 
  SEED_USERS, 
  CURRENT_WORKSPACE, 
  SEED_PROJECTS, 
  SEED_CLIENTS, 
  SEED_DELIVERABLES, 
  SEED_COMMENT_THREADS, 
  SEED_NOTIFICATIONS, 
  SEED_AUDIT_EVENTS 
} from '../mock/seedData';
import confetti from 'canvas-confetti';

interface AppContextType {
  currentUser: User;
  switchUser: (userId: string) => void;
  availableUsers: User[];
  workspace: Workspace;
  viewMode: 'AGENCY' | 'PORTAL';
  setViewMode: (mode: 'AGENCY' | 'PORTAL') => void;
  currentNav: string;
  setCurrentNav: (nav: string) => void;
  selectedDeliverableId: string | null;
  selectDeliverable: (id: string | null) => void;
  deliverables: Deliverable[];
  projects: Project[];
  clients: ClientOrganization[];
  threads: CommentThread[];
  notifications: NotificationItem[];
  auditEvents: AuditEventItem[];
  markNotificationRead: (id: string) => void;
  addCommentThread: (
    versionId: string, 
    reviewRequestId: string, 
    anchorType: AnchorType, 
    anchorData: AnchorData, 
    initialComment: string
  ) => void;
  addCommentReply: (threadId: string, body: string) => void;
  toggleResolveThread: (threadId: string) => void;
  submitReviewDecision: (
    reviewRequestId: string, 
    versionId: string, 
    decision: ReviewDecisionType, 
    note: string, 
    confirmationText: string
  ) => { success: boolean; error?: string };
  uploadNewVersion: (deliverableId: string, changelog: string, fileName?: string, category?: string) => void;
  createDeliverable: (
    title: string, 
    projectId: string, 
    category: 'IMAGE' | 'VIDEO' | 'DOCUMENT', 
    instructions: string,
    fileSampleUrl?: string
  ) => void;
  resetDemoData: () => void;
  isApprover: () => boolean;
  canManage: () => boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  CURRENT_USER_ID: 'af_current_user_id',
  VIEW_MODE: 'af_view_mode',
  DELIVERABLES: 'af_deliverables_v1',
  THREADS: 'af_threads_v1',
  NOTIFICATIONS: 'af_notifications_v1',
  AUDIT_EVENTS: 'af_audit_events_v1',
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CURRENT_USER_ID);
    const found = SEED_USERS.find(u => u.id === saved);
    return found || SEED_USERS[3]; // Elena Rostova (Client Approver) by default to demo review powers
  });

  const [viewMode, setViewModeState] = useState<'AGENCY' | 'PORTAL'>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.VIEW_MODE);
    return (saved as 'AGENCY' | 'PORTAL') || 'AGENCY';
  });

  const [currentNav, setCurrentNav] = useState<string>('overview');
  const [selectedDeliverableId, setSelectedDeliverableId] = useState<string | null>('del-neonpulse-ui');

  const [deliverables, setDeliverables] = useState<Deliverable[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.DELIVERABLES);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* fallback */ }
    }
    return SEED_DELIVERABLES;
  });

  const [threads, setThreads] = useState<CommentThread[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.THREADS);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* fallback */ }
    }
    return SEED_COMMENT_THREADS;
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* fallback */ }
    }
    return SEED_NOTIFICATIONS;
  });

  const [auditEvents, setAuditEvents] = useState<AuditEventItem[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.AUDIT_EVENTS);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* fallback */ }
    }
    return SEED_AUDIT_EVENTS;
  });

  // Save changes to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.DELIVERABLES, JSON.stringify(deliverables));
  }, [deliverables]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.THREADS, JSON.stringify(threads));
  }, [threads]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.AUDIT_EVENTS, JSON.stringify(auditEvents));
  }, [auditEvents]);

  const switchUser = (userId: string) => {
    const target = SEED_USERS.find(u => u.id === userId);
    if (target) {
      setCurrentUser(target);
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER_ID, target.id);
      
      // Auto toggle view mode if switching between agency and client roles
      if (target.role.startsWith('CLIENT_')) {
        setViewModeState('PORTAL');
      } else {
        setViewModeState('AGENCY');
      }

      // Log session switch in audit
      recordAuditEvent(
        'SESSION_ROLE_ASSUMED',
        'User',
        target.id,
        target,
        { role: target.role, name: target.name }
      );
    }
  };

  const setViewMode = (mode: 'AGENCY' | 'PORTAL') => {
    setViewModeState(mode);
    localStorage.setItem(STORAGE_KEYS.VIEW_MODE, mode);
  };

  const selectDeliverable = (id: string | null) => {
    setSelectedDeliverableId(id);
    if (id) {
      setCurrentNav('review-detail');
    }
  };

  const recordAuditEvent = (
    action: string,
    entityType: string,
    entityId: string,
    actor: User,
    metadata: Record<string, any>
  ) => {
    const newEvent: AuditEventItem = {
      id: `audit-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      action,
      entityType,
      entityId,
      actorName: actor.name,
      actorEmail: actor.email,
      actorRole: actor.role,
      timestamp: new Date().toISOString(),
      metadata,
      ipAddress: '198.51.100.' + (Math.floor(Math.random() * 80) + 10)
    };
    setAuditEvents(prev => [newEvent, ...prev]);
  };

  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const addCommentThread = (
    versionId: string, 
    reviewRequestId: string, 
    anchorType: AnchorType, 
    anchorData: AnchorData, 
    initialComment: string
  ) => {
    const existingVersionThreads = threads.filter(t => t.versionId === versionId);
    const newPinNumber = existingVersionThreads.length + 1;

    const threadId = `thread-${Date.now()}`;
    const commentId = `comm-${Date.now()}`;

    const newThread: CommentThread = {
      id: threadId,
      versionId,
      reviewRequestId,
      pinNumber: newPinNumber,
      anchorType,
      anchorData: {
        ...anchorData,
        label: anchorData.label || (anchorType === 'TIMESTAMP' ? `Time ${anchorData.formattedTime}` : `Pin #${newPinNumber}`)
      },
      status: 'OPEN',
      createdAt: new Date().toISOString(),
      comments: [
        {
          id: commentId,
          threadId,
          author: currentUser,
          body: initialComment,
          createdAt: new Date().toISOString()
        }
      ]
    };

    setThreads(prev => [...prev, newThread]);

    // Create notification
    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      title: 'New Feedback Added',
      message: `${currentUser.name} placed a ${anchorType.toLowerCase()} comment: "${initialComment.slice(0, 45)}..."`,
      type: 'COMMENT_ADDED',
      time: 'Just now',
      read: false,
      deliverableId: selectedDeliverableId || undefined
    };
    setNotifications(prev => [newNotif, ...prev]);

    // Record audit event
    recordAuditEvent(
      'COMMENT_THREAD_CREATED',
      'CommentThread',
      threadId,
      currentUser,
      {
        versionId,
        anchorType,
        pinNumber: newPinNumber,
        anchorData
      }
    );
  };

  const addCommentReply = (threadId: string, body: string) => {
    const commentId = `comm-${Date.now()}`;
    const reply = {
      id: commentId,
      threadId,
      author: currentUser,
      body,
      createdAt: new Date().toISOString()
    };

    setThreads(prev => prev.map(t => {
      if (t.id === threadId) {
        return {
          ...t,
          comments: [...t.comments, reply]
        };
      }
      return t;
    }));

    recordAuditEvent(
      'COMMENT_REPLY_ADDED',
      'Comment',
      commentId,
      currentUser,
      { threadId, body: body.slice(0, 60) }
    );
  };

  const toggleResolveThread = (threadId: string) => {
    setThreads(prev => prev.map(t => {
      if (t.id === threadId) {
        const isResolving = t.status === 'OPEN';
        const updatedStatus = isResolving ? 'RESOLVED' : 'OPEN';
        
        recordAuditEvent(
          isResolving ? 'COMMENT_THREAD_RESOLVED' : 'COMMENT_THREAD_REOPENED',
          'CommentThread',
          threadId,
          currentUser,
          { previousStatus: t.status, newStatus: updatedStatus }
        );

        return {
          ...t,
          status: updatedStatus,
          resolvedBy: isResolving ? currentUser : undefined,
          resolvedAt: isResolving ? new Date().toISOString() : undefined
        };
      }
      return t;
    }));
  };

  const submitReviewDecision = (
    reviewRequestId: string, 
    versionId: string, 
    decision: ReviewDecisionType, 
    note: string, 
    confirmationText: string
  ): { success: boolean; error?: string } => {
    // 1. Role enforcement per PRD Section 6
    if (currentUser.role !== 'CLIENT_APPROVER') {
      return { 
        success: false, 
        error: `Permission Denied: User role "${currentUser.role}" is not authorized for formal sign-off. Only designated "CLIENT_APPROVER" can execute approval decisions.` 
      };
    }

    // 2. Generate tamper-evident cryptographic signature hash
    const signatureHash = `sig_${Date.now()}_${Math.random().toString(36).substring(2, 10)}${Math.random().toString(36).substring(2, 10)}`;

    const decisionRecord: ReviewDecision = {
      id: `dec-${Date.now()}`,
      reviewRequestId,
      versionId,
      actor: currentUser,
      decision,
      note,
      confirmationText,
      signatureHash,
      decidedAt: new Date().toISOString()
    };

    // 3. Update Deliverable Version Review Request state immutably
    setDeliverables(prev => prev.map(del => {
      const updatedVersions = del.versions.map(v => {
        if (v.id === versionId) {
          const newStatus: any = decision === 'APPROVED' ? 'APPROVED' : (decision === 'CHANGES_REQUESTED' ? 'CHANGES_REQUESTED' : 'REJECTED');
          return {
            ...v,
            reviewRequest: {
              ...v.reviewRequest,
              status: newStatus,
              decision: decisionRecord
            }
          };
        }
        return v;
      });

      return {
        ...del,
        versions: updatedVersions
      };
    }));

    // 4. Audit event per PRD Section 11
    recordAuditEvent(
      decision === 'APPROVED' ? 'REVIEW_DECISION_APPROVED' : 'REVIEW_DECISION_SUBMITTED',
      'ReviewDecision',
      decisionRecord.id,
      currentUser,
      {
        versionId,
        decision,
        signatureHash,
        confirmationText,
        note
      }
    );

    // 5. Notification
    const notif: NotificationItem = {
      id: `notif-${Date.now()}`,
      title: decision === 'APPROVED' ? 'Deliverable Formally Approved!' : 'Review Decision Submitted',
      message: `${currentUser.name} submitted decision "${decision}" with formal sign-off certificate.`,
      type: 'DECISION_SUBMITTED',
      time: 'Just now',
      read: false,
      deliverableId: selectedDeliverableId || undefined
    };
    setNotifications(prev => [notif, ...prev]);

    // 6. Celebration if Approved!
    if (decision === 'APPROVED') {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    }

    return { success: true };
  };

  const uploadNewVersion = (deliverableId: string, changelog: string, fileName?: string, category?: string) => {
    setDeliverables(prev => prev.map(del => {
      if (del.id === deliverableId) {
        const nextVerNum = del.versions.length + 1;
        const newVerId = `ver-${deliverableId}-v${nextVerNum}`;
        const newRevId = `rev-${deliverableId}-v${nextVerNum}`;

        // Image or video based on category
        const fileUrl = del.category === 'VIDEO' 
          ? 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4'
          : 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=1600&q=80';

        const newVersion: DeliverableVersion = {
          id: newVerId,
          deliverableId,
          versionNumber: nextVerNum,
          fileUrl,
          fileName: fileName || `${del.title.toLowerCase().replace(/[^a-z0-9]/g, '_')}_v${nextVerNum}.png`,
          fileSizeBytes: 5242880,
          checksum: `sha256:${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`,
          mimeType: del.category === 'VIDEO' ? 'video/mp4' : 'image/png',
          changelog,
          createdAt: new Date().toISOString(),
          createdBy: currentUser,
          reviewRequest: {
            id: newRevId,
            versionId: newVerId,
            status: 'IN_REVIEW',
            instructions: `Version ${nextVerNum} submitted for client review: ${changelog}`,
            dueAt: new Date(Date.now() + 5 * 86400000).toISOString(),
            submittedAt: new Date().toISOString(),
            participants: [
              { user: SEED_USERS[3], role: 'CLIENT_APPROVER' },
              { user: SEED_USERS[4], role: 'CLIENT_REVIEWER' }
            ]
          }
        };

        // Mark prior active review requests as SUPERSEDED per PRD Section 5.8
        const updatedPriorVersions = del.versions.map(v => {
          if (v.reviewRequest.status === 'IN_REVIEW' || v.reviewRequest.status === 'CHANGES_REQUESTED') {
            return {
              ...v,
              reviewRequest: {
                ...v.reviewRequest,
                status: 'SUPERSEDED' as const
              }
            };
          }
          return v;
        });

        recordAuditEvent(
          'VERSION_UPLOADED_AND_SUBMITTED',
          'DeliverableVersion',
          newVerId,
          currentUser,
          {
            deliverableId,
            versionNumber: nextVerNum,
            changelog,
            supersededPriorVersions: del.versions.length
          }
        );

        return {
          ...del,
          currentVersionNumber: nextVerNum,
          versions: [...updatedPriorVersions, newVersion]
        };
      }
      return del;
    }));
  };

  const createDeliverable = (
    title: string, 
    projectId: string, 
    category: 'IMAGE' | 'VIDEO' | 'DOCUMENT', 
    instructions: string,
    fileSampleUrl?: string
  ) => {
    const project = SEED_PROJECTS.find(p => p.id === projectId) || SEED_PROJECTS[0];
    const delId = `del-${Date.now()}`;
    const verId = `ver-${delId}-v1`;
    const revId = `rev-${delId}-v1`;

    const sampleUrl = fileSampleUrl || (
      category === 'VIDEO'
        ? 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4'
        : 'https://images.unsplash.com/photo-1542744094-3a31f272c490?auto=format&fit=crop&w=1600&q=80'
    );

    const newDeliverable: Deliverable = {
      id: delId,
      projectId: project.id,
      projectName: project.name,
      clientName: project.clientName,
      title,
      description: instructions,
      category,
      currentVersionNumber: 1,
      createdAt: new Date().toISOString(),
      createdBy: currentUser,
      versions: [
        {
          id: verId,
          deliverableId: delId,
          versionNumber: 1,
          fileUrl: sampleUrl,
          fileName: `${title.toLowerCase().replace(/[^a-z0-9]/g, '_')}_v1.${category === 'VIDEO' ? 'mp4' : 'png'}`,
          fileSizeBytes: 6140000,
          checksum: `sha256:${Math.random().toString(36).substring(2, 15)}e3b0c44298fc1c149afbf4c8996fb92427ae`,
          mimeType: category === 'VIDEO' ? 'video/mp4' : 'image/png',
          changelog: 'Initial version uploaded for client approval review.',
          createdAt: new Date().toISOString(),
          createdBy: currentUser,
          reviewRequest: {
            id: revId,
            versionId: verId,
            status: 'IN_REVIEW',
            instructions,
            dueAt: new Date(Date.now() + 7 * 86400000).toISOString(),
            submittedAt: new Date().toISOString(),
            participants: [
              { user: SEED_USERS[3], role: 'CLIENT_APPROVER' },
              { user: SEED_USERS[4], role: 'CLIENT_REVIEWER' }
            ]
          }
        }
      ]
    };

    setDeliverables(prev => [newDeliverable, ...prev]);
    setSelectedDeliverableId(delId);
    setCurrentNav('review-detail');

    recordAuditEvent(
      'DELIVERABLE_CREATED',
      'Deliverable',
      delId,
      currentUser,
      { title, projectId, category }
    );
  };

  const resetDemoData = () => {
    localStorage.removeItem(STORAGE_KEYS.DELIVERABLES);
    localStorage.removeItem(STORAGE_KEYS.THREADS);
    localStorage.removeItem(STORAGE_KEYS.NOTIFICATIONS);
    localStorage.removeItem(STORAGE_KEYS.AUDIT_EVENTS);
    setDeliverables(SEED_DELIVERABLES);
    setThreads(SEED_COMMENT_THREADS);
    setNotifications(SEED_NOTIFICATIONS);
    setAuditEvents(SEED_AUDIT_EVENTS);
    setSelectedDeliverableId('del-neonpulse-ui');
    setCurrentNav('overview');
  };

  const isApprover = () => currentUser.role === 'CLIENT_APPROVER';
  const canManage = () => ['OWNER', 'ADMIN', 'MANAGER'].includes(currentUser.role);

  return (
    <AppContext.Provider
      value={{
        currentUser,
        switchUser,
        availableUsers: SEED_USERS,
        workspace: CURRENT_WORKSPACE,
        viewMode,
        setViewMode,
        currentNav,
        setCurrentNav,
        selectedDeliverableId,
        selectDeliverable,
        deliverables,
        projects: SEED_PROJECTS,
        clients: SEED_CLIENTS,
        threads,
        notifications,
        auditEvents,
        markNotificationRead,
        addCommentThread,
        addCommentReply,
        toggleResolveThread,
        submitReviewDecision,
        uploadNewVersion,
        createDeliverable,
        resetDemoData,
        isApprover,
        canManage
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
