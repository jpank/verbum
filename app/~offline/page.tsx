export default function OfflinePage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-verbum-950 text-white p-8">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">You are offline</h1>
        <p className="text-verbum-300">
          Verbum works offline once loaded. Please connect to the internet and
          reload to get started.
        </p>
      </div>
    </div>
  );
}
