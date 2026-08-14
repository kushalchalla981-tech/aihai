import { Settings, User, Bell, Shield } from "lucide-react";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";

const sections = [
  { icon: User, title: "Profile", desc: "Account details and preferences" },
  { icon: Bell, title: "Notifications", desc: "Alert channels and digests" },
  { icon: Shield, title: "Security", desc: "Access controls and API keys" },
];

export default function SettingsPage() {
  return (
    <>
      <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
        <div className="flex items-center gap-3">
          <h1 className="text-gradient-anim text-[24px] font-semibold">Settings</h1>
          <Badge variant="info">Coming soon</Badge>
        </div>
      </div>

      <Card className="text-center py-16 mb-6">
        <div className="w-14 h-14 rounded-[36px] bg-[var(--accent-soft)] grid place-items-center mx-auto mb-5">
          <Settings size={26} className="text-accent" />
        </div>
        <h2 className="text-[18px] font-semibold mb-1">Settings are coming soon</h2>
        <p className="text-[13px] text-muted max-w-[440px] mx-auto">
          Team, notification, and integration preferences will be managed here.
        </p>
      </Card>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {sections.map(({ icon: Icon, title, desc }) => (
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
