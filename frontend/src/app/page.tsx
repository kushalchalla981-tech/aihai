import Link from "next/link";
import { AlertTriangle, ShieldCheck, ArrowRight, ScanSearch, MessageSquareText } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-[calc(100vh-var(--topbar-h))] flex flex-col justify-center py-16">
      <div className="max-w-[880px] mx-auto text-center px-6">
        <div className="inline-flex items-center gap-2 px-4 py-[6px] rounded-[9999px] bg-blue-100 border border-blue-200 text-[#4f8cff] text-[12px] font-medium mb-6">
          <span className="w-2 h-2 rounded-full bg-success animate-live-pulse" />
          AI Copilot for small engineering teams
        </div>

        <h1 className="text-[clamp(38px,5.5vw,62px)] font-semibold leading-[1.05] tracking-[-0.03em] mb-4 text-[var(--fg)]">
          One platform, <span className="text-gradient-anim">two superpowers.</span>
        </h1>

        <p className="text-[17px] text-[var(--fg-2)] max-w-[560px] mx-auto mb-12">
          Respond to production incidents with an AI copilot — and vibe-check your code for security holes before they become incidents.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-[760px] mx-auto">
          <Link href="/incidents/dashboard" className="group block">
            <div className="glass glass-shine border-glow-hover p-8 text-left h-full transition-transform duration-[240ms] group-hover:-translate-y-1">
              <div className="w-14 h-14 rounded-[28px] bg-[#4f8cff]/15 grid place-items-center mb-6">
                <AlertTriangle size={26} className="text-[#4f8cff]" />
              </div>
              <div className="flex items-center gap-2 mb-2">
                <h2 className="text-[22px] font-semibold">Incident Manager</h2>
              </div>
              <p className="text-[13px] text-muted mb-6">
                Guided incident response with a step-by-step AI copilot: create, investigate, resolve, and postmortem — your on-call co-pilot.
              </p>
              <ul className="space-y-2 mb-8 text-[13px] text-[var(--fg-2)]">
                <li className="flex items-center gap-2"><MessageSquareText size={14} className="text-[#4f8cff]" /> Interactive investigation wizard</li>
                <li className="flex items-center gap-2"><ScanSearch size={14} className="text-[#4f8cff]" /> Semantic log search & anomaly detection</li>
                <li className="flex items-center gap-2"><ArrowRight size={14} className="text-[#4f8cff]" /> AI-assisted root cause & postmortems</li>
              </ul>
              <span className="inline-flex items-center gap-2 text-[14px] font-semibold text-[#4f8cff]">
                Open Incident Manager <ArrowRight size={15} className="transition-transform duration-[240ms] group-hover:translate-x-1" />
              </span>
            </div>
          </Link>

          <Link href="/security" className="group block">
            <div className="glass glass-shine border-glow-hover p-8 text-left h-full transition-transform duration-[240ms] group-hover:-translate-y-1">
              <div className="w-14 h-14 rounded-[28px] bg-[#8b5cf6]/15 grid place-items-center mb-6">
                <ShieldCheck size={26} className="text-[#8b5cf6]" />
              </div>
              <h2 className="text-[22px] font-semibold mb-2">Security Checker</h2>
              <p className="text-[13px] text-muted mb-6">
                Vibe-coded security analysis for public repos, live applications, and zip uploads — scored reports with fix-first findings.
              </p>
              <ul className="space-y-2 mb-8 text-[13px] text-[var(--fg-2)]">
                <li className="flex items-center gap-2"><ScanSearch size={14} className="text-[#8b5cf6]" /> Scan repos, live URLs & zip bundles</li>
                <li className="flex items-center gap-2"><ShieldCheck size={14} className="text-[#8b5cf6]" /> 20+ rules, dependency CVEs, LLM review</li>
                <li className="flex items-center gap-2"><ArrowRight size={14} className="text-[#8b5cf6]" /> 0-100 score, A-F grade, re-scan comparisons</li>
              </ul>
              <span className="inline-flex items-center gap-2 text-[14px] font-semibold text-[#8b5cf6]">
                Open Security Checker <ArrowRight size={15} className="transition-transform duration-[240ms] group-hover:translate-x-1" />
              </span>
            </div>
          </Link>
        </div>

        <div className="mt-12 flex items-center justify-center gap-8 flex-wrap text-[12px] text-muted">
          <span>Incidents auto-resolved faster</span>
          <span className="w-1 h-1 rounded-full bg-[var(--border)]" />
          <span>Findings auto-create incidents</span>
          <span className="w-1 h-1 rounded-full bg-[var(--border)]" />
          <span>Self-hosted, no cloud lock-in</span>
        </div>
      </div>
    </div>
  );
}