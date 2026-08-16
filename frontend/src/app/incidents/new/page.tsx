"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  AlertTriangle, MessageSquareText, SearchCheck, ArrowRight, ArrowLeft,
  CheckCircle2, ScrollText, Sparkles, Activity,
} from "lucide-react";
import clsx from "clsx";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import { createIncident } from "@/lib/api";

const steps = [
  { id: 1, label: "What's happening", icon: AlertTriangle },
  { id: 2, label: "Investigate", icon: SearchCheck },
  { id: 3, label: "Root cause", icon: Activity },
  { id: 4, label: "Review & create", icon: CheckCircle2 },
];

const inputCls =
  "w-full px-4 py-[10px] border border-[var(--border)] rounded-[10px] bg-white/50 text-[13px] text-[var(--fg)] outline-none transition-[border-color,box-shadow] duration-[180ms] focus:border-accent focus:shadow-[0_0_0_3px_var(--accent-soft)]";

export default function NewIncidentPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    title: "",
    service: "",
    severity: "high",
    start_time: new Date().toISOString().slice(0, 16),
    description: "",
    root_cause: "",
    resolution: "",
  });

  const set = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  async function handleCreate() {
    setCreating(true);
    setError(null);
    try {
      const incident = await createIncident({
        title: form.title,
        severity: form.severity,
        start_time: new Date(form.start_time).toISOString(),
        description: form.description || undefined,
        affected_services: form.service ? [form.service] : undefined,
        metadata: { root_cause_hint: form.root_cause || undefined, resolution_hint: form.resolution || undefined },
      });
      router.push(`/incidents/${incident.id}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to create incident");
      setCreating(false);
    }
  }

  const canNext =
    step === 1 ? form.title.trim().length > 0 : true;

  return (
    <>
      <div className="flex items-center gap-3 mb-6">
        <h1 className="text-gradient-anim text-[24px] font-semibold">New Incident</h1>
        <Badge variant="info">Guided by the copilot</Badge>
      </div>

      <div className="flex items-center gap-2 mb-8 max-w-[760px]">
        {steps.map((s, i) => (
          <div key={s.id} className="flex items-center gap-2 flex-1">
            <button
              onClick={() => s.id < step && setStep(s.id)}
              className={clsx(
                "flex items-center gap-2 px-3 py-[6px] rounded-[10px] text-[12px] font-medium transition-colors duration-[180ms]",
                step === s.id
                  ? "bg-[var(--accent-soft)] text-accent"
                  : step > s.id
                    ? "text-success"
                    : "text-muted hover:bg-[var(--fg-soft)]"
              )}
            >
              <s.icon size={14} />
              <span className="hidden sm:inline">{s.label}</span>
            </button>
            {i < steps.length - 1 && <div className="flex-1 h-px bg-[var(--border)]" />}
          </div>
        ))}
      </div>

      {error && (
        <div className="mb-4 px-4 py-3 rounded-[10px] bg-red-50 border border-red-200 text-[13px] text-danger">
          {error}
        </div>
      )}

      {step === 1 && (
        <Card className="max-w-[760px]">
          <h3 className="text-[16px] font-semibold mb-1 flex items-center gap-2">
            <AlertTriangle size={16} className="text-accent" />
            What happened?
          </h3>
          <p className="text-[12px] text-muted mb-5">Tell the copilot what&apos;s breaking so it can guide the investigation.</p>
          <div className="space-y-4">
            <div>
              <label className="block text-[12px] font-medium text-[var(--fg-2)] mb-1">Incident title *</label>
              <input className={inputCls} placeholder="e.g. API gateway timeouts in production" value={form.title} onChange={set("title")} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-[12px] font-medium text-[var(--fg-2)] mb-1">Affected service</label>
                <input className={inputCls} placeholder="e.g. api-gateway" value={form.service} onChange={set("service")} />
              </div>
              <div>
                <label className="block text-[12px] font-medium text-[var(--fg-2)] mb-1">Severity</label>
                <select className={inputCls} value={form.severity} onChange={set("severity")}>
                  <option value="critical">Critical</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>
              <div>
                <label className="block text-[12px] font-medium text-[var(--fg-2)] mb-1">Started at</label>
                <input type="datetime-local" className={inputCls} value={form.start_time} onChange={set("start_time")} />
              </div>
            </div>
            <div>
              <label className="block text-[12px] font-medium text-[var(--fg-2)] mb-1">Description</label>
              <textarea rows={4} className={inputCls} placeholder="What did you observe? Error rates, symptoms, user impact…" value={form.description} onChange={set("description")} />
            </div>
          </div>
        </Card>
      )}

      {step === 2 && (
        <Card className="max-w-[760px]">
          <h3 className="text-[16px] font-semibold mb-1 flex items-center gap-2">
            <SearchCheck size={16} className="text-accent" />
            Investigation workspace
          </h3>
          <p className="text-[12px] text-muted mb-5">Jump straight to the tools the copilot suggests for this incident.</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <a href="/incidents/logs" className="group">
              <div className="glass p-5 h-full transition-transform duration-[200ms] group-hover:-translate-y-0.5">
                <ScrollText size={20} className="text-accent mb-3" />
                <div className="text-[14px] font-semibold mb-1">Log Explorer</div>
                <p className="text-[12px] text-muted">Filter by {form.service || "service"}, search for error patterns.</p>
              </div>
            </a>
            <a href="/incidents/analytics" className="group">
              <div className="glass p-5 h-full transition-transform duration-[200ms] group-hover:-translate-y-0.5">
                <Activity size={20} className="text-accent mb-3" />
                <div className="text-[14px] font-semibold mb-1">Anomaly Detection</div>
                <p className="text-[12px] text-muted">Check detected outliers in your log streams.</p>
              </div>
            </a>
            <div className="glass p-5">
              <MessageSquareText size={20} className="text-accent mb-3" />
              <div className="text-[14px] font-semibold mb-1">Ask the Copilot</div>
              <p className="text-[12px] text-muted mb-3">Describe the symptom and get next-step suggestions.</p>
              <textarea
                rows={2}
                className={inputCls}
                placeholder={`e.g. "Why would ${form.service || "api-gateway"} time out?"`}
              />
            </div>
          </div>
        </Card>
      )}

      {step === 3 && (
        <Card className="max-w-[760px]">
          <h3 className="text-[16px] font-semibold mb-1 flex items-center gap-2">
            <Sparkles size={16} className="text-accent" />
            Root cause & resolution
          </h3>
          <p className="text-[12px] text-muted mb-5">Capture what you suspect — you can refine this after creating the incident.</p>
          <div className="space-y-4">
            <div>
              <label className="block text-[12px] font-medium text-[var(--fg-2)] mb-1">Suspected root cause</label>
              <textarea rows={3} className={inputCls} placeholder="e.g. connection pool exhaustion after deploy 4.2.1" value={form.root_cause} onChange={set("root_cause")} />
            </div>
            <div>
              <label className="block text-[12px] font-medium text-[var(--fg-2)] mb-1">Planned resolution</label>
              <textarea rows={3} className={inputCls} placeholder="e.g. roll back to 4.2.0 and raise pool limits" value={form.resolution} onChange={set("resolution")} />
            </div>
          </div>
        </Card>
      )}

      {step === 4 && (
        <Card className="max-w-[760px]">
          <h3 className="text-[16px] font-semibold mb-4 flex items-center gap-2">
            <CheckCircle2 size={16} className="text-accent" />
            Review & create
          </h3>
          <div className="space-y-3 text-[13px]">
            <div className="flex gap-3"><span className="w-32 text-muted flex-shrink-0">Title</span><span className="text-[var(--fg-2)]">{form.title || "—"}</span></div>
            <div className="flex gap-3"><span className="w-32 text-muted flex-shrink-0">Service</span><span className="text-[var(--fg-2)]">{form.service || "—"}</span></div>
            <div className="flex gap-3"><span className="w-32 text-muted flex-shrink-0">Severity</span><Badge variant={form.severity === "critical" ? "danger" : form.severity === "high" ? "warn" : "info"}>{form.severity}</Badge></div>
            <div className="flex gap-3"><span className="w-32 text-muted flex-shrink-0">Started</span><span className="text-[var(--fg-2)]">{new Date(form.start_time).toLocaleString()}</span></div>
            <div className="flex gap-3"><span className="w-32 text-muted flex-shrink-0">Description</span><span className="text-[var(--fg-2)]">{form.description || "—"}</span></div>
            <div className="flex gap-3"><span className="w-32 text-muted flex-shrink-0">Root cause</span><span className="text-[var(--fg-2)]">{form.root_cause || "—"}</span></div>
            <div className="flex gap-3"><span className="w-32 text-muted flex-shrink-0">Resolution</span><span className="text-[var(--fg-2)]">{form.resolution || "—"}</span></div>
          </div>
        </Card>
      )}

      <div className="flex items-center justify-between mt-6 max-w-[760px]">
        <Button variant="ghost" size="md" disabled={step === 1} onClick={() => setStep((s) => s - 1)}>
          <ArrowLeft size={15} /> Back
        </Button>
        {step < 4 ? (
          <Button variant="primary" size="md" disabled={!canNext} onClick={() => setStep((s) => s + 1)}>
            Continue <ArrowRight size={15} />
          </Button>
        ) : (
          <Button variant="primary" size="md" disabled={creating} onClick={handleCreate}>
            {creating ? "Creating…" : "Create Incident"} <CheckCircle2 size={15} />
          </Button>
        )}
      </div>
    </>
  );
}