import { Loader2 } from "lucide-react";

export default function AdminLoading() {
  return (
    <div className="flex h-[calc(100vh-4rem)] w-full flex-col items-center justify-center space-y-4">
      <Loader2 className="h-12 w-12 animate-spin text-primary" />
      <p className="text-lg font-bold text-slate-500 animate-pulse">Memuat halaman...</p>
    </div>
  );
}
