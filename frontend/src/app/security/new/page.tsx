"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { GitBranch, Globe, FileArchive, ArrowRight, Loader2 } from "lucide-react";
import clsx from "clsx";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import { useCreateSecurityScan, useCreateSecurityScanZip } from "@/lib/hooks";

const inputCls =
  "w-full px-4 py-[10px] border border-[var(--border)] rounded-[10px] bg-white/50 text-[13px] text-[var(--fg)] outline-none transition-[border-color,box-shadow] duration-[180ms] focus:border-accent focus:shadow-[0_0_0_3px_var(--accent-soft)]";

type Tab = "repo" | "url" | "zip";

const tabs: { id: Tab; label: string; icon: typeof GitBranch; hint: string }[] = [
  { id: "repo", label: "Repository", icon: GitBranch, hint: "Public GitHub, GitLab, or Bitbucket repo" },
  { id: "url", label: "Live Application", icon: Globe, hint: "HTTPS endpoint, non-destructive checks only" },
  { id: "zip", label: "Zip Upload", icon: FileArchive, hint: "Upload your source code as a .zip" },
];

export default function NewSecurityScanPage() {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("repo");
  const [repoUrl, setRepoUrl] = useState("");
  const [url, setUrl] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const createRepo = useCreateSecurityScan();
  const createZip = useCreateSecurityScanZip();
  const busy = createRepo.isPending || createZip.isPending;

  const llmEnabled = typeof window !== "undefined"
    ? (window.localStorage.getItem("security-llm") ?? "true") === "true"
    : true;

  function run(target: { source_type: Tab; source_ref: string }) {
    setError(null);
    if (target.source_type === "zip") {
      const file = fileRef.current?.files?.[0];
      if (!file) {
        setError("Choose a .zip file first.");
        return;
      }
      createZip.mutate(
        { file, name: name || undefined },
        {
          onSuccess: (scan) => router.push(`/security/scans/${scan.id}`),
          onError: (e) => setError(e instanceof Error ? e.message : "Upload failed"),
        }
      );
      return;
    }
    createRepo.mutate(
      {
        source_type: target.source_type,
        source_ref: target.source_ref,
        name: name || undefined,
        options: { llm_review: llmEnabled },
      },
      {
        onSuccess: (scan) => router.push(`/security/scans/${scan.id}`),
        onError: (e) => setError(e instanceof Error ? e.message : "Scan failed to start"),
      }
    );
  }

  function submit() {
    if (tab === "repo") run({ source_type: "repo", source_ref: repoUrl });
    else if (tab === "url") run({ source_type: "url", source_ref: url });
    else run({ source_type: "zip", source_ref: "" });
  }

  const canSubmit = tab === "repo" ? repoUrl.trim().length > 0 : tab === "url" ? url.trim().length > 0 : true;

  return (
    <>
      <div className="flex items-center gap-3 mb-6">
        <h1 className="text-gradient-anim text-[24px] font-semibold">New Scan</h1>
        <Badge variant="info">Vibe-coded security analysis</Badge>
      </div>

      <Card className="max-w-[680px]">
        <div className="flex gap-2 mb-6">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={clsx(
                "flex-1 flex items-center justify-center gap-2 px-3 py-[9px] rounded-[12px] text-[13px] font-medium border transition-colors duration-[180ms]",
                tab === t.id
                  ? "bg-[var(--accent-soft)] text-accent border-[var(--accent)]"
                  : "border-[var(--border)] text-muted hover:text-[var(--fg-2)] hover:bg-[var(--fg-soft)]"
              )}
            >
              <t.icon size={15} />
              {t.label}
            </button>
          ))}
        </div>

        {error && (
          <div className="mb-4 px-4 py-3 rounded-[10px] bg-red-50 border border-red-200 text-[13px] text-danger">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-[12px] font-medium text-[var(--fg-2)] mb-1">
              {tabs.find((t) => t.id === tab)?.hint}
            </label>
            {tab === "repo" && (
              <input
                className={inputCls}
                placeholder="https://github.com/owner/repo"
                value={repoUrl}
                onChange={(e) => setRepoUrl(e.target.value)}
                disabled={busy}
              />
            )}
            {tab === "url" && (
              <input
                className={inputCls}
                placeholder="https://example.com"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                disabled={busy}
              />
            )}
            {tab === "zip" && (
              <input
                ref={fileRef}
                type="file"
                accept=".zip"
                className={clsx(inputCls, "file:mr-3 file:px-3 file:py-1 file:rounded-[8px] file:border-0 file:bg-[var(--accent-soft)] file:text-accent file:text-[12px] file:font-medium")}
                disabled={busy}
              />
            )}
          </div>

          <div>
            <label className="block text-[12px] font-medium text-[var(--fg-2)] mb-1">Project name (optional)</label>
            <input
              className={inputCls}
              placeholder="e.g. payments-service"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={busy}
            />
          </div>

          <div className="flex items-center justify-between pt-2">
            <p className="text-[11px] text-muted">
              Scans run in the background — you&apos;ll get a scored report with fix-first findings.
            </p>
            <Button variant="primary" size="md" onClick={submit} disabled={!canSubmit || busy}>
              {busy ? <><Loader2 size={15} className="animate-spin" /> Starting…</> : <>Start Scan <ArrowRight size={15} /></>}
            </Button>
          </div>
        </div>
      </Card>
    </>
  );
}