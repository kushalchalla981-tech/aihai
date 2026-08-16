"use client";

import { useRouter } from "next/navigation";
import { History, ScanSearch } from "lucide-react";
import { useSecurityScans } from "@/lib/hooks";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import LoadingSkeleton from "@/components/shared/LoadingSkeleton";

const statusVariant: Record<string, "warn" | "success" | "danger" | "neutral"> = {
  queued: "warn", running: "warn", completed: "success", failed: "danger",
};

const gradeColor: Record<string, string> = {
  A: "text-success", B: "text-accent", C: "text-warn", D: "text-warn", F: "text-danger",
};

export default function SecurityHistoryPage() {
  const router = useRouter();
  const { data: scans, isLoading } = useSecurityScans();
  const sorted = [...(scans ?? [])].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  return (
    <>
      <div className="flex items-center gap-3 mb-6">
        <h1 className="text-gradient-anim text-[24px] font-semibold">Scan History</h1>
        <Badge variant="neutral">{sorted.length} total</Badge>
      </div>

      <Card className="overflow-hidden">
        {isLoading ? (
          <div className="p-4 space-y-3">
            {Array.from({ length: 6 }).map((_, i) => <LoadingSkeleton key={i} className="h-14 w-full" />)}
          </div>
        ) : sorted.length === 0 ? (
          <div className="text-center py-16 text-muted">
            <History size={32} className="mx-auto mb-3 opacity-40" />
            <p className="text-sm">No scans have been run yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-[11px] text-muted uppercase font-mono tracking-wide border-b border-[var(--border-soft)]">
                  <th className="py-3 px-4">Scan</th>
                  <th className="py-3 px-4">Source</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Files</th>
                  <th className="py-3 px-4">Findings</th>
                  <th className="py-3 px-4">Score</th>
                  <th className="py-3 px-4">Started</th>
                </tr>
              </thead>
              <tbody>
                {sorted.map((s) => (
                  <tr
                    key={s.id}
                    onClick={() => router.push(`/security/scans/${s.id}`)}
                    className="border-b border-[var(--border-soft)] last:border-b-0 hover:bg-[var(--fg-soft)] cursor-pointer transition-colors"
                  >
                    <td className="py-3 px-4">
                      <div className="text-[13px] font-medium truncate max-w-[240px]">{s.name || s.source_ref || s.repo_url}</div>
                      <div className="text-[11px] text-muted font-mono mt-[2px]">{s.id}</div>
                    </td>
                    <td className="py-3 px-4"><Badge variant="neutral">{s.source_type}</Badge></td>
                    <td className="py-3 px-4"><Badge variant={statusVariant[s.status] || "neutral"}>{s.status}</Badge></td>
                    <td className="py-3 px-4 text-[13px] font-mono">{s.total_files}</td>
                    <td className="py-3 px-4 text-[13px] font-mono">{s.finding_count}</td>
                    <td className="py-3 px-4">
                      {s.score !== null ? (
                        <span className={`font-mono text-[14px] font-bold ${gradeColor[s.grade ?? "F"]}`}>{s.score}</span>
                      ) : (
                        <span className="text-muted text-[12px]">—</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-[12px] text-muted">{new Date(s.created_at).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {sorted.length > 0 && (
        <div className="flex justify-center mt-6 text-muted">
          <ScanSearch size={18} className="opacity-50" />
        </div>
      )}
    </>
  );
}