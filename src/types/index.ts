// ApproveFlow — Domain Types matching PRD & Prisma Schema

export type WorkspaceRole = 'OWNER' | 'ADMIN' | 'MANAGER' | 'MEMBER';
export type ClientAccessRole = 'CLIENT_REVIEWER' | 'CLIENT_APPROVER';
export type ProjectStatus = 'DRAFT' | 'ACTIVE' | 'ON_HOLD' | 'COMPLETED' | 'ARCHIVED';
export type DeliverableCategory = 'IMAGE' | 'VIDEO' | 'DOCUMENT';
export type ReviewRequestStatus = 
  | 'DRAFT' 
  | 'IN_REVIEW' 
  | 'CHANGES_REQUESTED' 
  | 'APPROVED' 
  | 'REJECTED' 
  | 'CANCELLED' 
  | 'SUPERSEDED';

export type ReviewDecisionType = 'APPROVED' | 'CHANGES_REQUESTED' | 'REJECTED';
export type AnchorType = 'POINT' | 'RECTANGLE' | 'TIMESTAMP' | 'GENERAL';
export type ThreadStatus = 'OPEN' | 'RESOLVED';

export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  role: WorkspaceRole | ClientAccessRole;
  organizationName?: string;
}

export interface Workspace {
  id: string;
  name: string;
  slug: string;
  logoUrl: string;
  timezone: string;
  plan: 'Starter' | 'Studio' | 'Agency';
}

export interface ClientOrganization {
  id: string;
  name: string;
  logoUrl: string;
  primaryContact: string;
  email: string;
  projectsCount: number;
}

export interface Project {
  id: string;
  workspaceId: string;
  clientOrganizationId: string;
  clientName: string;
  name: string;
  description: string;
  status: ProjectStatus;
  dueAt: string;
  deliverablesCount: number;
  approvedCount: number;
}

export interface NormalizedPoint {
  x: number; // 0.0 to 1.0 relative to natural width
  y: number; // 0.0 to 1.0 relative to natural height
}

export interface AnchorData {
  point?: NormalizedPoint;
  timestampMs?: number; // Video milliseconds
  formattedTime?: string; // "00:14"
  label?: string;
}

export interface Comment {
  id: string;
  threadId: string;
  author: User;
  body: string;
  createdAt: string;
  deletedAt?: string;
}

export interface CommentThread {
  id: string;
  versionId: string;
  reviewRequestId: string;
  pinNumber: number;
  anchorType: AnchorType;
  anchorData: AnchorData;
  status: ThreadStatus;
  resolvedBy?: User;
  resolvedAt?: string;
  createdAt: string;
  comments: Comment[];
}

export interface DeliverableVersion {
  id: string;
  deliverableId: string;
  versionNumber: number;
  fileUrl: string;
  fileName: string;
  fileSizeBytes: number;
  checksum: string; // SHA-256 string for evidence
  mimeType: string;
  changelog: string;
  createdAt: string;
  createdBy: User;
  reviewRequest: ReviewRequest;
}

export interface ReviewRequest {
  id: string;
  versionId: string;
  status: ReviewRequestStatus;
  instructions: string;
  dueAt: string;
  submittedAt: string;
  participants: {
    user: User;
    role: ClientAccessRole;
  }[];
  decision?: ReviewDecision;
}

export interface ReviewDecision {
  id: string;
  reviewRequestId: string;
  versionId: string;
  actor: User;
  decision: ReviewDecisionType;
  note?: string;
  confirmationText: string;
  signatureHash: string;
  decidedAt: string;
}

export interface Deliverable {
  id: string;
  projectId: string;
  projectName: string;
  clientName: string;
  title: string;
  description: string;
  category: DeliverableCategory;
  currentVersionNumber: number;
  versions: DeliverableVersion[];
  createdAt: string;
  createdBy: User;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'REVIEW_REQUESTED' | 'COMMENT_ADDED' | 'DECISION_SUBMITTED' | 'REVISION_NEEDED';
  time: string;
  read: boolean;
  deliverableId?: string;
}

export interface AuditEventItem {
  id: string;
  action: string;
  entityType: string;
  entityId: string;
  actorName: string;
  actorEmail: string;
  actorRole: string;
  timestamp: string;
  metadata: Record<string, any>;
  ipAddress: string;
}
