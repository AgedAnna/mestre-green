export default function Loading() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-10 flex flex-col gap-6 animate-pulse">
      <div className="h-4 w-24 rounded bg-gray-200" />
      <div className="flex flex-col gap-3">
        <div className="h-10 w-full rounded bg-gray-200" />
        <div className="h-10 w-2/3 rounded bg-gray-200" />
      </div>
      <div className="flex flex-col gap-2">
        <div className="h-6 w-full rounded bg-gray-200" />
        <div className="h-6 w-3/4 rounded bg-gray-200" />
      </div>
      <div className="w-full aspect-video rounded-xl bg-gray-200 mt-2" />
      <div className="rounded-xl bg-gray-50 border border-gray-100 p-8 flex flex-col gap-4">
        <div className="h-5 w-full rounded bg-gray-200" />
        <div className="h-5 w-full rounded bg-gray-200" />
        <div className="h-5 w-5/6 rounded bg-gray-200" />
        <div className="h-5 w-full rounded bg-gray-200" />
        <div className="h-5 w-2/3 rounded bg-gray-200" />
      </div>
    </div>
  );
}
