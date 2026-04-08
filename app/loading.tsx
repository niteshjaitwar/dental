import { clinicConfig } from "@/lib/config";

export default function Loading() {
  return (
    <div className="section-shell flex min-h-[60vh] items-center justify-center py-20">
      <div className="glass-card rounded-full px-6 py-4 text-sm font-medium">
        {clinicConfig.ui.loadingMessage}
      </div>
    </div>
  );
}
