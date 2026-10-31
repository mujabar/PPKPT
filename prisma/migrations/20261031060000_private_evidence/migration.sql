-- Evidence access uses authenticated server actions and short-lived signed URLs.
-- No direct Data API access is permitted; Prisma checks the current profile.
alter table public.report_evidences enable row level security;
revoke all on public.report_evidences from anon, authenticated;
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('report-evidence', 'report-evidence', false, 5242880, array['image/jpeg','image/png','image/webp'])
on conflict (id) do update set public = false, file_size_limit = 5242880,
allowed_mime_types = excluded.allowed_mime_types;
-- Restrictive policy also blocks access if another permissive policy exists.
create policy evidence_server_only on storage.objects as restrictive
for all to anon, authenticated
using (bucket_id <> 'report-evidence')
with check (bucket_id <> 'report-evidence');
