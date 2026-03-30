import { DataSource } from 'typeorm';
import AppDataSource from './seed-data-source';
import { User, UserRole } from '../users/entity/user.entity';
import { Complex } from '../complexes/entity/complex.entity';
import { Policy, PolicyType } from '../policies/entity/policy.entity';
import { Claim, ClaimStatus, ClaimType } from '../claims/entity/claim.entity';
import * as bcrypt from 'bcrypt';

async function seed() {
  await AppDataSource.initialize();
  console.log('Seeding database...');

  // 1. Create Users
  const passwordHash = await bcrypt.hash('password123', 10);
  const adminUser = await AppDataSource.manager.save(
    AppDataSource.manager.create(User, {
      email: 'admin@insuretech.com',
      passwordHash,
      name: 'Admin User',
      role: UserRole.ADMIN,
      isActive: true,
    }),
  );

  const adjusterUser = await AppDataSource.manager.save(
    AppDataSource.manager.create(User, {
      email: 'adjuster@insuretech.com',
      passwordHash,
      name: 'Adjuster User',
      role: UserRole.ADJUSTER,
      isActive: true,
    }),
  );

  // 2. Create Complex
  const complex1 = await AppDataSource.manager.save(
    AppDataSource.manager.create(Complex, {
      name: 'Central Park Apartments',
      address: '123 Main St, Anytown, USA',
      builder: 'BuildCorp',
      builtAt: new Date('2018-05-20'),
      warrantyYr: 10,
    }),
  );

  // 3. Create Policy
  const policy1 = await AppDataSource.manager.save(
    AppDataSource.manager.create(Policy, {
      complexId: complex1.id,
      policyType: PolicyType.HOUSING_FIRE,
      holderName: 'Central Park HOA',
      validFrom: new Date('2023-01-01'),
      validUntil: new Date('2024-01-01'),
      deductible: 5000,
    }),
  );

  // 4. Create Claims (CLM-0241 to CLM-0247)
  const claimsData = [
    { id: 'CLM-0241', description: 'Water damage in unit 101', type: ClaimType.A, status: ClaimStatus.WAIT, amount: 15000 },
    { id: 'CLM-0242', description: 'Roof leak in building B', type: ClaimType.A, status: ClaimStatus.DONE, amount: 25000 },
    { id: 'CLM-0243', description: 'Fire damage in the clubhouse', type: ClaimType.B, status: ClaimStatus.SENT, amount: 120000 },
    { id: 'CLM-0244', description: 'Cracked foundation in building C', type: ClaimType.C, status: ClaimStatus.TRANSFER, amount: 350000 },
    { id: 'CLM-0245', description: 'Broken window in unit 204', type: ClaimType.A, status: ClaimStatus.PAID, amount: 800 },
    { id: 'CLM-0246', description: 'Elevator malfunction in building A', type: ClaimType.B, status: ClaimStatus.WAIT, amount: 45000 },
    { id: 'CLM-0247', description: 'Common area plumbing issue', type: ClaimType.A, status: ClaimStatus.DONE, amount: 7500 },
  ];

  for (const data of claimsData) {
    await AppDataSource.manager.save(
      AppDataSource.manager.create(Claim, {
        ...data,
        complexId: complex1.id,
        policyId: policy1.id,
        assigneeId: adjusterUser.id,
        claimantName: 'John Doe',
        claimedAt: new Date(),
      }),
    );
  }

  console.log('Seeding complete.');
  await AppDataSource.destroy();
}

seed().catch((error) => console.error('Seeding failed:', error));
