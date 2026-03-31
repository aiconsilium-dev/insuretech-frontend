import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Claim, ClaimStatus, ClaimType } from './entity/claim.entity';
import { Estimation } from '@/estimations/entity/estimation.entity';
import { EstimationItem } from '@/estimations/entity/estimation-item.entity';
import { Approval, Decision } from '@/approvals/entity/approval.entity';
import { ListClaimsDto } from './dto/list-claims.dto';
import { UpdateEstimationItemDto } from './dto/update-estimation-item.dto';
import { CreateApprovalDto } from './dto/create-approval.dto';
import { User } from '@/users/entity/user.entity';

@Injectable()
export class ClaimsService {
  constructor(
    @InjectRepository(Claim)
    private readonly claimRepository: Repository<Claim>,
    @InjectRepository(Estimation)
    private readonly estimationRepository: Repository<Estimation>,
    @InjectRepository(EstimationItem)
    private readonly estimationItemRepository: Repository<EstimationItem>,
    @InjectRepository(Approval)
    private readonly approvalRepository: Repository<Approval>,
    private readonly dataSource: DataSource,
  ) {}

  async findAll(dto: ListClaimsDto) {
    const { type, status, search, page = 1, limit = 10 } = dto;
    const skip = (page - 1) * limit;

    const qb = this.claimRepository
      .createQueryBuilder('claim')
      .leftJoin('claim.complex', 'complex')
      .select([
        'claim.id',
        'complex.name',
        'claim.description',
        'claim.claimedAt',
        'claim.type',
        'claim.status',
        'claim.aiConfidence',
        'claim.amount',
      ])
      .where('claim.deletedAt IS NULL');

    if (type) {
      qb.andWhere('claim.type = :type', { type });
    }

    if (status) {
      qb.andWhere('claim.status = :status', { status });
    }

    if (search) {
      qb.andWhere(
        '(complex.name ILIKE :search OR claim.id ILIKE :search OR claim.description ILIKE :search)',
        { search: `%${search}%` },
      );
    }

    const [rawItems, totalCount] = await qb
      .orderBy('claim.claimedAt', 'DESC')
      .skip(skip)
      .take(limit)
      .getManyAndCount();

    const items = rawItems.map((c) => ({
      id: c.id,
      complexName: (c.complex as unknown as { name: string })?.name ?? null,
      description: c.description,
      claimedAt: c.claimedAt,
      type: c.type,
      status: c.status,
      aiConfidence: c.aiConfidence,
      amount: c.amount,
    }));

    const totalPages = Math.ceil(totalCount / limit);

    return { items, totalCount, page, totalPages };
  }

  async findOne(id: string) {
    const qb = this.claimRepository
      .createQueryBuilder('claim')
      .leftJoin('claim.complex', 'complex')
      .leftJoin('claim.policy', 'policy')
      .leftJoin('claim.assignee', 'assignee')
      .leftJoin('claim.photos', 'photo')
      .leftJoin('claim.aiReasons', 'aiReason')
      .leftJoin('claim.precedents', 'precedent')
      .leftJoin('claim.events', 'event')
      .select([
        'claim.id',
        'claim.description',
        'claim.claimedAt',
        'claim.type',
        'claim.status',
        'claim.aiConfidence',
        'claim.amount',
        'claim.claimantName',
        'complex.id',
        'complex.name',
        'complex.address',
        'complex.builder',
        'complex.builtAt',
        'complex.warrantyYr',
        'policy.id',
        'policy.policyType',
        'policy.holderName',
        'policy.validFrom',
        'policy.validUntil',
        'policy.deductible',
        'assignee.id',
        'assignee.name',
        'assignee.email',
        'assignee.role',
        'photo.id',
        'photo.label',
        'photo.fileUrl',
        'photo.sortOrder',
        'photo.annotations',
        'aiReason.id',
        'aiReason.reasonText',
        'aiReason.sortOrder',
        'precedent.id',
        'precedent.caseNumber',
        'precedent.description',
        'precedent.sortOrder',
        'event.id',
        'event.title',
        'event.eventAt',
        'event.status',
        'event.stepNumber',
        'event.sortOrder',
      ])
      .where('claim.id = :id', { id })
      .andWhere('claim.deletedAt IS NULL');

    const claim = await qb.getOne();
    if (!claim) {
      throw new NotFoundException(`Claim with id ${id} not found`);
    }

    const result: Record<string, unknown> = {
      id: claim.id,
      description: claim.description,
      claimedAt: claim.claimedAt,
      type: claim.type,
      status: claim.status,
      aiConfidence: claim.aiConfidence,
      amount: claim.amount,
      claimantName: claim.claimantName,
      complex: claim.complex,
      policy: claim.policy,
      assignee: claim.assignee,
      photos: claim.photos,
      aiReasons: claim.aiReasons,
      precedents: claim.precedents,
      events: claim.events,
    };

    // Conditionally load type-specific details
    if (claim.type === ClaimType.A) {
      const typeADetail = await this.dataSource
        .createQueryBuilder()
        .select([
          'detail.claimId',
          'detail.defectType',
          'detail.warrantyRemaining',
          'detail.totalClaimEst',
          'detail.unitClaimEst',
          'detail.isExemption',
        ])
        .from('type_a_details', 'detail')
        .where('detail.claim_id = :id', { id })
        .getRawOne();
      result.typeADetail = typeADetail ?? null;
    } else if (claim.type === ClaimType.B) {
      const typeBDetail = await this.dataSource
        .createQueryBuilder()
        .select([
          'detail.claimId',
          'detail.applicableClause',
          'detail.objectionDeadline',
          'detail.currentStep',
          'detail.flowSteps',
        ])
        .from('type_b_details', 'detail')
        .where('detail.claim_id = :id', { id })
        .getRawOne();
      result.typeBDetail = typeBDetail ?? null;
    } else if (claim.type === ClaimType.C) {
      result.estimation = (await this.loadEstimation(id)) ?? null;
    }

    return result;
  }

  async findEstimation(claimId: string) {
    const estimation = await this.loadEstimation(claimId);

    if (!estimation) {
      throw new NotFoundException(`Estimation for claim ${claimId} not found`);
    }

    return estimation;
  }

  /**
   * Shared helper — loads estimation + items for a given claimId.
   * Returns null if not found (callers decide whether to throw).
   */
  private async loadEstimation(claimId: string) {
    return this.estimationRepository
      .createQueryBuilder('estimation')
      .leftJoin('estimation.items', 'item')
      .select([
        'estimation.claimId',
        'estimation.totalAmount',
        'estimation.calcSeconds',
        'estimation.vendorEstimate',
        'estimation.depreciation',
        'estimation.indirectRate',
        'estimation.finalAmount',
        'item.id',
        'item.name',
        'item.description',
        'item.quantity',
        'item.unit',
        'item.standardSrc',
        'item.subtotal',
        'item.isSelected',
        'item.sortOrder',
      ])
      .where('estimation.claimId = :claimId', { claimId })
      .getOne();
  }

  async updateEstimationItem(claimId: string, itemId: number, dto: UpdateEstimationItemDto) {
    // Verify claim exists
    const claim = await this.claimRepository.findOne({ where: { id: claimId } });
    if (!claim) {
      throw new NotFoundException(`Claim with id ${claimId} not found`);
    }

    const item = await this.estimationItemRepository
      .createQueryBuilder('item')
      .leftJoin('item.estimation', 'estimation')
      .select(['item.id', 'item.isSelected', 'estimation.claimId'])
      .where('item.id = :itemId', { itemId })
      .andWhere('estimation.claimId = :claimId', { claimId })
      .getOne();

    if (!item) {
      throw new NotFoundException(`Estimation item ${itemId} not found for claim ${claimId}`);
    }

    await this.estimationItemRepository.update(itemId, { isSelected: dto.isSelected });

    return { id: itemId, isSelected: dto.isSelected };
  }

  async createApproval(claimId: string, dto: CreateApprovalDto, approver: User) {
    const claim = await this.claimRepository.findOne({ where: { id: claimId } });
    if (!claim) {
      throw new NotFoundException(`Claim with id ${claimId} not found`);
    }

    if (dto.decision === Decision.APPROVE || dto.decision === Decision.MODIFY) {
      const approval = await this.dataSource.transaction(async (manager) => {
        await manager.update(Claim, { id: claimId }, { status: ClaimStatus.DONE });

        const newApproval = manager.create(Approval, {
          claimId,
          approverId: approver.id,
          decision: dto.decision,
          approvedAmount: dto.approvedAmount ?? null,
          comment: dto.comment ?? null,
        });
        return manager.save(newApproval);
      });

      return approval;
    }

    // For reclassify / reject — just create the approval record without changing claim status
    const newApproval = this.approvalRepository.create({
      claimId,
      approverId: approver.id,
      decision: dto.decision,
      approvedAmount: dto.approvedAmount ?? null,
      comment: dto.comment ?? null,
    });

    return this.approvalRepository.save(newApproval);
  }
}
