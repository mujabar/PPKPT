-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('PELAPOR', 'ANGGOTA_SATGAS', 'KETUA_SATGAS', 'PIMPINAN', 'ADMIN');

-- CreateEnum
CREATE TYPE "ReporterRole" AS ENUM ('KORBAN', 'SAKSI', 'PIHAK_LAIN');

-- CreateEnum
CREATE TYPE "ViolenceType" AS ENUM ('FISIK', 'PSIKIS', 'PERUNDUNGAN', 'SEKSUAL', 'DISKRIMINASI_INTOLERANSI', 'KEBIJAKAN_KEKERASAN');

-- CreateEnum
CREATE TYPE "Urgency" AS ENUM ('RENDAH', 'SEDANG', 'TINGGI');

-- CreateEnum
CREATE TYPE "ReportStatus" AS ENUM ('DITERIMA', 'VERIFIKASI', 'PEMERIKSAAN', 'REKOMENDASI', 'KEPUTUSAN', 'PEMULIHAN', 'SELESAI', 'TIDAK_DITINDAKLANJUTI', 'DIALIHKAN');

-- CreateEnum
CREATE TYPE "Affiliation" AS ENUM ('MAHASISWA', 'DOSEN', 'TENDIK', 'PIMPINAN_PT', 'PIHAK_LUAR', 'TIDAK_DIKETAHUI');

-- CreateEnum
CREATE TYPE "SubjectType" AS ENUM ('PELAPOR', 'TERLAPOR', 'SAKSI');

-- CreateEnum
CREATE TYPE "AssignmentRole" AS ENUM ('KETUA_TIM', 'PEMERIKSA', 'PENDAMPING');

-- CreateEnum
CREATE TYPE "SanctionLevel" AS ENUM ('RINGAN', 'SEDANG', 'BERAT');

-- CreateEnum
CREATE TYPE "SupportType" AS ENUM ('KONSELING', 'PENDAMPINGAN_HUKUM', 'LAYANAN_KESEHATAN', 'PELINDUNGAN', 'PEMULIHAN_AKADEMIK');

-- CreateEnum
CREATE TYPE "SupportStatus" AS ENUM ('DIRENCANAKAN', 'BERJALAN', 'SELESAI');

-- CreateEnum
CREATE TYPE "MessageSender" AS ENUM ('PELAPOR', 'SATGAS');

-- CreateEnum
CREATE TYPE "DocumentType" AS ENUM ('BERITA_ACARA', 'REKOMENDASI', 'SK_SANKSI');

-- CreateEnum
CREATE TYPE "NotificationChannel" AS ENUM ('EMAIL', 'WHATSAPP', 'IN_APP');

-- CreateTable
CREATE TABLE "profiles" (
    "id" UUID NOT NULL,
    "fullName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "role" "Role" NOT NULL DEFAULT 'PELAPOR',
    "identityNumber" TEXT,
    "unit" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reports" (
    "id" UUID NOT NULL,
    "ticketCode" TEXT NOT NULL,
    "accessTokenHash" TEXT,
    "reporterId" UUID,
    "isAnonymous" BOOLEAN NOT NULL DEFAULT false,
    "reporterRole" "ReporterRole" NOT NULL,
    "contactEmail" TEXT,
    "contactPhone" TEXT,
    "violenceTypes" "ViolenceType"[],
    "incidentDate" TIMESTAMP(3) NOT NULL,
    "incidentLocation" TEXT NOT NULL,
    "chronology" TEXT NOT NULL,
    "urgency" "Urgency" NOT NULL DEFAULT 'SEDANG',
    "needsProtection" BOOLEAN NOT NULL DEFAULT false,
    "status" "ReportStatus" NOT NULL DEFAULT 'DITERIMA',
    "closedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "reports_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "report_evidences" (
    "id" UUID NOT NULL,
    "reportId" UUID NOT NULL,
    "storagePath" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "sizeBytes" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "report_evidences_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "respondents" (
    "id" UUID NOT NULL,
    "reportId" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "identifier" TEXT,
    "affiliation" "Affiliation" NOT NULL DEFAULT 'TIDAK_DIKETAHUI',
    "description" TEXT,

    CONSTRAINT "respondents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "witnesses" (
    "id" UUID NOT NULL,
    "reportId" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "contact" TEXT,
    "notes" TEXT,

    CONSTRAINT "witnesses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "case_assignments" (
    "id" UUID NOT NULL,
    "reportId" UUID NOT NULL,
    "memberId" UUID NOT NULL,
    "role" "AssignmentRole" NOT NULL,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "case_assignments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "status_history" (
    "id" UUID NOT NULL,
    "reportId" UUID NOT NULL,
    "fromStatus" "ReportStatus",
    "toStatus" "ReportStatus" NOT NULL,
    "note" TEXT,
    "visibleToReporter" BOOLEAN NOT NULL DEFAULT true,
    "changedById" UUID,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "status_history_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "examinations" (
    "id" UUID NOT NULL,
    "reportId" UUID NOT NULL,
    "subjectType" "SubjectType" NOT NULL,
    "subjectName" TEXT NOT NULL,
    "examinerId" UUID NOT NULL,
    "examinedAt" TIMESTAMP(3) NOT NULL,
    "summary" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "examinations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "recommendations" (
    "id" UUID NOT NULL,
    "reportId" UUID NOT NULL,
    "authorId" UUID NOT NULL,
    "findings" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "suggestedSanction" "SanctionLevel",
    "submittedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "recommendations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "decisions" (
    "id" UUID NOT NULL,
    "reportId" UUID NOT NULL,
    "decidedById" UUID NOT NULL,
    "sanctionLevel" "SanctionLevel",
    "sanctionDetail" TEXT,
    "decisionNumber" TEXT,
    "decidedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "decisions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "support_services" (
    "id" UUID NOT NULL,
    "reportId" UUID NOT NULL,
    "type" "SupportType" NOT NULL,
    "status" "SupportStatus" NOT NULL DEFAULT 'DIRENCANAKAN',
    "providerName" TEXT,
    "handledById" UUID,
    "scheduledAt" TIMESTAMP(3),
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "support_services_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "report_messages" (
    "id" UUID NOT NULL,
    "reportId" UUID NOT NULL,
    "senderType" "MessageSender" NOT NULL,
    "senderId" UUID,
    "body" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "report_messages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "generated_documents" (
    "id" UUID NOT NULL,
    "reportId" UUID NOT NULL,
    "type" "DocumentType" NOT NULL,
    "storagePath" TEXT NOT NULL,
    "generatedById" UUID,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "generated_documents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notifications" (
    "id" UUID NOT NULL,
    "userId" UUID,
    "reportId" UUID,
    "channel" "NotificationChannel" NOT NULL,
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "sentAt" TIMESTAMP(3),
    "readAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audit_logs" (
    "id" UUID NOT NULL,
    "actorId" UUID,
    "action" TEXT NOT NULL,
    "entityType" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "ipAddress" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "profiles_email_key" ON "profiles"("email");

-- CreateIndex
CREATE UNIQUE INDEX "reports_ticketCode_key" ON "reports"("ticketCode");

-- CreateIndex
CREATE INDEX "reports_status_idx" ON "reports"("status");

-- CreateIndex
CREATE INDEX "reports_createdAt_idx" ON "reports"("createdAt");

-- CreateIndex
CREATE INDEX "reports_reporterId_idx" ON "reports"("reporterId");

-- CreateIndex
CREATE INDEX "report_evidences_reportId_idx" ON "report_evidences"("reportId");

-- CreateIndex
CREATE INDEX "respondents_reportId_idx" ON "respondents"("reportId");

-- CreateIndex
CREATE INDEX "witnesses_reportId_idx" ON "witnesses"("reportId");

-- CreateIndex
CREATE UNIQUE INDEX "case_assignments_reportId_memberId_key" ON "case_assignments"("reportId", "memberId");

-- CreateIndex
CREATE INDEX "status_history_reportId_createdAt_idx" ON "status_history"("reportId", "createdAt");

-- CreateIndex
CREATE INDEX "examinations_reportId_idx" ON "examinations"("reportId");

-- CreateIndex
CREATE UNIQUE INDEX "recommendations_reportId_key" ON "recommendations"("reportId");

-- CreateIndex
CREATE UNIQUE INDEX "decisions_reportId_key" ON "decisions"("reportId");

-- CreateIndex
CREATE INDEX "support_services_reportId_idx" ON "support_services"("reportId");

-- CreateIndex
CREATE INDEX "report_messages_reportId_createdAt_idx" ON "report_messages"("reportId", "createdAt");

-- CreateIndex
CREATE INDEX "generated_documents_reportId_idx" ON "generated_documents"("reportId");

-- CreateIndex
CREATE INDEX "notifications_userId_readAt_idx" ON "notifications"("userId", "readAt");

-- CreateIndex
CREATE INDEX "audit_logs_entityType_entityId_idx" ON "audit_logs"("entityType", "entityId");

-- CreateIndex
CREATE INDEX "audit_logs_actorId_createdAt_idx" ON "audit_logs"("actorId", "createdAt");

-- AddForeignKey
ALTER TABLE "reports" ADD CONSTRAINT "reports_reporterId_fkey" FOREIGN KEY ("reporterId") REFERENCES "profiles"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "report_evidences" ADD CONSTRAINT "report_evidences_reportId_fkey" FOREIGN KEY ("reportId") REFERENCES "reports"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "respondents" ADD CONSTRAINT "respondents_reportId_fkey" FOREIGN KEY ("reportId") REFERENCES "reports"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "witnesses" ADD CONSTRAINT "witnesses_reportId_fkey" FOREIGN KEY ("reportId") REFERENCES "reports"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "case_assignments" ADD CONSTRAINT "case_assignments_reportId_fkey" FOREIGN KEY ("reportId") REFERENCES "reports"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "case_assignments" ADD CONSTRAINT "case_assignments_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "status_history" ADD CONSTRAINT "status_history_reportId_fkey" FOREIGN KEY ("reportId") REFERENCES "reports"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "status_history" ADD CONSTRAINT "status_history_changedById_fkey" FOREIGN KEY ("changedById") REFERENCES "profiles"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "examinations" ADD CONSTRAINT "examinations_reportId_fkey" FOREIGN KEY ("reportId") REFERENCES "reports"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "examinations" ADD CONSTRAINT "examinations_examinerId_fkey" FOREIGN KEY ("examinerId") REFERENCES "profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recommendations" ADD CONSTRAINT "recommendations_reportId_fkey" FOREIGN KEY ("reportId") REFERENCES "reports"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recommendations" ADD CONSTRAINT "recommendations_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "decisions" ADD CONSTRAINT "decisions_reportId_fkey" FOREIGN KEY ("reportId") REFERENCES "reports"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "decisions" ADD CONSTRAINT "decisions_decidedById_fkey" FOREIGN KEY ("decidedById") REFERENCES "profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "support_services" ADD CONSTRAINT "support_services_reportId_fkey" FOREIGN KEY ("reportId") REFERENCES "reports"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "support_services" ADD CONSTRAINT "support_services_handledById_fkey" FOREIGN KEY ("handledById") REFERENCES "profiles"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "report_messages" ADD CONSTRAINT "report_messages_reportId_fkey" FOREIGN KEY ("reportId") REFERENCES "reports"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "generated_documents" ADD CONSTRAINT "generated_documents_reportId_fkey" FOREIGN KEY ("reportId") REFERENCES "reports"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_userId_fkey" FOREIGN KEY ("userId") REFERENCES "profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_reportId_fkey" FOREIGN KEY ("reportId") REFERENCES "reports"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_actorId_fkey" FOREIGN KEY ("actorId") REFERENCES "profiles"("id") ON DELETE SET NULL ON UPDATE CASCADE;
