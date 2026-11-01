-- Query dashboard Satgas memfilter penugasan berdasarkan memberId.
create index if not exists "case_assignments_memberId_idx"
  on "case_assignments" ("memberId");
