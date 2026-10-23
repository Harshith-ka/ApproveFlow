// ApproveFlow — Production NestJS Review State Machine Service
// Implements PRD Section 5.8 (Deliverable review state machine) and Section 6 (Permission model)

import { Injectable, ForbiddenException, ConflictException, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import * as crypto from 'crypto';

export const ReviewRequestStatus = {
  DRAFT: 'DRAFT',
  IN_REVIEW: 'IN_REVIEW',
  CHANGES_REQUESTED: 'CHANGES_REQUESTED',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
  CANCELLED: 'CANCELLED',
  SUPERSEDED: 'SUPERSEDED',
} as const;
export type ReviewRequestStatus = (typeof ReviewRequestStatus)[keyof typeof ReviewRequestStatus];

export const ReviewDecisionType = {
  APPROVED: 'APPROVED',
  CHANGES_REQUESTED: 'CHANGES_REQUESTED',
  REJECTED: 'REJECTED',
} as const;
export type ReviewDecisionType = (typeof ReviewDecisionType)[keyof typeof ReviewDecisionType];

export const ClientAccessRole = {
  CLIENT_REVIEWER: 'CLIENT_REVIEWER',
  CLIENT_APPROVER: 'CLIENT_APPROVER',
} as const;
export type ClientAccessRole = (typeof ClientAccessRole)[keyof typeof ClientAccessRole];

export interface SubmitDecisionInput {
  workspaceId: string;
  reviewRequestId: string;
  versionId: string;
  actorUserId: string;
  decision: ReviewDecisionType;
  note?: string;
  confirmationText: string;
  idempotencyKey?: string;
}

@Injectable()
export class ReviewStateMachineService {
  constructor(private readonly prisma: PrismaClient) {}

  /**
   * Submits a binding approval, revision request, or rejection.
   * Runs in an atomic PostgreSQL transaction with tenant boundary checks.
   */
  async submitDecision(input: SubmitDecisionInput) {
    const { 
      workspaceId, 
      reviewRequestId, 
      versionId, 
      actorUserId, 
      decision, 
      note, 
      confirmationText,
      idempotencyKey 
    } = input;

    return await this.prisma.$transaction(async (tx) => {
      // 1. Verify tenant & review request existence
      const reviewRequest = await tx.reviewRequest.findFirst({
        where: {
          id: reviewRequestId,
          workspaceId: workspaceId,
          versionId: versionId,
        },
        include: {
          version: {
            include: {
              fileAsset: true,
              deliverable: true,
            },
          },
        },
      });

      if (!reviewRequest) {
        throw new NotFoundException({
          code: 'REVIEW_NOT_FOUND',
          message: 'Review request not found within workspace boundary.',
        });
      }

      // 2. Validate current state machine transition (PRD Section 5.8)
      // Allowed transitions: IN_REVIEW -> APPROVED | CHANGES_REQUESTED | REJECTED
      if (reviewRequest.status !== ReviewRequestStatus.IN_REVIEW) {
        throw new ConflictException({
          code: 'INVALID_REVIEW_TRANSITION',
          message: `Cannot transition review request from status "${reviewRequest.status}" to "${decision}". Once finalized, review states are immutable.`,
        });
      }

      // 3. Verify actor authorization: ONLY Client Approver can sign off (PRD Section 6)
      const clientAccess = await tx.projectClientAccess.findFirst({
        where: {
          projectId: reviewRequest.version.deliverable.projectId,
          contact: {
            userId: actorUserId,
            workspaceId: workspaceId,
          },
          role: ClientAccessRole.CLIENT_APPROVER,
        },
      });

      if (!clientAccess) {
        throw new ForbiddenException({
          code: 'INSUFFICIENT_SIGNATORY_PRIVILEGES',
          message: 'Only designated CLIENT_APPROVER contacts on this project can execute formal decisions.',
        });
      }

      // 4. Ensure no duplicate decision by this actor (PRD Critical Constraints §7)
      const existingDecision = await tx.reviewDecision.findUnique({
        where: {
          reviewRequestId_actorId: {
            reviewRequestId,
            actorId: actorUserId,
          },
        },
      });

      if (existingDecision) {
        throw new ConflictException({
          code: 'DUPLICATE_DECISION',
          message: 'A formal decision has already been executed for this review cycle.',
        });
      }

      // 5. Generate Cryptographic Signature Proof Hash (PRD §11)
      const timestampUtc = new Date().toISOString();
      const fileChecksum = reviewRequest.version.fileAsset.checksum;
      const signaturePayload = `${reviewRequestId}:${versionId}:${actorUserId}:${decision}:${fileChecksum}:${timestampUtc}:${confirmationText}`;
      const signatureHash = crypto.createHash('sha256').update(signaturePayload).digest('hex');

      // 6. Record immutable ReviewDecision
      const createdDecision = await tx.reviewDecision.create({
        data: {
          reviewRequestId,
          versionId,
          actorId: actorUserId,
          decision,
          note,
          confirmationText,
          signatureHash,
          decidedAt: new Date(timestampUtc),
        },
      });

      // 7. Transition review request status
      const nextStatus = decision === ReviewDecisionType.APPROVED 
        ? ReviewRequestStatus.APPROVED 
        : decision === ReviewDecisionType.CHANGES_REQUESTED 
          ? ReviewRequestStatus.CHANGES_REQUESTED 
          : ReviewRequestStatus.REJECTED;

      await tx.reviewRequest.update({
        where: { id: reviewRequestId },
        data: { status: nextStatus },
      });

      // 8. Record audit event (PRD §11)
      await tx.auditEvent.create({
        data: {
          workspaceId,
          actorId: actorUserId,
          action: `REVIEW_DECISION_${decision}`,
          entityType: 'ReviewDecision',
          entityId: createdDecision.id,
          metadata: {
            reviewRequestId,
            versionId,
            versionNumber: reviewRequest.version.versionNumber,
            checksum: fileChecksum,
            signatureHash,
            idempotencyKey,
          },
        },
      });

      // 9. Enqueue Outbox event for asynchronous BullMQ notifications
      await tx.outboxEvent.create({
        data: {
          workspaceId,
          eventType: 'deliverable.decision.submitted',
          payload: {
            reviewDecisionId: createdDecision.id,
            deliverableId: reviewRequest.version.deliverableId,
            versionNumber: reviewRequest.version.versionNumber,
            decision,
            actorId: actorUserId,
          },
        },
      });

      return {
        success: true,
        decision: createdDecision,
        newStatus: nextStatus,
        evidence: {
          fileChecksum,
          signatureHash,
          decidedAt: timestampUtc,
        },
      };
    });
  }
}
