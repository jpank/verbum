export default function OfflinePage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-bg text-t-primary p-8">
      <div className="bg-surface rounded-2xl border border-border p-8 text-center shadow-sm max-w-sm">
        <h1 className="text-2xl font-bold text-t-primary mb-4">You are offline</h1>
        <p className="text-t-secondary">
          Verbum works offline once loaded. Please connect to the internet and
          reload to get started.
        </p>
      </div>
    </div>
  );
}
