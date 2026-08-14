"use client";

import { useState } from "react";
import { Loader2, Shield } from "lucide-react";
import { useCreateScan } from "@/lib/hooks";
import Button from "@/components/ui/Button";
import type { ScanRun } from "@/lib/types";

const ALLOWED_HOSTS = ["github.com", "gitlab.com", "bitbucket.org"];

function validateRepoUrl(value: string): string | null {
  const url = value.trim();
  if (!url) return "Repository URL is required";
  if (url.length > 2048) return "Repository URL is too long";
  if (url.startsWith("-")) return "Repository URL must not start with '-'";

  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return "Enter a valid repository URL";
  }
  if (parsed.protocol !== "https:") return "Repository URL must use https";
  if (parsed.username || parsed.password) return "Repository URL must not contain credentials (@)";

  const host = parsed.hostname.toLowerCase();
  if (host !== host.replace(/\.$/, "")) return "Repository URL host must not end with '.'";
  if (!ALLOWED_HOSTS.includes(host)) {
    return `Host not allowed: ${host || "(none)"}. Allowed: ${ALLOWED_HOSTS.join(", ")}`;
  }

  const path = url.slice(url.indexOf(parsed.host) + parsed.host.length);
  let decodedPath: string;
  try {
    decodedPath = decodeURIComponent(path);
  } catch {
    return "Repository URL path is invalid";
  }
  if (decodedPath.includes("..")) return "Repository URL path must not contain '..'";

  return null;
}

export default function ScanForm({ onCreated }: { onCreated?: (scan: ScanRun) => void }) {
  const [repoUrl, setRepoUrl] = useState("");
  const [fieldError, setFieldError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const createScan = useCreateScan();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitError(null);
    const err = validateRepoUrl(repoUrl);
    if (err) {
      setFieldError(err);
      return;
    }
    createScan.mutate(
      { repo_url: repoUrl.trim() },
      {
        onSuccess: (scan) => {
          setRepoUrl("");
          setFieldError(null);
          onCreated?.(scan);
        },
        onError: (err) => {
          setSubmitError(err instanceof Error ? err.message : "Failed to start scan");
        },
      }
    );
  }

  const inputClasses = [
    "w-full py-[9px] px-4 border rounded-[10px] bg-white/50 text-[13px] text-[var(--fg)]",
    "outline-none transition-[border-color,box-shadow] duration-[180ms] font-mono",
    "focus:border-accent focus:shadow-[0_0_0_3px_var(--accent-soft)]",
    fieldError
      ? "border-danger focus:border-danger focus:shadow-[0_0_0_3px_rgba(239,68,68,0.15)]"
      : "border-[var(--border)]",
  ].join(" ");

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-3">
      <div className="flex items-center gap-2 text-[13px] text-muted">
        <Shield size={16} className="flex-shrink-0" />
        <span>Scan a repository for secrets, code, and configuration issues.</span>
      </div>

      <div className="flex flex-col sm:flex-row gap-[10px]">
        <input
          type="url"
          value={repoUrl}
          onChange={(e) => {
            setRepoUrl(e.target.value);
            setFieldError(null);
          }}
          placeholder="https://github.com/org/repo"
          aria-label="Repository URL"
          className={inputClasses}
        />
        <Button
          type="submit"
          variant="primary"
          disabled={createScan.isPending}
          className="flex-shrink-0"
        >
          {createScan.isPending ? <Loader2 size={14} className="animate-spin" /> : <Shield size={14} />}
          {createScan.isPending ? "Scanning..." : "Start Scan"}
        </Button>
      </div>

      {fieldError && (
        <p className="text-[12px] text-danger" role="alert">
          {fieldError}
        </p>
      )}
      {submitError && (
        <p className="text-[12px] text-danger" role="alert">
          {submitError}
        </p>
      )}
    </form>
  );
}
