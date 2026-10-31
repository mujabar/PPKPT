-- Idempotensi pengiriman formulir laporan.
-- Kolom nullable + unique: retry submission yang sama tidak membuat laporan ganda.
alter table "reports"
  add column if not exists "clientSubmissionId" uuid;

create unique index if not exists "reports_clientSubmissionId_key"
  on "reports" ("clientSubmissionId");
