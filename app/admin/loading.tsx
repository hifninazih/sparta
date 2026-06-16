export default function AdminLoading() {
  return (
    <div className="p-6 sm:p-10 space-y-6 w-full animate-pulse">
      {/* Skeleton Header */}
      <div className="mb-6 flex flex-col items-start justify-between gap-4 sm:mb-8 sm:flex-row sm:items-center sm:gap-6">
        <div className="space-y-3 w-full max-w-md">
          {/* Title */}
          <div className="h-10 w-3/4 rounded-md border-2 border-black bg-slate-200 shadow-[2px_2px_0px_rgba(0,0,0,1)]"></div>
          {/* Description */}
          <div className="h-5 w-full rounded-md bg-slate-200"></div>
          <div className="h-5 w-5/6 rounded-md bg-slate-200"></div>
        </div>
        {/* Button */}
        <div className="h-12 w-40 shrink-0 rounded-md border-2 border-black bg-slate-200 shadow-[2px_2px_0px_rgba(0,0,0,1)]"></div>
      </div>

      {/* Skeleton Toolbar */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 rounded-xl border-2 border-black bg-white p-4 shadow-[4px_4px_0px_rgba(0,0,0,1)]">
        <div className="h-10 w-full sm:w-64 rounded-md border-2 border-black bg-slate-200"></div>
        <div className="h-10 w-32 rounded-md border-2 border-black bg-slate-200"></div>
      </div>

      {/* Skeleton Table / Content Area */}
      <div className="overflow-hidden rounded-xl border-2 border-black bg-white shadow-[8px_8px_0px_rgba(0,0,0,1)]">
        <div className="border-b-2 border-black bg-slate-100 p-4">
          <div className="flex gap-4">
            <div className="h-6 w-1/4 rounded bg-slate-300"></div>
            <div className="h-6 w-1/4 rounded bg-slate-300"></div>
            <div className="h-6 w-1/4 rounded bg-slate-300"></div>
            <div className="h-6 w-1/4 rounded bg-slate-300"></div>
          </div>
        </div>
        <div className="divide-y-2 divide-black/10">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex p-4 gap-4 items-center">
              <div className="space-y-2 w-1/4">
                <div className="h-5 w-3/4 rounded bg-slate-200"></div>
                <div className="h-3 w-1/2 rounded bg-slate-100"></div>
              </div>
              <div className="h-5 w-1/4 rounded bg-slate-200"></div>
              <div className="h-5 w-1/4 rounded bg-slate-200"></div>
              <div className="flex justify-end gap-2 w-1/4">
                <div className="h-8 w-8 rounded border-2 border-black bg-slate-200"></div>
                <div className="h-8 w-8 rounded border-2 border-black bg-slate-200"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
