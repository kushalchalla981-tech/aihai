"use client";

import { useState, useEffect, useRef } from "react";
import { Pause, Play, Download, TerminalSquare } from "lucide-react";
import { useLogs } from "@/lib/hooks";
import Button from "@/components/ui/Button";
import Select from "@/components/ui/Select";
import LiveBadge from "@/components/shared/LiveBadge";
import LoadingSkeleton from "@/components/shared/LoadingSkeleton";
import type { LogResponse } from "@/lib/types";

function LogLine({ log }: { log: LogResponse }) {
  const [expanded, setExpanded] = useState(false);
  const levelColors: Record<string, string> = {
    ERROR: "text-status-critical", WARN: "text-status-high", INFO: "text-status-medium", DEBUG: "text-text-tertiary",
  };

  return (
    <div className="group border-b border-border-soft last:border-b-0 text-[12px] font-mono cursor-pointer hover:bg-surface-elevated transition-colors">
      <div className="flex gap-4 py-2 px-3" onClick={() => setExpanded((e) => !e)}>
        <span className="text-text-tertiary whitespace-nowrap flex-shrink-0">
          {new Date(log.timestamp).toLocaleTimeString(undefined, { hour12: false, fractionalSecondDigits: 3 })}
        </span>
        <span className={`w-12 flex-shrink-0 ${levelColors[log.level] || "text-text-secondary"}`}>
          {log.level}
        </span>
        <span className="text-text-secondary w-32 truncate flex-shrink-0">{log.service}</span>
        <span className="flex-1 break-words text-text-primary leading-snug">{log.message}</span>
      </div>
      {expanded && (
        <div className="px-3 pb-3">
          <div className="bg-[#050505] p-3 rounded border border-border-soft text-[11px] text-text-secondary whitespace-pre-wrap break-words overflow-x-auto">
            {JSON.stringify({ raw: log.raw_log, template_id: log.template_id, parameters: log.parameters, metadata: log.metadata }, null, 2)}
          </div>
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
  const { data: logs, isLoading } = useLogs({ level: levelFilter || undefined, limit: 100 });

  useEffect(() => {
    if (logs) setCount(logs.length);
  }, [logs]);

  return (
    <div className="flex flex-col h-[calc(100vh-var(--topbar-h)-64px)]">
      <div className="flex items-center justify-between flex-wrap gap-4 border-b border-border-soft pb-4 mb-4 flex-shrink-0">
        <div className="flex items-center gap-3">
          <TerminalSquare size={20} className="text-text-primary" />
          <h1 className="text-[20px] font-semibold text-text-primary tracking-tight">Log Explorer</h1>
          <LiveBadge />
        </div>
        <div className="flex items-center gap-2">
          <Button variant={paused ? "primary" : "secondary"} size="sm" onClick={() => setPaused((p) => !p)}>
            {paused ? <Play size={14} /> : <Pause size={14} />} {paused ? "Resume" : "Pause"}
          </Button>
          <Button variant="secondary" size="sm">
            <Download size={14} /> Export
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-2 flex-wrap mb-4 flex-shrink-0 bg-surface-base border border-border-soft p-2 rounded-lg">
        <Select
          className="w-32"
          options={[
            { value: "", label: "Level: All" },
            { value: "ERROR", label: "ERROR" },
            { value: "WARN", label: "WARN" },
            { value: "INFO", label: "INFO" },
            { value: "DEBUG", label: "DEBUG" },
          ]}
          value={levelFilter}
          onChange={(e) => setLevelFilter(e.target.value)}
        />
        <Select
          className="w-40"
          options={[
            { value: "", label: "Service: All" },
            { value: "api-gw-prod", label: "api-gw-prod" },
            { value: "user-svc", label: "user-svc" },
            { value: "db-primary", label: "db-primary" },
          ]}
        />
        <div className="flex-1" />
        <span className="font-mono text-[11px] text-text-tertiary bg-surface-elevated px-2 py-1 rounded border border-border-soft">
          Showing {count} entries
        </span>
      </div>

      <div className="flex-1 min-h-0 bg-surface-base border border-border-strong rounded-lg overflow-hidden flex flex-col">
        <div className="flex gap-4 py-2 px-3 bg-surface-elevated border-b border-border-strong text-[11px] font-mono text-text-tertiary uppercase tracking-wider flex-shrink-0">
          <span className="w-20">Timestamp</span>
          <span className="w-12">Level</span>
          <span className="w-32">Service</span>
          <span className="flex-1">Message</span>
        </div>
        <div ref={streamRef} className="flex-1 overflow-y-auto">
          {isLoading ? (
            <div className="p-4 space-y-2">
              {Array.from({ length: 15 }).map((_, i) => (
                <LoadingSkeleton key={i} className="h-6 w-full opacity-50" />
              ))}
            </div>
          ) : !logs?.length ? (
            <div className="text-center py-12 text-text-tertiary font-mono text-sm">No log entries found for current filters.</div>
          ) : (
            logs.map((log) => <LogLine key={log.id} log={log} />)
          )}
        </div>
      </div>
    </div>
  );
}
