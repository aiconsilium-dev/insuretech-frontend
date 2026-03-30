import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialDatabaseSetup1700000000000 implements MigrationInterface {
  name = 'InitialDatabaseSetup1700000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Users and Auth
    await queryRunner.query(`CREATE TYPE "public"."users_role_enum" AS ENUM('adjuster', 'legal', 'admin')`);
    await queryRunner.query(`
        CREATE TABLE "users" (
            "created_at" timestamptz NOT NULL DEFAULT now(),
            "updated_at" timestamptz NOT NULL DEFAULT now(),
            "deleted_at" timestamptz,
            "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
            "email" character varying NOT NULL,
            "password_hash" character varying NOT NULL,
            "name" character varying NOT NULL,
            "role" "public"."users_role_enum" NOT NULL DEFAULT 'adjuster',
            "is_active" boolean NOT NULL DEFAULT true,
            "deactivated_at" timestamptz,
            "last_login_at" timestamptz,
            CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"),
            CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id")
        )
    `);
    await queryRunner.query(`
        CREATE TABLE "user_refresh_tokens" (
            "created_at" timestamptz NOT NULL DEFAULT now(),
            "updated_at" timestamptz NOT NULL DEFAULT now(),
            "deleted_at" timestamptz,
            "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
            "user_id" uuid NOT NULL,
            "refresh_token" character varying NOT NULL,
            "ip_address" character varying NOT NULL,
            "user_agent" character varying NOT NULL,
            "expires_at" timestamptz NOT NULL,
            CONSTRAINT "PK_a1de2ce9f43c49e1250f55b11c9" PRIMARY KEY ("id")
        )
    `);

    // Core Domain Tables
    await queryRunner.query(`
        CREATE TABLE "complexes" (
            "created_at" timestamptz NOT NULL DEFAULT now(),
            "updated_at" timestamptz NOT NULL DEFAULT now(),
            "deleted_at" timestamptz,
            "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
            "name" character varying(200) NOT NULL,
            "address" text,
            "builder" character varying(100),
            "built_at" date,
            "warranty_yr" smallint NOT NULL DEFAULT 10,
            CONSTRAINT "PK_827279403de1d9e761e247e03fd" PRIMARY KEY ("id")
        )
    `);
    await queryRunner.query(`CREATE TYPE "public"."policies_policy_type_enum" AS ENUM('fire', 'liability', 'housing_fire')`);
    await queryRunner.query(`
        CREATE TABLE "policies" (
            "created_at" timestamptz NOT NULL DEFAULT now(),
            "updated_at" timestamptz NOT NULL DEFAULT now(),
            "deleted_at" timestamptz,
            "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
            "complex_id" uuid NOT NULL,
            "policy_type" "public"."policies_policy_type_enum" NOT NULL,
            "holder_name" character varying(100),
            "valid_from" date,
            "valid_until" date,
            "deductible" integer NOT NULL DEFAULT 0,
            CONSTRAINT "PK_603e09f183df0108d8695c57e28" PRIMARY KEY ("id")
        )
    `);
    await queryRunner.query(`CREATE TYPE "public"."claims_type_enum" AS ENUM('A', 'B', 'C')`);
    await queryRunner.query(`CREATE TYPE "public"."claims_status_enum" AS ENUM('wait', 'done', 'sent', 'transfer', 'paid')`);
    await queryRunner.query(`
        CREATE TABLE "claims" (
            "created_at" timestamptz NOT NULL DEFAULT now(),
            "updated_at" timestamptz NOT NULL DEFAULT now(),
            "deleted_at" timestamptz,
            "id" character varying(20) NOT NULL,
            "complex_id" uuid NOT NULL,
            "policy_id" uuid,
            "assignee_id" uuid,
            "claimant_name" character varying(100),
            "description" text NOT NULL,
            "type" "public"."claims_type_enum" NOT NULL,
            "status" "public"."claims_status_enum" NOT NULL,
            "amount" integer,
            "ai_confidence" numeric(4,3),
            "claimed_at" timestamptz NOT NULL,
            CONSTRAINT "PK_96c91970c0dcb2f69fdccd0a698" PRIMARY KEY ("id")
        )
    `);
    await queryRunner.query(`CREATE INDEX "IDX_claims_complex_id" ON "claims" ("complex_id")`);
    await queryRunner.query(`CREATE INDEX "IDX_claims_type" ON "claims" ("type")`);
    await queryRunner.query(`CREATE INDEX "IDX_claims_status" ON "claims" ("status")`);
    await queryRunner.query(`CREATE INDEX "IDX_claims_claimed_at" ON "claims" ("claimed_at")`);

    // Claim Detail Tables
    await queryRunner.query(`
        CREATE TABLE "type_a_details" (
            "created_at" timestamptz NOT NULL DEFAULT now(),
            "updated_at" timestamptz NOT NULL DEFAULT now(),
            "deleted_at" timestamptz,
            "claim_id" character varying(20) NOT NULL,
            "defect_type" character varying(200),
            "warranty_remaining" character varying(100),
            "total_claim_est" bigint,
            "unit_claim_est" bigint,
            "is_exemption" boolean NOT NULL DEFAULT true,
            CONSTRAINT "PK_af4d96e430fe215123dbca0ea8c" PRIMARY KEY ("claim_id")
        )
    `);
    await queryRunner.query(`
        CREATE TABLE "type_b_details" (
            "created_at" timestamptz NOT NULL DEFAULT now(),
            "updated_at" timestamptz NOT NULL DEFAULT now(),
            "deleted_at" timestamptz,
            "claim_id" character varying(20) NOT NULL,
            "applicable_clause" text,
            "objection_deadline" date,
            "current_step" smallint NOT NULL DEFAULT 0,
            "flow_steps" jsonb NOT NULL DEFAULT '[]',
            CONSTRAINT "PK_419bb3178ebdf194c6cfe694895" PRIMARY KEY ("claim_id")
        )
    `);

    // Supporting Claim Information Tables
    await queryRunner.query(`
        CREATE TABLE "claim_photos" (
            "created_at" timestamptz NOT NULL DEFAULT now(),
            "updated_at" timestamptz NOT NULL DEFAULT now(),
            "deleted_at" timestamptz,
            "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
            "claim_id" character varying(20) NOT NULL,
            "label" character varying(100),
            "file_url" text NOT NULL,
            "sort_order" smallint NOT NULL DEFAULT 0,
            "annotations" jsonb NOT NULL DEFAULT '[]',
            CONSTRAINT "PK_4d77639ea1c3a4e0e7a2ba6e014" PRIMARY KEY ("id")
        )
    `);
    await queryRunner.query(`
        CREATE TABLE "claim_ai_reasons" (
            "created_at" timestamptz NOT NULL DEFAULT now(),
            "updated_at" timestamptz NOT NULL DEFAULT now(),
            "deleted_at" timestamptz,
            "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
            "claim_id" character varying(20) NOT NULL,
            "reason_text" text NOT NULL,
            "sort_order" smallint NOT NULL DEFAULT 0,
            CONSTRAINT "PK_55b0e3926cf50f1da7739171e87" PRIMARY KEY ("id")
        )
    `);
    await queryRunner.query(`
        CREATE TABLE "claim_precedents" (
            "created_at" timestamptz NOT NULL DEFAULT now(),
            "updated_at" timestamptz NOT NULL DEFAULT now(),
            "deleted_at" timestamptz,
            "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
            "claim_id" character varying(20) NOT NULL,
            "case_number" character varying(100) NOT NULL,
            "description" text,
            "sort_order" smallint NOT NULL DEFAULT 0,
            CONSTRAINT "PK_1646e8e938aff998fb8543abfd5" PRIMARY KEY ("id")
        )
    `);
    await queryRunner.query(`CREATE TYPE "public"."claim_events_status_enum" AS ENUM('done', 'now', 'wait')`);
    await queryRunner.query(`
        CREATE TABLE "claim_events" (
            "created_at" timestamptz NOT NULL DEFAULT now(),
            "updated_at" timestamptz NOT NULL DEFAULT now(),
            "deleted_at" timestamptz,
            "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
            "claim_id" character varying(20) NOT NULL,
            "title" character varying(200) NOT NULL,
            "event_at" timestamptz,
            "status" "public"."claim_events_status_enum" NOT NULL,
            "step_number" smallint,
            "sort_order" smallint NOT NULL DEFAULT 0,
            CONSTRAINT "PK_80155c96869c58af00970213e98" PRIMARY KEY ("id")
        )
    `);
    
    // Document and Approval Tables
    await queryRunner.query(`CREATE TYPE "public"."documents_doc_type_enum" AS ENUM('exemption_notice', 'litigation_brief', 'adjustment_opinion', 'civil_response')`);
    await queryRunner.query(`CREATE TYPE "public"."documents_status_enum" AS ENUM('draft', 'wait', 'done', 'transfer')`);
    await queryRunner.query(`
        CREATE TABLE "documents" (
            "created_at" timestamptz NOT NULL DEFAULT now(),
            "updated_at" timestamptz NOT NULL DEFAULT now(),
            "deleted_at" timestamptz,
            "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
            "claim_id" character varying(20) NOT NULL,
            "doc_type" "public"."documents_doc_type_enum" NOT NULL,
            "title" character varying(200) NOT NULL,
            "content" text,
            "file_url" text,
            "status" "public"."documents_status_enum",
            "reviewed_by" character varying(100),
            "reviewed_at" timestamptz,
            CONSTRAINT "PK_ac51aa5181ee2036f5ca482857c" PRIMARY KEY ("id")
        )
    `);
    await queryRunner.query(`CREATE TYPE "public"."approvals_decision_enum" AS ENUM('approve', 'modify', 'reclassify', 'reject')`);
    await queryRunner.query(`
        CREATE TABLE "approvals" (
            "created_at" timestamptz NOT NULL DEFAULT now(),
            "updated_at" timestamptz NOT NULL DEFAULT now(),
            "deleted_at" timestamptz,
            "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
            "claim_id" character varying(20) NOT NULL,
            "approver_id" uuid NOT NULL,
            "decision" "public"."approvals_decision_enum" NOT NULL,
            "approved_amount" integer,
            "comment" text,
            "decided_at" timestamptz NOT NULL DEFAULT now(),
            CONSTRAINT "PK_690417aaefa84d18b1a59e2a499" PRIMARY KEY ("id")
        )
    `);

    // Estimation Tables
    await queryRunner.query(`
        CREATE TABLE "estimations" (
            "created_at" timestamptz NOT NULL DEFAULT now(),
            "updated_at" timestamptz NOT NULL DEFAULT now(),
            "deleted_at" timestamptz,
            "claim_id" character varying(20) NOT NULL,
            "total_amount" integer NOT NULL,
            "calc_seconds" integer,
            "vendor_estimate" integer,
            "depreciation" integer NOT NULL DEFAULT 0,
            "indirect_rate" numeric(4,3),
            "final_amount" integer NOT NULL,
            CONSTRAINT "PK_56c6502b0176d141d63fe1dd74e" PRIMARY KEY ("claim_id")
        )
    `);
    await queryRunner.query(`CREATE TYPE "public"."estimation_items_standard_src_enum" AS ENUM('standard_cost', 'price_index')`);
    await queryRunner.query(`
        CREATE TABLE "estimation_items" (
            "created_at" timestamptz NOT NULL DEFAULT now(),
            "updated_at" timestamptz NOT NULL DEFAULT now(),
            "deleted_at" timestamptz,
            "id" SERIAL NOT NULL,
            "estimation_id" character varying(20) NOT NULL,
            "name" character varying(100) NOT NULL,
            "description" character varying(200),
            "quantity" numeric(10,2) NOT NULL,
            "unit" character varying(20) NOT NULL,
            "standard_src" "public"."estimation_items_standard_src_enum",
            "subtotal" integer NOT NULL,
            "is_selected" boolean NOT NULL DEFAULT true,
            "sort_order" smallint NOT NULL DEFAULT 0,
            CONSTRAINT "PK_d990f5ec94999f1dea2db4045e5" PRIMARY KEY ("id")
        )
    `);
    
    // Foreign Keys
    await queryRunner.query(`ALTER TABLE "user_refresh_tokens" ADD CONSTRAINT "FK_user_refresh_tokens_user_id" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    await queryRunner.query(`ALTER TABLE "policies" ADD CONSTRAINT "FK_policies_complex_id" FOREIGN KEY ("complex_id") REFERENCES "complexes"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    await queryRunner.query(`ALTER TABLE "claims" ADD CONSTRAINT "FK_claims_complex_id" FOREIGN KEY ("complex_id") REFERENCES "complexes"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    await queryRunner.query(`ALTER TABLE "claims" ADD CONSTRAINT "FK_claims_policy_id" FOREIGN KEY ("policy_id") REFERENCES "policies"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    await queryRunner.query(`ALTER TABLE "claims" ADD CONSTRAINT "FK_claims_assignee_id" FOREIGN KEY ("assignee_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    await queryRunner.query(`ALTER TABLE "type_a_details" ADD CONSTRAINT "FK_type_a_details_claim_id" FOREIGN KEY ("claim_id") REFERENCES "claims"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    await queryRunner.query(`ALTER TABLE "type_b_details" ADD CONSTRAINT "FK_type_b_details_claim_id" FOREIGN KEY ("claim_id") REFERENCES "claims"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    await queryRunner.query(`ALTER TABLE "claim_photos" ADD CONSTRAINT "FK_claim_photos_claim_id" FOREIGN KEY ("claim_id") REFERENCES "claims"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    await queryRunner.query(`ALTER TABLE "claim_ai_reasons" ADD CONSTRAINT "FK_claim_ai_reasons_claim_id" FOREIGN KEY ("claim_id") REFERENCES "claims"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    await queryRunner.query(`ALTER TABLE "claim_precedents" ADD CONSTRAINT "FK_claim_precedents_claim_id" FOREIGN KEY ("claim_id") REFERENCES "claims"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    await queryRunner.query(`ALTER TABLE "claim_events" ADD CONSTRAINT "FK_claim_events_claim_id" FOREIGN KEY ("claim_id") REFERENCES "claims"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    await queryRunner.query(`ALTER TABLE "documents" ADD CONSTRAINT "FK_documents_claim_id" FOREIGN KEY ("claim_id") REFERENCES "claims"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    await queryRunner.query(`ALTER TABLE "approvals" ADD CONSTRAINT "FK_approvals_claim_id" FOREIGN KEY ("claim_id") REFERENCES "claims"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    await queryRunner.query(`ALTER TABLE "approvals" ADD CONSTRAINT "FK_approvals_approver_id" FOREIGN KEY ("approver_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    await queryRunner.query(`ALTER TABLE "estimations" ADD CONSTRAINT "FK_estimations_claim_id" FOREIGN KEY ("claim_id") REFERENCES "claims"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    await queryRunner.query(`ALTER TABLE "estimation_items" ADD CONSTRAINT "FK_estimation_items_estimation_id" FOREIGN KEY ("estimation_id") REFERENCES "estimations"("claim_id") ON DELETE CASCADE ON UPDATE NO ACTION`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop in reverse order of creation
    await queryRunner.query(`ALTER TABLE "estimation_items" DROP CONSTRAINT "FK_estimation_items_estimation_id"`);
    await queryRunner.query(`ALTER TABLE "estimations" DROP CONSTRAINT "FK_estimations_claim_id"`);
    await queryRunner.query(`ALTER TABLE "approvals" DROP CONSTRAINT "FK_approvals_approver_id"`);
    await queryRunner.query(`ALTER TABLE "approvals" DROP CONSTRAINT "FK_approvals_claim_id"`);
    await queryRunner.query(`ALTER TABLE "documents" DROP CONSTRAINT "FK_documents_claim_id"`);
    await queryRunner.query(`ALTER TABLE "claim_events" DROP CONSTRAINT "FK_claim_events_claim_id"`);
    await queryRunner.query(`ALTER TABLE "claim_precedents" DROP CONSTRAINT "FK_claim_precedents_claim_id"`);
    await queryRunner.query(`ALTER TABLE "claim_ai_reasons" DROP CONSTRAINT "FK_claim_ai_reasons_claim_id"`);
    await queryRunner.query(`ALTER TABLE "claim_photos" DROP CONSTRAINT "FK_claim_photos_claim_id"`);
    await queryRunner.query(`ALTER TABLE "type_b_details" DROP CONSTRAINT "FK_type_b_details_claim_id"`);
    await queryRunner.query(`ALTER TABLE "type_a_details" DROP CONSTRAINT "FK_type_a_details_claim_id"`);
    await queryRunner.query(`ALTER TABLE "claims" DROP CONSTRAINT "FK_claims_assignee_id"`);
    await queryRunner.query(`ALTER TABLE "claims" DROP CONSTRAINT "FK_claims_policy_id"`);
    await queryRunner.query(`ALTER TABLE "claims" DROP CONSTRAINT "FK_claims_complex_id"`);
    await queryRunner.query(`ALTER TABLE "policies" DROP CONSTRAINT "FK_policies_complex_id"`);
    await queryRunner.query(`ALTER TABLE "user_refresh_tokens" DROP CONSTRAINT "FK_user_refresh_tokens_user_id"`);

    await queryRunner.query(`DROP TABLE "estimation_items"`);
    await queryRunner.query(`DROP TYPE "public"."estimation_items_standard_src_enum"`);
    await queryRunner.query(`DROP TABLE "estimations"`);
    await queryRunner.query(`DROP TABLE "approvals"`);
    await queryRunner.query(`DROP TYPE "public"."approvals_decision_enum"`);
    await queryRunner.query(`DROP TABLE "documents"`);
    await queryRunner.query(`DROP TYPE "public"."documents_status_enum"`);
    await queryRunner.query(`DROP TYPE "public"."documents_doc_type_enum"`);
    await queryRunner.query(`DROP TABLE "claim_events"`);
    await queryRunner.query(`DROP TYPE "public"."claim_events_status_enum"`);
    await queryRunner.query(`DROP TABLE "claim_precedents"`);
    await queryRunner.query(`DROP TABLE "claim_ai_reasons"`);
    await queryRunner.query(`DROP TABLE "claim_photos"`);
    await queryRunner.query(`DROP TABLE "type_b_details"`);
    await queryRunner.query(`DROP TABLE "type_a_details"`);

    await queryRunner.query(`DROP INDEX "public"."IDX_claims_claimed_at"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_claims_status"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_claims_type"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_claims_complex_id"`);
    await queryRunner.query(`DROP TABLE "claims"`);
    await queryRunner.query(`DROP TYPE "public"."claims_status_enum"`);
    await queryRunner.query(`DROP TYPE "public"."claims_type_enum"`);
    
    await queryRunner.query(`DROP TABLE "policies"`);
    await queryRunner.query(`DROP TYPE "public"."policies_policy_type_enum"`);
    
    await queryRunner.query(`DROP TABLE "complexes"`);
    
    await queryRunner.query(`DROP TABLE "user_refresh_tokens"`);
    await queryRunner.query(`DROP TABLE "users"`);
    await queryRunner.query(`DROP TYPE "public"."users_role_enum"`);
  }
}
