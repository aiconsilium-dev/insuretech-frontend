import 'reflect-metadata';
import { AppDataSource } from '../data-source';
import {
  User,
  UserRole,
  Complex,
  Policy,
  PolicyType,
  Claim,
  ClaimType,
  ClaimStatus,
  ClaimPhoto,
  ClaimAiReason,
  ClaimPrecedent,
  ClaimEvent,
  EventStatus,
  TypeADetail,
  TypeBDetail,
  Estimation,
  EstimationItem,
  StandardSource,
  Document,
  DocType,
  DocStatus,
} from '../entities';

async function main() {
  await AppDataSource.initialize();
  const queryRunner = AppDataSource.createQueryRunner();
  await queryRunner.connect();
  await queryRunner.startTransaction();

  try {
    const userRepo = AppDataSource.getRepository(User);
    const complexRepo = AppDataSource.getRepository(Complex);
    const policyRepo = AppDataSource.getRepository(Policy);
    const claimRepo = AppDataSource.getRepository(Claim);
    const photoRepo = AppDataSource.getRepository(ClaimPhoto);
    const aiReasonRepo = AppDataSource.getRepository(ClaimAiReason);
    const precedentRepo = AppDataSource.getRepository(ClaimPrecedent);
    const eventRepo = AppDataSource.getRepository(ClaimEvent);
    const typeARepo = AppDataSource.getRepository(TypeADetail);
    const typeBRepo = AppDataSource.getRepository(TypeBDetail);
    const estimationRepo = AppDataSource.getRepository(Estimation);
    const estimationItemRepo = AppDataSource.getRepository(EstimationItem);
    const documentRepo = AppDataSource.getRepository(Document);

    // ── Users ──
    const adjuster = await userRepo.save(
      userRepo.create({
        email: 'jisu.kim@aptinsurance.co.kr',
        name: '김지수',
        role: UserRole.ADJUSTER,
      }),
    );

    const legal = await userRepo.save(
      userRepo.create({
        email: 'legal@aptinsurance.co.kr',
        name: 'APT Insurance 법무팀',
        role: UserRole.LEGAL,
      }),
    );

    // ── Complexes ──
    const helio = await complexRepo.save(
      complexRepo.create({
        name: '헬리오시티 102동 1204호',
        address: '서울시 송파구',
        builtAt: new Date('2017-06-01'),
      }),
    );

    const mapo = await complexRepo.save(
      complexRepo.create({
        name: '마포래미안 803호',
        address: '서울시 마포구',
        builder: '○○건설',
        builtAt: new Date('2018-11-01'),
        warrantyYr: 10,
      }),
    );

    const jamsil = await complexRepo.save(
      complexRepo.create({
        name: '잠실파크리오 1205호',
        address: '서울시 송파구',
      }),
    );

    const songdo = await complexRepo.save(
      complexRepo.create({
        name: '송도더샵 A동 201호',
        address: '인천시 연수구',
        builder: '△△건설',
        builtAt: new Date('2019-03-01'),
      }),
    );

    const bundang = await complexRepo.save(
      complexRepo.create({
        name: '분당파크뷰 502호',
        address: '성남시 분당구',
      }),
    );

    const raemian = await complexRepo.save(
      complexRepo.create({
        name: '래미안 원베일리 301호',
        address: '서울시 서초구',
      }),
    );

    const eunpyeong = await complexRepo.save(
      complexRepo.create({
        name: '은평뉴타운 관리동',
        address: '서울시 은평구',
      }),
    );

    // ── Policies ──
    const helioPolicy = await policyRepo.save(
      policyRepo.create({
        complexId: helio.id,
        policyType: PolicyType.HOUSING_FIRE,
        holderName: '헬리오시티 입주자대표회의',
        deductible: 30000,
      }),
    );

    const mapoPolicy = await policyRepo.save(
      policyRepo.create({
        complexId: mapo.id,
        policyType: PolicyType.FIRE,
        holderName: '마포래미안 관리사무소',
      }),
    );

    const jamsilPolicy = await policyRepo.save(
      policyRepo.create({
        complexId: jamsil.id,
        policyType: PolicyType.LIABILITY,
        holderName: '잠실파크리오 관리사무소',
      }),
    );

    // ── Claims ──

    // CLM-0244: 은평뉴타운 — Type C, wait
    await claimRepo.save(
      claimRepo.create({
        id: 'CLM-0244',
        complexId: eunpyeong.id,
        assigneeId: adjuster.id,
        description: '엘리베이터 낙상 사고',
        type: ClaimType.C,
        status: ClaimStatus.WAIT,
        amount: 1240000,
        aiConfidence: 0.983,
        claimedAt: new Date('2026-03-12'),
      }),
    );

    // CLM-0247: 헬리오시티 — Type C, done
    const clm0247 = await claimRepo.save(
      claimRepo.create({
        id: 'CLM-0247',
        complexId: helio.id,
        policyId: helioPolicy.id,
        assigneeId: adjuster.id,
        description: '천장 급배수 누수',
        type: ClaimType.C,
        status: ClaimStatus.DONE,
        amount: 607850,
        aiConfidence: 0.971,
        claimedAt: new Date('2026-03-14T09:23:00+09:00'),
      }),
    );

    const est0247 = await estimationRepo.save(
      estimationRepo.create({
        claimId: clm0247.id,
        totalAmount: 607850,
        calcSeconds: 401,
        vendorEstimate: 850000,
        depreciation: 60150,
        indirectRate: 0.105,
        finalAmount: 607850,
      }),
    );

    await estimationItemRepo.save([
      estimationItemRepo.create({ estimationId: est0247.claimId, name: '방수층 보수', description: '탄성도막 방수', quantity: 3.10, unit: '㎡', standardSrc: StandardSource.STANDARD_COST, subtotal: 79100, sortOrder: 0 }),
      estimationItemRepo.create({ estimationId: est0247.claimId, name: '천장 재도장', description: '퍼티 + 도장 2회', quantity: 12.30, unit: '㎡', standardSrc: StandardSource.PRICE_INDEX, subtotal: 124700, sortOrder: 1 }),
      estimationItemRepo.create({ estimationId: est0247.claimId, name: '균열주입', description: '에폭시 수지', quantity: 4.70, unit: 'm', standardSrc: StandardSource.STANDARD_COST, subtotal: 104900, sortOrder: 2 }),
      estimationItemRepo.create({ estimationId: est0247.claimId, name: '석고보드 교체', description: '미선택', quantity: 2.40, unit: '㎡', subtotal: 42700, isSelected: false, sortOrder: 3 }),
    ]);

    await photoRepo.save([
      photoRepo.create({ claimId: clm0247.id, label: '세그멘테이션 결과', fileUrl: '/uploads/CLM-0247/segmentation.jpg', sortOrder: 0, annotations: [{ text: 'AREA 2.4㎡', position: 'bottom-right', color: 'var(--color-primary)' }] }),
      photoRepo.create({ claimId: clm0247.id, label: '근접 확인', fileUrl: '/uploads/CLM-0247/close1.jpg', sortOrder: 1 }),
      photoRepo.create({ claimId: clm0247.id, label: '재료 확인', fileUrl: '/uploads/CLM-0247/material.jpg', sortOrder: 2 }),
    ]);

    await aiReasonRepo.save([
      aiReasonRepo.create({ claimId: clm0247.id, reasonText: '공용 급배수 배관 누출에 의한 전유부 피해 확인', sortOrder: 0 }),
      aiReasonRepo.create({ claimId: clm0247.id, reasonText: 'TYPE A(시공 하자) 근거 불충분', sortOrder: 1 }),
      aiReasonRepo.create({ claimId: clm0247.id, reasonText: 'TYPE B(점유자 과실) 증거 없음 → 정당 보상 대상', sortOrder: 2 }),
    ]);

    await eventRepo.save([
      eventRepo.create({ claimId: clm0247.id, title: '청구 접수', eventAt: new Date('2026-03-14T09:23:00+09:00'), status: EventStatus.DONE, sortOrder: 0 }),
      eventRepo.create({ claimId: clm0247.id, title: 'AI 분류 완료 (TYPE C)', eventAt: new Date('2026-03-14T09:24:00+09:00'), status: EventStatus.DONE, sortOrder: 1 }),
      eventRepo.create({ claimId: clm0247.id, title: '적산 산출 완료 (607,850원)', eventAt: new Date('2026-03-14T09:31:00+09:00'), status: EventStatus.DONE, sortOrder: 2 }),
      eventRepo.create({ claimId: clm0247.id, title: '법률 의견서 첨부', eventAt: new Date('2026-03-14T09:45:00+09:00'), status: EventStatus.DONE, sortOrder: 3 }),
      eventRepo.create({ claimId: clm0247.id, title: '손해사정사 최종 승인 대기', status: EventStatus.NOW, stepNumber: 5, sortOrder: 4 }),
    ]);

    await documentRepo.save([
      documentRepo.create({
        claimId: clm0247.id,
        docType: DocType.ADJUSTMENT_OPINION,
        title: '손해사정 의견서',
        content: '보험업법 제185조 기반 손해사정 의견서',
        status: DocStatus.WAIT,
        reviewedBy: 'APT Insurance 법무팀',
        reviewedAt: new Date('2026-03-14T09:45:00+09:00'),
      }),
    ]);

    // CLM-0246: 마포래미안 — Type A, transfer
    const clm0246 = await claimRepo.save(
      claimRepo.create({
        id: 'CLM-0246',
        complexId: mapo.id,
        policyId: mapoPolicy.id,
        assigneeId: adjuster.id,
        description: '외벽 수직 관통균열',
        type: ClaimType.A,
        status: ClaimStatus.TRANSFER,
        aiConfidence: 0.912,
        claimedAt: new Date('2026-03-13T14:05:00+09:00'),
      }),
    );

    await typeARepo.save(
      typeARepo.create({
        claimId: clm0246.id,
        defectType: '주요 구조부 균열 (10년 담보)',
        warrantyRemaining: '5년 1개월 — 소송 적격',
        totalClaimEst: 3800000000,
        unitClaimEst: 38000000,
        isExemption: true,
      }),
    );

    await photoRepo.save([
      photoRepo.create({ claimId: clm0246.id, label: '전경 — 소송 증거 등록', fileUrl: '/uploads/CLM-0246/overview.jpg', sortOrder: 0, annotations: [{ text: '균열 측정 0.8mm', position: 'bottom-left', color: 'var(--color-amber)' }, { text: '증거 등록 완료', position: 'top-right', color: 'var(--color-green)' }] }),
      photoRepo.create({ claimId: clm0246.id, label: '근접 1', fileUrl: '/uploads/CLM-0246/close1.jpg', sortOrder: 1 }),
      photoRepo.create({ claimId: clm0246.id, label: '근접 2', fileUrl: '/uploads/CLM-0246/close2.jpg', sortOrder: 2 }),
    ]);

    await aiReasonRepo.save([
      aiReasonRepo.create({ claimId: clm0246.id, reasonText: '수직 관통균열 폭 0.8mm — 건설기준 허용치(0.3mm) 2.7배 초과', sortOrder: 0 }),
      aiReasonRepo.create({ claimId: clm0246.id, reasonText: '균열 방향·패턴이 전단 변형 구조적 하자와 일치 — 외부 충격 아님', sortOrder: 1 }),
      aiReasonRepo.create({ claimId: clm0246.id, reasonText: '건축 4.9년차, 하자담보 기간(10년) 이내 → 시공사 귀책', sortOrder: 2 }),
    ]);

    await precedentRepo.save([
      precedentRepo.create({ claimId: clm0246.id, caseNumber: '대법원 2019다287231', description: '외벽 균열 시공사 귀책 인정 — 손해배상 확정', sortOrder: 0 }),
      precedentRepo.create({ claimId: clm0246.id, caseNumber: '서울고법 2021나38421', description: '동일 균열 패턴 공동주택 하자담보책임 인용', sortOrder: 1 }),
    ]);

    await eventRepo.save([
      eventRepo.create({ claimId: clm0246.id, title: 'AI 하자 분류 완료 (시공상 하자 확인)', eventAt: new Date('2026-03-13T14:05:00+09:00'), status: EventStatus.DONE, sortOrder: 0 }),
      eventRepo.create({ claimId: clm0246.id, title: '증거자료 패키지 자동 생성 → APT Insurance 소송팀 전달', eventAt: new Date('2026-03-13T14:07:00+09:00'), status: EventStatus.DONE, sortOrder: 1 }),
      eventRepo.create({ claimId: clm0246.id, title: '소송 제기 준비 중', status: EventStatus.NOW, stepNumber: 3, sortOrder: 2 }),
      eventRepo.create({ claimId: clm0246.id, title: '변론 진행 예정', status: EventStatus.WAIT, stepNumber: 4, sortOrder: 3 }),
    ]);

    await documentRepo.save([
      documentRepo.create({ claimId: clm0246.id, docType: DocType.LITIGATION_BRIEF, title: '소송 이관 근거서', status: DocStatus.TRANSFER, reviewedBy: 'APT Insurance 법무팀' }),
    ]);

    // CLM-0245: 잠실파크리오 — Type B, sent
    const clm0245 = await claimRepo.save(
      claimRepo.create({
        id: 'CLM-0245',
        complexId: jamsil.id,
        policyId: jamsilPolicy.id,
        claimantName: '홍○○',
        description: '세탁기 배수 연결 불량',
        type: ClaimType.B,
        status: ClaimStatus.SENT,
        aiConfidence: 0.958,
        claimedAt: new Date('2026-03-13T11:30:00+09:00'),
      }),
    );

    await typeBRepo.save(
      typeBRepo.create({
        claimId: clm0245.id,
        applicableClause: '보험약관 제4조 제2항 제3호 — 피보험자/점유자의 고의·과실',
        objectionDeadline: new Date('2026-04-12'),
        currentStep: 0,
        flowSteps: [
          { label: '면책 통보 완료', description: '2026-03-13 법률 의견서와 함께 면책 사유 발송 완료. 이의신청 기한: 30일' },
          { label: '이의신청 수신', description: '이의신청이 수신되었습니다. APT Insurance 법무팀 검토 중입니다.' },
          { label: '재검토 중', description: 'APT Insurance 법무팀이 이의신청을 재검토하고 있습니다. 추가 서류가 요청될 수 있습니다.' },
          { label: '최종 종결', description: '최종 종결 처리되었습니다. 청구인에게 최종 결정 통보가 발송되었습니다.' },
        ],
      }),
    );

    await aiReasonRepo.save([
      aiReasonRepo.create({ claimId: clm0245.id, reasonText: '세탁기 배수 호스 연결부 이탈 흔적 확인', sortOrder: 0 }),
      aiReasonRepo.create({ claimId: clm0245.id, reasonText: '외부 충격 없이 점유자 부주의로 인한 배수 불량 패턴', sortOrder: 1 }),
      aiReasonRepo.create({ claimId: clm0245.id, reasonText: "민법 758조 공작물 책임 — '설치·관리 하자' 미충족", sortOrder: 2 }),
    ]);

    await precedentRepo.save([
      precedentRepo.create({ claimId: clm0245.id, caseNumber: '서울중앙지법 2022가단52890', description: '세입자 과실로 인한 면책 판결', sortOrder: 0 }),
    ]);

    await documentRepo.save([
      documentRepo.create({ claimId: clm0245.id, docType: DocType.EXEMPTION_NOTICE, title: '면책 통보서 — 잠실파크리오 세탁기 배수', content: '본 건은 보험약관 제4조 제2항 제3호에 따라 면책 대상으로 판단됩니다.', status: DocStatus.DONE, reviewedBy: 'APT Insurance 법무팀', reviewedAt: new Date('2026-03-13T15:22:00+09:00') }),
      documentRepo.create({ claimId: clm0245.id, docType: DocType.CIVIL_RESPONSE, title: '민원 대응 요약서', status: DocStatus.DONE }),
      documentRepo.create({ claimId: clm0245.id, docType: DocType.CIVIL_RESPONSE, title: '약관 조항 해석서', status: DocStatus.DONE }),
      documentRepo.create({ claimId: clm0245.id, docType: DocType.CIVIL_RESPONSE, title: '유사 판례 패키지', status: DocStatus.DONE }),
    ]);

    // CLM-0243: 송도더샵 — Type A, transfer
    const clm0243 = await claimRepo.save(
      claimRepo.create({
        id: 'CLM-0243',
        complexId: songdo.id,
        description: '시공 하자 — 바닥 침하',
        type: ClaimType.A,
        status: ClaimStatus.TRANSFER,
        aiConfidence: 0.887,
        claimedAt: new Date('2026-03-12'),
      }),
    );

    await typeARepo.save(
      typeARepo.create({
        claimId: clm0243.id,
        defectType: '바닥 침하',
        isExemption: true,
      }),
    );

    // CLM-0242: 분당파크뷰 — Type B, done
    const clm0242 = await claimRepo.save(
      claimRepo.create({
        id: 'CLM-0242',
        complexId: bundang.id,
        description: '바닥재 파손',
        type: ClaimType.B,
        status: ClaimStatus.DONE,
        aiConfidence: 0.931,
        claimedAt: new Date('2026-03-11'),
      }),
    );

    await documentRepo.save([
      documentRepo.create({ claimId: clm0242.id, docType: DocType.EXEMPTION_NOTICE, title: '면책 통보서 — 분당파크뷰 바닥재 파손', status: DocStatus.DONE }),
    ]);

    // CLM-0241: 래미안 원베일리 — Type C, paid
    await claimRepo.save(
      claimRepo.create({
        id: 'CLM-0241',
        complexId: raemian.id,
        description: '욕실 배관 누수',
        type: ClaimType.C,
        status: ClaimStatus.PAID,
        amount: 0,
        aiConfidence: 0.991,
        claimedAt: new Date('2026-03-10'),
      }),
    );

    await queryRunner.commitTransaction();
    console.log('✅ Seed data created successfully');
    void legal; // suppress unused warning
  } catch (error) {
    await queryRunner.rollbackTransaction();
    console.error('❌ Seed failed:', error);
    process.exit(1);
  } finally {
    await queryRunner.release();
    await AppDataSource.destroy();
  }
}

main();
