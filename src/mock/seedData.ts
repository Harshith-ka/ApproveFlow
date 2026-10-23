// ApproveFlow — Production Seed Data
import { 
  User, 
  Workspace, 
  ClientOrganization, 
  Project, 
  Deliverable, 
  CommentThread, 
  NotificationItem, 
  AuditEventItem 
} from '../types';

export const SEED_USERS: User[] = [
  {
    id: 'user-owner',
    name: 'Sarah Jenkins',
    email: 'sarah@kineticstudio.co',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&h=120&q=80',
    role: 'OWNER',
    organizationName: 'Kinetic Creative Studio'
  },
  {
    id: 'user-pm',
    name: 'Marcus Vance',
    email: 'marcus@kineticstudio.co',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&h=120&q=80',
    role: 'MANAGER',
    organizationName: 'Kinetic Creative Studio'
  },
  {
    id: 'user-designer',
    name: 'Chloe Lin',
    email: 'chloe@kineticstudio.co',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&h=120&q=80',
    role: 'MEMBER',
    organizationName: 'Kinetic Creative Studio'
  },
  {
    id: 'user-client-approver',
    name: 'Elena Rostova',
    email: 'elena@starlightbrands.com',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=120&h=120&q=80',
    role: 'CLIENT_APPROVER',
    organizationName: 'Starlight Brands Inc.'
  },
  {
    id: 'user-client-reviewer',
    name: 'David Kim',
    email: 'david@starlightbrands.com',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&h=120&q=80',
    role: 'CLIENT_REVIEWER',
    organizationName: 'Starlight Brands Inc.'
  }
];

export const CURRENT_WORKSPACE: Workspace = {
  id: 'ws-kinetic-01',
  name: 'Kinetic Creative Studio',
  slug: 'kinetic-studio',
  logoUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=80&h=80&q=80',
  timezone: 'America/New_York (UTC-5)',
  plan: 'Studio'
};

export const SEED_CLIENTS: ClientOrganization[] = [
  {
    id: 'client-starlight',
    name: 'Starlight Brands Inc.',
    logoUrl: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?auto=format&fit=crop&w=100&h=100&q=80',
    primaryContact: 'Elena Rostova',
    email: 'elena@starlightbrands.com',
    projectsCount: 3
  },
  {
    id: 'client-hyperion',
    name: 'Hyperion Robotics',
    logoUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=100&h=100&q=80',
    primaryContact: 'Dr. Julian Thorne',
    email: 'julian@hyperionrobotics.io',
    projectsCount: 2
  },
  {
    id: 'client-aether',
    name: 'Aether BioHealth',
    logoUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=100&h=100&q=80',
    primaryContact: 'Nadia Chen',
    email: 'nadia@aetherbio.com',
    projectsCount: 1
  }
];

export const SEED_PROJECTS: Project[] = [
  {
    id: 'proj-neonpulse',
    workspaceId: 'ws-kinetic-01',
    clientOrganizationId: 'client-starlight',
    clientName: 'Starlight Brands Inc.',
    name: 'NeonPulse Energy Drink Launch',
    description: 'Digital design system, visual campaign, 3D product renders, and motion commercial assets.',
    status: 'ACTIVE',
    dueAt: '2026-11-15T18:00:00Z',
    deliverablesCount: 4,
    approvedCount: 2
  },
  {
    id: 'proj-hyperion-rebrand',
    workspaceId: 'ws-kinetic-01',
    clientOrganizationId: 'client-hyperion',
    clientName: 'Hyperion Robotics',
    name: 'Autonomous Fleet Rebrand & UI',
    description: 'Hardware dashboard design, brand guidelines, and executive presentation deck.',
    status: 'ACTIVE',
    dueAt: '2026-11-30T18:00:00Z',
    deliverablesCount: 3,
    approvedCount: 1
  },
  {
    id: 'proj-aether-packaging',
    workspaceId: 'ws-kinetic-01',
    clientOrganizationId: 'client-aether',
    clientName: 'Aether BioHealth',
    name: 'Cellular Restoration Packaging',
    description: 'Sustainable luxury box design, foil stamping spec, and compliance typography.',
    status: 'ACTIVE',
    dueAt: '2026-12-05T18:00:00Z',
    deliverablesCount: 2,
    approvedCount: 0
  }
];

export const SEED_DELIVERABLES: Deliverable[] = [
  {
    id: 'del-neonpulse-ui',
    projectId: 'proj-neonpulse',
    projectName: 'NeonPulse Energy Drink Launch',
    clientName: 'Starlight Brands Inc.',
    title: 'NeonPulse Mobile App Redesign — Onboarding & Hero Experience',
    description: 'High-fidelity mobile UI concept featuring dark glassmorphism, dynamic flavor selector, and animated checkout flow.',
    category: 'IMAGE',
    currentVersionNumber: 2,
    createdAt: '2026-10-18T14:30:00Z',
    createdBy: SEED_USERS[2], // Chloe Lin
    versions: [
      {
        id: 'ver-neonpulse-v1',
        deliverableId: 'del-neonpulse-ui',
        versionNumber: 1,
        fileUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1600&q=80',
        fileName: 'neonpulse_app_v1_initial.png',
        fileSizeBytes: 4280192,
        checksum: 'sha256:7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069',
        mimeType: 'image/png',
        changelog: 'Initial concept delivery exploring electric violet and citrus typography.',
        createdAt: '2026-10-18T14:30:00Z',
        createdBy: SEED_USERS[2],
        reviewRequest: {
          id: 'rev-neonpulse-v1',
          versionId: 'ver-neonpulse-v1',
          status: 'CHANGES_REQUESTED',
          instructions: 'Please review contrast ratio on buttons and hierarchy of the ingredient breakdown.',
          dueAt: '2026-10-21T18:00:00Z',
          submittedAt: '2026-10-18T15:00:00Z',
          participants: [
            { user: SEED_USERS[3], role: 'CLIENT_APPROVER' },
            { user: SEED_USERS[4], role: 'CLIENT_REVIEWER' }
          ]
        }
      },
      {
        id: 'ver-neonpulse-v2',
        deliverableId: 'del-neonpulse-ui',
        versionNumber: 2,
        fileUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1600&q=80',
        fileName: 'neonpulse_app_v2_revised.png',
        fileSizeBytes: 4621980,
        checksum: 'sha256:4b227777d4dd1fc61c6f884f48641d02b4d121d3fd328cb08b5531fcacdabf8a',
        mimeType: 'image/png',
        changelog: 'Updated CTA contrast to WCAG AAA, refined glass blur layers, and repositioned badge to top right.',
        createdAt: '2026-10-22T10:15:00Z',
        createdBy: SEED_USERS[2],
        reviewRequest: {
          id: 'rev-neonpulse-v2',
          versionId: 'ver-neonpulse-v2',
          status: 'IN_REVIEW',
          instructions: 'Revised v2 addressing all pin feedback from Elena and David. Ready for formal client sign-off.',
          dueAt: '2026-10-25T18:00:00Z',
          submittedAt: '2026-10-22T11:00:00Z',
          participants: [
            { user: SEED_USERS[3], role: 'CLIENT_APPROVER' },
            { user: SEED_USERS[4], role: 'CLIENT_REVIEWER' }
          ]
        }
      }
    ]
  },
  {
    id: 'del-commercial-video',
    projectId: 'proj-neonpulse',
    projectName: 'NeonPulse Energy Drink Launch',
    clientName: 'Starlight Brands Inc.',
    title: 'NeonPulse "Ignite the Flow" — 30s Brand Commercial Edit',
    description: 'High-energy broadcast and social teaser with color grading, dynamic sound design, and 3D product burst sequence.',
    category: 'VIDEO',
    currentVersionNumber: 1,
    createdAt: '2026-10-21T09:00:00Z',
    createdBy: SEED_USERS[1], // Marcus Vance
    versions: [
      {
        id: 'ver-video-v1',
        deliverableId: 'del-commercial-video',
        versionNumber: 1,
        fileUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
        fileName: 'neonpulse_30s_cut_v1.mp4',
        fileSizeBytes: 18450192,
        checksum: 'sha256:c3ab8ff13720e8ad9047dd39466b3c8974e592c2fa383d4a3960714caef0c4f2',
        mimeType: 'video/mp4',
        changelog: 'Director cut with rough audio mastering and initial VFX pass.',
        createdAt: '2026-10-21T09:00:00Z',
        createdBy: SEED_USERS[1],
        reviewRequest: {
          id: 'rev-video-v1',
          versionId: 'ver-video-v1',
          status: 'IN_REVIEW',
          instructions: 'Please check audio pacing between 00:04 and 00:12, and verify legal disclaimer visibility at 00:23.',
          dueAt: '2026-10-26T20:00:00Z',
          submittedAt: '2026-10-21T10:00:00Z',
          participants: [
            { user: SEED_USERS[3], role: 'CLIENT_APPROVER' },
            { user: SEED_USERS[4], role: 'CLIENT_REVIEWER' }
          ]
        }
      }
    ]
  },
  {
    id: 'del-packaging-box',
    projectId: 'proj-aether-packaging',
    projectName: 'Cellular Restoration Packaging',
    clientName: 'Aether BioHealth',
    title: 'Aether BioHealth — Luxury Unboxing & Gold Foil Stamping Die',
    description: 'Vector dieline and 3D photographic mockup for the 60-day cellular renewal kit.',
    category: 'IMAGE',
    currentVersionNumber: 1,
    createdAt: '2026-10-19T16:00:00Z',
    createdBy: SEED_USERS[2],
    versions: [
      {
        id: 'ver-packaging-v1',
        deliverableId: 'del-packaging-box',
        versionNumber: 1,
        fileUrl: 'https://images.unsplash.com/photo-1600132806370-bf17e65e942f?auto=format&fit=crop&w=1600&q=80',
        fileName: 'aether_luxury_box_mockup.jpg',
        fileSizeBytes: 3950120,
        checksum: 'sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
        mimeType: 'image/jpeg',
        changelog: 'Initial prototype with matte soft-touch finish and debossed typography.',
        createdAt: '2026-10-19T16:00:00Z',
        createdBy: SEED_USERS[2],
        reviewRequest: {
          id: 'rev-packaging-v1',
          versionId: 'ver-packaging-v1',
          status: 'IN_REVIEW',
          instructions: 'Please review embossed edge tolerances and legal certifications text on back panel.',
          dueAt: '2026-10-27T18:00:00Z',
          submittedAt: '2026-10-19T17:00:00Z',
          participants: [
            { user: SEED_USERS[3], role: 'CLIENT_APPROVER' }
          ]
        }
      }
    ]
  },
  {
    id: 'del-hyperion-deck',
    projectId: 'proj-hyperion-rebrand',
    projectName: 'Autonomous Fleet Rebrand & UI',
    clientName: 'Hyperion Robotics',
    title: 'Hyperion FleetOS — Keynote Deck & Brand Architecture',
    description: 'Executive pitch deck covering autonomous ground vehicle telemetry visualization and fleet management.',
    category: 'IMAGE',
    currentVersionNumber: 2,
    createdAt: '2026-10-15T11:00:00Z',
    createdBy: SEED_USERS[0],
    versions: [
      {
        id: 'ver-deck-v2',
        deliverableId: 'del-hyperion-deck',
        versionNumber: 2,
        fileUrl: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1600&q=80',
        fileName: 'hyperion_keynote_master_v2.png',
        fileSizeBytes: 5829100,
        checksum: 'sha256:9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08',
        mimeType: 'image/png',
        changelog: 'Final sign-off edition including updated telemetry graph styling.',
        createdAt: '2026-10-17T09:00:00Z',
        createdBy: SEED_USERS[0],
        reviewRequest: {
          id: 'rev-deck-v2',
          versionId: 'ver-deck-v2',
          status: 'APPROVED',
          instructions: 'Final presentation slides for board approval.',
          dueAt: '2026-10-18T18:00:00Z',
          submittedAt: '2026-10-17T10:00:00Z',
          participants: [
            { user: SEED_USERS[3], role: 'CLIENT_APPROVER' }
          ],
          decision: {
            id: 'dec-hyperion-01',
            reviewRequestId: 'rev-deck-v2',
            versionId: 'ver-deck-v2',
            actor: SEED_USERS[3],
            decision: 'APPROVED',
            note: 'Sensational deck. The telemetry layout is crystal clear and matches our hardware specifications perfectly. Approved for executive roadshow.',
            confirmationText: 'I confirm on behalf of Hyperion Robotics that Version 2.0 is officially approved without further revisions.',
            signatureHash: 'sig_sha256_883a910bf2294cd9a184ec992b4501e7cd18a38198f7',
            decidedAt: '2026-10-18T16:42:19Z'
          }
        }
      }
    ]
  }
];

export const SEED_COMMENT_THREADS: CommentThread[] = [
  // Threads for NeonPulse UI v2
  {
    id: 'thread-np2-1',
    versionId: 'ver-neonpulse-v2',
    reviewRequestId: 'rev-neonpulse-v2',
    pinNumber: 1,
    anchorType: 'POINT',
    anchorData: {
      point: { x: 0.32, y: 0.28 },
      label: 'Header Typography'
    },
    status: 'OPEN',
    createdAt: '2026-10-22T14:10:00Z',
    comments: [
      {
        id: 'c-np2-1-1',
        threadId: 'thread-np2-1',
        author: SEED_USERS[4], // David Kim
        body: 'The typography weight here is much sharper now! Can we ensure the neon glow does not clip when viewed on mobile Safari?',
        createdAt: '2026-10-22T14:10:00Z'
      },
      {
        id: 'c-np2-1-2',
        threadId: 'thread-np2-1',
        author: SEED_USERS[2], // Chloe Lin
        body: 'Great catch, David. Verified in WebKit with a -webkit-backface-visibility fix. It renders smoothly at 120Hz.',
        createdAt: '2026-10-22T15:20:00Z'
      }
    ]
  },
  {
    id: 'thread-np2-2',
    versionId: 'ver-neonpulse-v2',
    reviewRequestId: 'rev-neonpulse-v2',
    pinNumber: 2,
    anchorType: 'POINT',
    anchorData: {
      point: { x: 0.74, y: 0.52 },
      label: 'Primary CTA Button'
    },
    status: 'RESOLVED',
    resolvedBy: SEED_USERS[3], // Elena Rostova
    resolvedAt: '2026-10-22T17:30:00Z',
    createdAt: '2026-10-22T14:45:00Z',
    comments: [
      {
        id: 'c-np2-2-1',
        threadId: 'thread-np2-2',
        author: SEED_USERS[3],
        body: 'Elena: The new contrast ratio on this button is gorgeous! Verified with our accessibility checklist.',
        createdAt: '2026-10-22T14:45:00Z'
      }
    ]
  },
  {
    id: 'thread-np2-3',
    versionId: 'ver-neonpulse-v2',
    reviewRequestId: 'rev-neonpulse-v2',
    pinNumber: 3,
    anchorType: 'POINT',
    anchorData: {
      point: { x: 0.48, y: 0.78 },
      label: 'Floating Card Shadow'
    },
    status: 'OPEN',
    createdAt: '2026-10-22T16:05:00Z',
    comments: [
      {
        id: 'c-np2-3-1',
        threadId: 'thread-np2-3',
        author: SEED_USERS[3],
        body: 'Let us make sure this bottom card elevation does not obscure the secondary navigation tab bar.',
        createdAt: '2026-10-22T16:05:00Z'
      }
    ]
  },

  // Threads for Video Cut v1
  {
    id: 'thread-vid-1',
    versionId: 'ver-video-v1',
    reviewRequestId: 'rev-video-v1',
    pinNumber: 1,
    anchorType: 'TIMESTAMP',
    anchorData: {
      timestampMs: 3500,
      formattedTime: '00:03',
      label: 'Intro Glitch Transition'
    },
    status: 'OPEN',
    createdAt: '2026-10-21T11:15:00Z',
    comments: [
      {
        id: 'c-vid-1-1',
        threadId: 'thread-vid-1',
        author: SEED_USERS[4], // David Kim
        body: 'At 00:03, this bass hit is fantastic! Can we extend the brand logo freeze by 0.5s so viewers can absorb the tagline?',
        createdAt: '2026-10-21T11:15:00Z'
      },
      {
        id: 'c-vid-1-2',
        threadId: 'thread-vid-1',
        author: SEED_USERS[1], // Marcus Vance
        body: 'Definitely! I can stretch the speed ramp curve slightly without affecting the overall 30s cut time.',
        createdAt: '2026-10-21T12:00:00Z'
      }
    ]
  },
  {
    id: 'thread-vid-2',
    versionId: 'ver-video-v1',
    reviewRequestId: 'rev-video-v1',
    pinNumber: 2,
    anchorType: 'TIMESTAMP',
    anchorData: {
      timestampMs: 11200,
      formattedTime: '00:11',
      label: 'Product Can Splash'
    },
    status: 'OPEN',
    createdAt: '2026-10-21T11:28:00Z',
    comments: [
      {
        id: 'c-vid-2-1',
        threadId: 'thread-vid-2',
        author: SEED_USERS[3], // Elena Rostova
        body: 'Elena: Love the condensation droplets on the can here! Please ensure our organic certification seal remains legible as it rotates.',
        createdAt: '2026-10-21T11:28:00Z'
      }
    ]
  },
  {
    id: 'thread-vid-3',
    versionId: 'ver-video-v1',
    reviewRequestId: 'rev-video-v1',
    pinNumber: 3,
    anchorType: 'TIMESTAMP',
    anchorData: {
      timestampMs: 19800,
      formattedTime: '00:19',
      label: 'Legal Disclaimer Lower Third'
    },
    status: 'RESOLVED',
    resolvedBy: SEED_USERS[1],
    resolvedAt: '2026-10-21T16:00:00Z',
    createdAt: '2026-10-21T11:40:00Z',
    comments: [
      {
        id: 'c-vid-3-1',
        threadId: 'thread-vid-3',
        author: SEED_USERS[4],
        body: 'Disclaimer font size must be at least 14pt equivalent on 1080p for broadcasting compliance standards.',
        createdAt: '2026-10-21T11:40:00Z'
      }
    ]
  }
];

export const SEED_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    title: 'New Revision Submitted',
    message: 'Chloe Lin uploaded Version 2.0 for NeonPulse Mobile App Redesign and requested client review.',
    type: 'REVIEW_REQUESTED',
    time: '2 hours ago',
    read: false,
    deliverableId: 'del-neonpulse-ui'
  },
  {
    id: 'notif-2',
    title: 'Deliverable Approved',
    message: 'Elena Rostova (Starlight Brands) formally approved Hyperion FleetOS Keynote Deck v2.',
    type: 'DECISION_SUBMITTED',
    time: 'Yesterday',
    read: true,
    deliverableId: 'del-hyperion-deck'
  },
  {
    id: 'notif-3',
    title: 'New Video Timestamp Comment',
    message: 'David Kim left a comment at timestamp 00:03 on NeonPulse Brand Commercial.',
    type: 'COMMENT_ADDED',
    time: '1 day ago',
    read: true,
    deliverableId: 'del-commercial-video'
  }
];

export const SEED_AUDIT_EVENTS: AuditEventItem[] = [
  {
    id: 'audit-104',
    action: 'REVIEW_DECISION_APPROVED',
    entityType: 'DeliverableVersion',
    entityId: 'ver-deck-v2',
    actorName: 'Elena Rostova',
    actorEmail: 'elena@starlightbrands.com',
    actorRole: 'CLIENT_APPROVER',
    timestamp: '2026-10-18T16:42:19Z',
    ipAddress: '198.51.100.42',
    metadata: {
      deliverable: 'Hyperion FleetOS — Keynote Deck',
      versionNumber: 2,
      checksum: 'sha256:9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08',
      signatureHash: 'sig_sha256_883a910bf2294cd9a184ec992b4501e7cd18a38198f7'
    }
  },
  {
    id: 'audit-103',
    action: 'VERSION_SUBMITTED_FOR_REVIEW',
    entityType: 'ReviewRequest',
    entityId: 'rev-neonpulse-v2',
    actorName: 'Chloe Lin',
    actorEmail: 'chloe@kineticstudio.co',
    actorRole: 'MEMBER',
    timestamp: '2026-10-22T11:00:00Z',
    ipAddress: '203.0.113.19',
    metadata: {
      deliverable: 'NeonPulse Mobile App Redesign',
      versionNumber: 2,
      recipients: ['elena@starlightbrands.com', 'david@starlightbrands.com']
    }
  },
  {
    id: 'audit-102',
    action: 'COMMENT_THREAD_RESOLVED',
    entityType: 'CommentThread',
    entityId: 'thread-np2-2',
    actorName: 'Elena Rostova',
    actorEmail: 'elena@starlightbrands.com',
    actorRole: 'CLIENT_APPROVER',
    timestamp: '2026-10-22T17:30:00Z',
    ipAddress: '198.51.100.42',
    metadata: {
      pinNumber: 2,
      anchorType: 'POINT'
    }
  },
  {
    id: 'audit-101',
    action: 'USER_LOGIN_SESSION_CREATED',
    entityType: 'Session',
    entityId: 'sess-8941',
    actorName: 'Sarah Jenkins',
    actorEmail: 'sarah@kineticstudio.co',
    actorRole: 'OWNER',
    timestamp: '2026-10-23T08:14:02Z',
    ipAddress: '192.0.2.77',
    metadata: {
      client: 'Chrome 128 / macOS Sequoia',
      mfaVerified: true
    }
  }
];
