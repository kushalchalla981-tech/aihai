"use client";

import { useState } from "react";
import { ScanSearch } from "lucide-react";
import { useScans } from "@/lib/hooks";
import Badge from "@/components/ui/Badge";
import Card from "@/components/ui/Card";
import ScanForm from "@/components/scans/ScanForm";
import ScanList from "@/components/scans/ScanList";
import ScanDetail from "@/components/scans/ScanDetail";
import type { ScanRun } from "@/lib/types";

export default function ScansPage() {
  const { data: scans } = useScans();
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const runningCount = (scans || []).filter(
    (s) => s.status === "queued" || s.status === "running"
  ).length;

  function handleSelect(scan: ScanRun) {
    setSelectedId(scan.id);
  }

  return (
    <>
      <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
        <div className="flex items-center gap-3">
          <h1 className="text-gradient-anim text-[24px] font-semibold">Security Scans</h1>
          <Badge variant={runningCount > 0 ? "warn" : "neutral"} className={runningCount > 0 ? "animate-pulse" : undefined}>
            {runningCount} Running
          </Badge>
        </div>
      </div>

      <Card className="mb-4">
        <h3 className="text-[15px] mb-3 flex items-center gap-2">
          <ScanSearch size={16} className="text-accent" />
          Start a Scan
        </h3>
        <ScanForm onCreated={(scan) => setSelectedId(scan.id)} />
      </Card>

      <div className="grid grid-cols-1 xl:grid-cols-5 gap-4">
        <Card className="xl:col-span-2 overflow-hidden">
          <h3 className="text-[15px] mb-4">Scan History</h3>
          <ScanList selectedId={selectedId} onSelect={handleSelect} />
        </Card>

        <Card className="xl:col-span-3">
          <h3 className="text-[15px] mb-4">Scan Details</h3>
          {selectedId ? (
            <ScanDetail scanId={selectedId} />
          ) : (
            <div className="text-center py-16 text-muted">
              <ScanSearch size={32} className="mx-auto mb-3 opacity-40" />
              <p className="text-sm">Select a scan to view findings</p>
            </div>
          )}
        </Card>
      </div>
    </>
  );
}