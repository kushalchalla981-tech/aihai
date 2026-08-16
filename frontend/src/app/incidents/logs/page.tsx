"use client";

import { useState, useEffect, useRef } from "react";
import { Pause, Play, Download } from "lucide-react";
import { useLogs } from "@/lib/hooks";
import Button from "@/components/ui/Button";
import Select from "@/components/ui/Select";
import Card from "@/components/ui/Card";
import LiveBadge from "@/components/shared/LiveBadge";
import LoadingSkeleton from "@/components/shared/LoadingSkeleton";
import type { LogResponse } from "@/lib/types";

function LogLine({ log }: { log: LogResponse }) {
  const [expanded, setExpanded] = useState(false);
  const levelColors: Record<string, string> = {
    ERROR: "text-danger", WARN: "text-warn", INFO: "text-accent", DEBUG: "text-muted",
  };

  return (
    <div
      className={`border-b border-[var(--border-soft)] text-[13px] font-mono cursor-pointer transition-all duration-[180ms] ${
        expanded ? "bg-[var(--accent-soft)] -mx-3 px-3 py-[10px] rounded-[10px]" : "py-[10px]"
      } hover:bg-[var(--accent-soft)] hover:-mx-3 hover:px-3 hover:py-[10px] hover:rounded-[10px]`}
      onClick={() => setExpanded((e) => !e)}
    >
      <div className="flex items-center gap-4 min-w-0">
        <span className="text-muted whitespace-nowrap">
          {new Date(log.timestamp).toLocaleTimeString()}
        </span>
        <span className={`font-semibold text-[11px] uppercase tracking-wide ${levelColors[log.level] || ""}`}>
          {log.level}
        </span>
        <span className="text-muted text-[12px]">{log.service}</span>
        <span className="flex-1 truncate text-[var(--fg)]">{log.message}</span>
      </div>
      {expanded && (
        <div className="mt-2 px-3 py-2 bg-[var(--fg-soft)] rounded-[10px] text-[12px] text-[var(--fg-2)] whitespace-pre-wrap font-mono">
          {JSON.stringify({ raw: log.raw_log, template_id: log.template_id, parameters: log.parameters }, null, 2)}
        </div>
      )}
    </div>
  );
}

export default function LogsPage() {
  const [paused, setPaused] = useState(false);
  const [levelFilter, setLevelFilter] = useState("");
  const [count, setCount] = useState(0);
  const streamRef = useRef<HTMLDivElement>(null);
  const { data: logs, isLoading } = useLogs({ level: levelFilter || undefined, limit: 50 });

  useEffect(() => {
    if (logs) setCount(logs.length);
  }, [logs]);

  return (
    <>
      <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
        <div className="flex items-center gap-3">
          <h1 className="text-gradient-anim text-[24px] font-semibold">Log Stream</h1>
          <LiveBadge />
        </div>
        <div className="flex items-center gap-[10px]">
          <Button
            variant={paused ? "primary" : "secondary"}
            size="sm"
            onClick={() => setPaused((p) => !p)}
          >
            {paused ? <Play size={14} /> : <Pause size={14} />}
            {paused ? "Resume" : "Pause"}
          </Button>
          <Button variant="primary" size="sm">
            <Download size={14} /> Export
          </Button>
        </div>
      </div>

      <div className="flex h-1 mb-5 rounded overflow-hidden gap-[2px]">
        {Array.from({ length: 18 }).map((_, i) => {
          const colors = ["bg-danger", "bg-danger", "bg-warn", "bg-accent", "bg-accent", "bg-danger", "bg-warn", "bg-accent", "bg-muted", "bg-accent", "bg-warn", "bg-danger", "bg-accent", "bg-muted", "bg-accent", "bg-danger", "bg-warn", "bg-accent"];
          return <div key={i} className={`${colors[i % colors.length]} flex-1 rounded`} />;
        })}
      </div>

      <div className="flex items-center gap-[10px] flex-wrap mb-5">
        <Select
          options={[
            { value: "", label: "All Levels" },
            { value: "ERROR", label: "ERROR" },
            { value: "WARN", label: "WARN" },
            { value: "INFO", label: "INFO" },
            { value: "DEBUG", label: "DEBUG" },
          ]}
          value={levelFilter}
          onChange={(e) => setLevelFilter(e.target.value)}
        />
        <Select
          options={[
            { value: "", label: "All Services" },
            { value: "api-gw-prod", label: "api-gw-prod" },
            { value: "user-svc", label: "user-svc" },
            { value: "db-primary", label: "db-primary" },
            { value: "billing-svc", label: "billing-svc" },
          ]}
        />
        <Select
          options={[
            { value: "1h", label: "Last hour" },
            { value: "6h", label: "Last 6 hours" },
            { value: "24h", label: "Last 24 hours" },
          ]}
        />
        <div className="flex-1" />
        <span className="font-mono text-[12px] text-muted">~{count} entries</span>
      </div>

      <Card className="p-4">
        <div ref={streamRef} className="max-h-[65vh] overflow-y-auto">
          {isLoading ? (
            Array.from({ length: 10 }).map((_, i) => (
              <LoadingSkeleton key={i} className="h-10 w-full mb-2" />
            ))
          ) : !logs?.length ? (
            <div className="text-center py-12 text-muted text-sm">No log entries found</div>
          ) : (
            logs.map((log) => <LogLine key={log.id} log={log} />)
          )}
        </div>
      </Card>
    </>
  );
}
