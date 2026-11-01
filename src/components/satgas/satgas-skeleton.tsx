export function SatgasSkeleton() {
  return (
    <main
      className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6 lg:py-14"
      role="status"
      aria-busy="true"
    >
      <span className="sr-only">Memuat daftar laporan Satgas</span>
      <div className="flex flex-col gap-3 border-b border-border/80 pb-8">
        <div className="h-3 w-36 animate-pulse rounded bg-muted" />
        <div className="h-9 w-80 max-w-full animate-pulse rounded bg-muted" />
        <div className="h-4 w-full max-w-xl animate-pulse rounded bg-muted" />
      </div>
      <div className="mt-6 h-20 animate-pulse border-y border-border/80 bg-muted/20" />
      <div className="mt-8 space-y-3">
        {[1, 2, 3, 4, 5].map((row) => (
          <div
            key={row}
            className="h-20 animate-pulse border-b border-border/60 bg-muted/15"
          />
        ))}
      </div>
    </main>
  );
}
