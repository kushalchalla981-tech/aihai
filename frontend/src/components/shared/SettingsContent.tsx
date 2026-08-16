"use client";

import { useState } from "react";
import { Settings, User, Bell, Shield, Sparkles } from "lucide-react";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Toggle from "@/components/ui/Toggle";
import type { Product } from "@/components/layout/ProductSwitcher";

const productMeta: Record<Product, { name: string; sub: string; badge: string }> = {
  incidents: { name: "Incident Manager", sub: "Respond & resolve", badge: "Incident Manager Settings" },
  security: { name: "Vibe Coded Security Checker", sub: "Vibe-coded scan & fix", badge: "Security Checker Settings" },
};

const platformSections = [
  { icon: User, title: "Profile", desc: "Account details and preferences" },
  { icon: Bell, title: "Notifications", desc: "Alert channels and digests" },
];

export default function SettingsContent({ product }: { product: Product }) {
  const meta = productMeta[product];
  const [llmReview, setLlmReview] = useState(() =>
    typeof window !== "undefined"
      ? (window.localStorage.getItem("security-llm") ?? "true") === "true"
      : true
  );

  function toggleLlmReview(value: boolean) {
    setLlmReview(value);
    if (typeof window !== "undefined") {
      window.localStorage.setItem("security-llm", String(value));
    }
  }

  return (
    <>
      <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
        <div className="flex items-center gap-3">
          <h1 className="text-gradient-anim text-[24px] font-semibold">{meta.name} Settings</h1>
          <Badge variant="info">{meta.badge}</Badge>
        </div>
      </div>

      <Card className="text-center py-16 mb-6">
        <div className="w-14 h-14 rounded-[36px] bg-[var(--accent-soft)] grid place-items-center mx-auto mb-5">
          <Settings size={26} className="text-accent" />
        </div>
        <h2 className="text-[18px] font-semibold mb-1">{meta.name} preferences</h2>
        <p className="text-[13px] text-muted max-w-[440px] mx-auto">
          {product === "security"
            ? "Scan behavior and analysis preferences for the Vibe Coded Security Checker."
            : "Incident workflow, alert, and collaboration preferences."}
        </p>
      </Card>

      {product === "security" && (
        <Card className="mb-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-[24px] bg-[var(--accent-soft)] grid place-items-center">
              <Sparkles size={18} className="text-accent" />
            </div>
            <div className="flex-1">
              <span className="text-[14px] font-medium">LLM deep review</span>
              <p className="text-[12px] text-muted mt-[2px]">
                Send up to 10 flagged files to the LLM for a security deep review. Disabled scans run rules-only.
              </p>
            </div>
            <Toggle defaultChecked={llmReview} onChange={toggleLlmReview} />
          </div>
        </Card>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {(product === "security"
          ? [
              ...platformSections,
              { icon: Shield, title: "Scan defaults", desc: "Timeouts, size caps, and allowed hosts" },
            ]
          : [
              ...platformSections,
              { icon: Shield, title: "Copilot access", desc: "Who can invoke the incident copilot" },
            ]
        ).map(({ icon: Icon, title, desc }) => (
          <Card key={title} className="opacity-70">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 rounded-[24px] bg-[var(--accent-soft)] grid place-items-center">
                <Icon size={18} className="text-accent" />
              </div>
              <span className="text-[14px] font-medium">{title}</span>
            </div>
            <p className="text-[12px] text-muted">{desc}</p>
            <div className="text-[11px] text-muted mt-3">Available after launch</div>
          </Card>
        ))}
      </div>
    </>
  );
}