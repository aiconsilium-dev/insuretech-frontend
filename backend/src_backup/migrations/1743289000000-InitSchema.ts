import { MigrationInterface, QueryRunner } from "typeorm";

export class InitSchema1743289000000 implements MigrationInterface {
    name = 'InitSchema1743289000000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."policies_policy_type_enum" AS ENUM('fire', 'liability', 'housing_fire')`);
        await queryRunner.query(`CREATE TABLE "policies" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "complex_id" uuid NOT NULL, "policy_type" "public"."policies_policy_type_enum" NOT NULL, "holder_name" character varying(100), "valid_from" date, "valid_until" date, "deductible" integer NOT NULL DEFAULT '0', "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_603e09f183df0108d8695c57e28" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "complexes" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(200) NOT NULL, "address" text, "builder" character varying(100), "built_at" date, "warranty_yr" smallint NOT NULL DEFAULT '10', "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_827279403de1d9e761e247e03fd" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "claim_photos" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "claim_id" character varying(20) NOT NULL, "label" character varying(100), "file_url" text NOT NULL, "sort_order" smallint NOT NULL DEFAULT '0', "annotations" jsonb NOT NULL DEFAULT '[]', "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_4d77639ea1c3a4e0e7a2ba6e014" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "claim_ai_reasons" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "claim_id" character varying(20) NOT NULL, "reason_text" text NOT NULL, "sort_order" smallint NOT NULL DEFAULT '0', "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_55b0e3926cf50f1da7739171e87" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "claim_precedents" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "claim_id" character varying(20) NOT NULL, "case_number" character varying(100) NOT NULL, "description" text, "sort_order" smallint NOT NULL DEFAULT '0', "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_1646e8e938aff998fb8543abfd5" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."claim_events_status_enum" AS ENUM('done', 'now', 'wait')`);
        await queryRunner.query(`CREATE TABLE "claim_events" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "claim_id" character varying(20) NOT NULL, "title" character varying(200) NOT NULL, "event_at" TIMESTAMP WITH TIME ZONE, "status" "public"."claim_events_status_enum" NOT NULL, "step_number" smallint, "sort_order" smallint NOT NULL DEFAULT '0', "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_80155c96869c58af00970213e98" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."documents_doc_type_enum" AS ENUM('exemption_notice', 'litigation_brief', 'adjustment_opinion', 'civil_response')`);
        await queryRunner.query(`CREATE TYPE "public"."documents_status_enum" AS ENUM('draft', 'wait', 'done', 'transfer')`);
        await queryRunner.query(`CREATE TABLE "documents" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "claim_id" character varying(20) NOT NULL, "doc_type" "public"."documents_doc_type_enum" NOT NULL, "title" character varying(200) NOT NULL, "content" text, "file_url" text, "status" "public"."documents_status_enum", "reviewed_by" character varying(100), "reviewed_at" TIMESTAMP WITH TIME ZONE, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_ac51aa5181ee2036f5ca482857c" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."approvals_decision_enum" AS ENUM('approve', 'modify', 'reclassify', 'reject')`);
        await queryRunner.query(`CREATE TABLE "approvals" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "claim_id" character varying(20) NOT NULL, "approver_id" uuid NOT NULL, "decision" "public"."approvals_decision_enum" NOT NULL, "approved_amount" integer, "comment" text, "decided_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_690417aaefa84d18b1a59e2a499" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "type_a_details" ("claim_id" character varying(20) NOT NULL, "defect_type" character varying(200), "warranty_remaining" character varying(100), "total_claim_est" bigint, "unit_claim_est" bigint, "is_exemption" boolean NOT NULL DEFAULT true, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_af4d96e430fe215123dbca0ea8c" PRIMARY KEY ("claim_id"))`);
        await queryRunner.query(`CREATE TABLE "type_b_details" ("claim_id" character varying(20) NOT NULL, "applicable_clause" text, "objection_deadline" date, "current_step" smallint NOT NULL DEFAULT '0', "flow_steps" jsonb NOT NULL DEFAULT '[]', "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_419bb3178ebdf194c6cfe694895" PRIMARY KEY ("claim_id"))`);
        await queryRunner.query(`CREATE TYPE "public"."estimation_items_standard_src_enum" AS ENUM('standard_cost', 'price_index')`);
        await queryRunner.query(`CREATE TABLE "estimation_items" ("id" SERIAL NOT NULL, "estimation_id" character varying(20) NOT NULL, "name" character varying(100) NOT NULL, "description" character varying(200), "quantity" numeric(10,2) NOT NULL, "unit" character varying(20) NOT NULL, "standard_src" "public"."estimation_items_standard_src_enum", "subtotal" integer NOT NULL, "is_selected" boolean NOT NULL DEFAULT true, "sort_order" smallint NOT NULL DEFAULT '0', "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_d990f5ec94999f1dea2db4045e5" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "estimations" ("claim_id" character varying(20) NOT NULL, "total_amount" integer NOT NULL, "calc_seconds" integer, "vendor_estimate" integer, "depreciation" integer NOT NULL DEFAULT '0', "indirect_rate" numeric(4,3), "final_amount" integer NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_56c6502b0176d141d63fe1dd74e" PRIMARY KEY ("claim_id"))`);
        await queryRunner.query(`CREATE TYPE "public"."claims_type_enum" AS ENUM('A', 'B', 'C')`);
        await queryRunner.query(`CREATE TYPE "public"."claims_status_enum" AS ENUM('wait', 'done', 'sent', 'transfer', 'paid')`);
        await queryRunner.query(`CREATE TABLE "claims" ("id" character varying(20) NOT NULL, "complex_id" uuid NOT NULL, "policy_id" uuid, "assignee_id" uuid, "claimant_name" character varying(100), "description" text NOT NULL, "type" "public"."claims_type_enum" NOT NULL, "status" "public"."claims_status_enum" NOT NULL, "amount" integer, "ai_confidence" numeric(4,3), "claimed_at" TIMESTAMP WITH TIME ZONE NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_96c91970c0dcb2f69fdccd0a698" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_74fe616ffa06c155ab39a8ac8e" ON "claims" ("complex_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_b6354381ae08e4a843acb872dd" ON "claims" ("claimed_at") `);
        await queryRunner.query(`CREATE INDEX "IDX_78214f7ed47cfd76fb8bf6bb28" ON "claims" ("status") `);
        await queryRunner.query(`CREATE INDEX "IDX_a53efeb7a948880f8989006934" ON "claims" ("type") `);
        await queryRunner.query(`CREATE TYPE "public"."users_role_enum" AS ENUM('adjuster', 'legal', 'admin')`);
        await queryRunner.query(`CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" character varying(255) NOT NULL, "password_hash" text, "name" character varying(100) NOT NULL, "role" "public"."users_role_enum" NOT NULL, "is_active" boolean NOT NULL DEFAULT true, "deactivated_at" TIMESTAMP WITH TIME ZONE, "last_login_at" TIMESTAMP WITH TIME ZONE, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "policies" ADD CONSTRAINT "FK_8694c970c5a4b136191c3675fb6" FOREIGN KEY ("complex_id") REFERENCES "complexes"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "claim_photos" ADD CONSTRAINT "FK_ca1cc5bb2c3dbf15e8dffa36a48" FOREIGN KEY ("claim_id") REFERENCES "claims"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "claim_ai_reasons" ADD CONSTRAINT "FK_c9c8843016a48e726c72f2416d1" FOREIGN KEY ("claim_id") REFERENCES "claims"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "claim_precedents" ADD CONSTRAINT "FK_57d9bbd7231527eed86594e4f66" FOREIGN KEY ("claim_id") REFERENCES "claims"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "claim_events" ADD CONSTRAINT "FK_fc4b5cdff8954c3719def21fc0d" FOREIGN KEY ("claim_id") REFERENCES "claims"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "documents" ADD CONSTRAINT "FK_40513ae476af7e7af0a666dccea" FOREIGN KEY ("claim_id") REFERENCES "claims"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "approvals" ADD CONSTRAINT "FK_7270b1e202b318358f1e8b083f8" FOREIGN KEY ("claim_id") REFERENCES "claims"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "approvals" ADD CONSTRAINT "FK_46de2c8562b94a5fbf9a202346a" FOREIGN KEY ("approver_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "type_a_details" ADD CONSTRAINT "FK_af4d96e430fe215123dbca0ea8c" FOREIGN KEY ("claim_id") REFERENCES "claims"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "type_b_details" ADD CONSTRAINT "FK_419bb3178ebdf194c6cfe694895" FOREIGN KEY ("claim_id") REFERENCES "claims"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "estimation_items" ADD CONSTRAINT "FK_b199bf27e01d20fcdfe0da1fc04" FOREIGN KEY ("estimation_id") REFERENCES "estimations"("claim_id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "estimations" ADD CONSTRAINT "FK_56c6502b0176d141d63fe1dd74e" FOREIGN KEY ("claim_id") REFERENCES "claims"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "claims" ADD CONSTRAINT "FK_74fe616ffa06c155ab39a8ac8e1" FOREIGN KEY ("complex_id") REFERENCES "complexes"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "claims" ADD CONSTRAINT "FK_879ff2d9bdf3ee3db7963b7a25a" FOREIGN KEY ("policy_id") REFERENCES "policies"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "claims" ADD CONSTRAINT "FK_8490bdc93ac2749f5541aa792e4" FOREIGN KEY ("assignee_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "claims" DROP CONSTRAINT "FK_8490bdc93ac2749f5541aa792e4"`);
        await queryRunner.query(`ALTER TABLE "claims" DROP CONSTRAINT "FK_879ff2d9bdf3ee3db7963b7a25a"`);
        await queryRunner.query(`ALTER TABLE "claims" DROP CONSTRAINT "FK_74fe616ffa06c155ab39a8ac8e1"`);
        await queryRunner.query(`ALTER TABLE "estimations" DROP CONSTRAINT "FK_56c6502b0176d141d63fe1dd74e"`);
        await queryRunner.query(`ALTER TABLE "estimation_items" DROP CONSTRAINT "FK_b199bf27e01d20fcdfe0da1fc04"`);
        await queryRunner.query(`ALTER TABLE "type_b_details" DROP CONSTRAINT "FK_419bb3178ebdf194c6cfe694895"`);
        await queryRunner.query(`ALTER TABLE "type_a_details" DROP CONSTRAINT "FK_af4d96e430fe215123dbca0ea8c"`);
        await queryRunner.query(`ALTER TABLE "approvals" DROP CONSTRAINT "FK_46de2c8562b94a5fbf9a202346a"`);
        await queryRunner.query(`ALTER TABLE "approvals" DROP CONSTRAINT "FK_7270b1e202b318358f1e8b083f8"`);
        await queryRunner.query(`ALTER TABLE "documents" DROP CONSTRAINT "FK_40513ae476af7e7af0a666dccea"`);
        await queryRunner.query(`ALTER TABLE "claim_events" DROP CONSTRAINT "FK_fc4b5cdff8954c3719def21fc0d"`);
        await queryRunner.query(`ALTER TABLE "claim_precedents" DROP CONSTRAINT "FK_57d9bbd7231527eed86594e4f66"`);
        await queryRunner.query(`ALTER TABLE "claim_ai_reasons" DROP CONSTRAINT "FK_c9c8843016a48e726c72f2416d1"`);
        await queryRunner.query(`ALTER TABLE "claim_photos" DROP CONSTRAINT "FK_ca1cc5bb2c3dbf15e8dffa36a48"`);
        await queryRunner.query(`ALTER TABLE "policies" DROP CONSTRAINT "FK_8694c970c5a4b136191c3675fb6"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TYPE "public"."users_role_enum"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_a53efeb7a948880f8989006934"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_78214f7ed47cfd76fb8bf6bb28"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_b6354381ae08e4a843acb872dd"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_74fe616ffa06c155ab39a8ac8e"`);
        await queryRunner.query(`DROP TABLE "claims"`);
        await queryRunner.query(`DROP TYPE "public"."claims_status_enum"`);
        await queryRunner.query(`DROP TYPE "public"."claims_type_enum"`);
        await queryRunner.query(`DROP TABLE "estimations"`);
        await queryRunner.query(`DROP TABLE "estimation_items"`);
        await queryRunner.query(`DROP TYPE "public"."estimation_items_standard_src_enum"`);
        await queryRunner.query(`DROP TABLE "type_b_details"`);
        await queryRunner.query(`DROP TABLE "type_a_details"`);
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
        await queryRunner.query(`DROP TABLE "complexes"`);
        await queryRunner.query(`DROP TABLE "policies"`);
        await queryRunner.query(`DROP TYPE "public"."policies_policy_type_enum"`);
    }

}
