-- ============================================================
-- RLS untuk schema public (Supabase Data API defense-in-depth)
--
-- Aplikasi mengakses database lewat Prisma dengan role postgres
-- (server-side), sehingga guard otorisasi tetap dilakukan di server.
-- Migrasi ini memastikan role `anon`/`authenticated` tidak bisa
-- membaca/mengubah data lewat Supabase Data API.
--
-- Hanya profiles yang punya policy (SELECT milik sendiri).
-- Tabel lain sengaja tanpa policy = akses ditolak untuk client.
-- Tidak ada policy UPDATE/INSERT/DELETE pada profiles, sehingga
-- pengguna tidak dapat mengubah peran atau data profil via API.
-- ============================================================

alter table "profiles" enable row level security;
alter table "reports" enable row level security;
alter table "report_evidences" enable row level security;
alter table "respondents" enable row level security;
alter table "witnesses" enable row level security;
alter table "case_assignments" enable row level security;
alter table "status_history" enable row level security;
alter table "examinations" enable row level security;
alter table "recommendations" enable row level security;
alter table "decisions" enable row level security;
alter table "support_services" enable row level security;
alter table "report_messages" enable row level security;
alter table "generated_documents" enable row level security;
alter table "notifications" enable row level security;
alter table "audit_logs" enable row level security;

-- Pengguna terautentikasi hanya boleh membaca profilnya sendiri.
create policy "profiles_select_own"
  on "profiles"
  for select
  to authenticated
  using ((select auth.uid()) = id);
