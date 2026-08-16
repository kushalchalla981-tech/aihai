import Link from "next/link";
import { AlertTriangle, ShieldCheck, ArrowRight, ScanSearch, MessageSquareText, Terminal, Activity } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center py-16 px-6 relative bg-page-bg">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.03)_0%,transparent_50%)] pointer-events-none" />

      <div className="w-full max-w-[900px] z-10">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-surface-elevated border border-border-strong text-text-secondary text-[11px] font-mono uppercase tracking-widest mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-status-success" />
            System Online
          </div>
          <h1 className="text-[32px] md:text-[42px] font-semibold tracking-tight text-text-primary mb-4 leading-tight">
            Developer tooling for <br className="hidden sm:block" />
            <span className="text-text-secondary">incidents and security.</span>
          </h1>
          <p className="text-[14px] text-text-secondary max-w-[500px] mx-auto">
            Select a workspace to continue.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link href="/incidents/dashboard" className="group block focus:outline-none">
            <div className="h-full p-6 md:p-8 rounded-xl bg-surface-base border border-border-soft transition-colors duration-150 hover:border-border-strong hover:bg-surface-elevated">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-lg bg-[#3b82f6]/10 border border-[#3b82f6]/20 flex items-center justify-center">
                  <AlertTriangle size={20} className="text-[#3b82f6]" />
                </div>
                <div>
                  <h2 className="text-[16px] font-semibold text-text-primary">Incident Manager</h2>
                  <div className="text-[12px] font-mono text-text-secondary mt-0.5">OPS-100</div>
                </div>
              </div>

              <div className="space-y-4 mb-8">
                <p className="text-[13px] text-text-secondary leading-relaxed">
                  Monitor system health, stream application logs, and resolve production incidents with an interactive copilot.
                </p>
                <div className="grid grid-cols-2 gap-3 text-[12px] text-text-secondary font-mono">
                  <div className="flex items-center gap-2"><Activity size={14} className="text-text-tertiary" /> Anomalies</div>
                  <div className="flex items-center gap-2"><Terminal size={14} className="text-text-tertiary" /> Logs</div>
                  <div className="flex items-center gap-2"><MessageSquareText size={14} className="text-text-tertiary" /> Root Cause</div>
                  <div className="flex items-center gap-2"><AlertTriangle size={14} className="text-text-tertiary" /> Alerts</div>
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-border-soft pt-4 text-[13px] font-medium text-[#3b82f6]">
                <span>Open Workspace</span>
                <ArrowRight size={14} className="transition-transform duration-200 group-hover:translate-x-1" />
              </div>
            </div>
          </Link>

          <Link href="/security" className="group block focus:outline-none">
            <div className="h-full p-6 md:p-8 rounded-xl bg-surface-base border border-border-soft transition-colors duration-150 hover:border-border-strong hover:bg-surface-elevated">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-lg bg-[#8b5cf6]/10 border border-[#8b5cf6]/20 flex items-center justify-center">
                  <ShieldCheck size={20} className="text-[#8b5cf6]" />
                </div>
                <div>
                  <h2 className="text-[16px] font-semibold text-text-primary">Security Checker</h2>
                  <div className="text-[12px] font-mono text-text-secondary mt-0.5">SEC-200</div>
                </div>
              </div>

              <div className="space-y-4 mb-8">
                <p className="text-[13px] text-text-secondary leading-relaxed">
                  Analyze repositories, zip archives, and live applications for vulnerabilities, secrets, and misconfigurations.
                </p>
                <div className="grid grid-cols-2 gap-3 text-[12px] text-text-secondary font-mono">
                  <div className="flex items-center gap-2"><ScanSearch size={14} className="text-text-tertiary" /> SAST</div>
                  <div className="flex items-center gap-2"><ShieldCheck size={14} className="text-text-tertiary" /> DAST</div>
                  <div className="flex items-center gap-2"><Terminal size={14} className="text-text-tertiary" /> Evidence</div>
                  <div className="flex items-center gap-2"><MessageSquareText size={14} className="text-text-tertiary" /> LLM Review</div>
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-border-soft pt-4 text-[13px] font-medium text-[#8b5cf6]">
                <span>Open Workspace</span>
                <ArrowRight size={14} className="transition-transform duration-200 group-hover:translate-x-1" />
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
