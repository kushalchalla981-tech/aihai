import { BarChart3, TrendingUp, Clock, Activity } from "lucide-react";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";

const metricCards = [
  { icon: TrendingUp, label: "MTTR Trend", value: "—" },
  { icon: Clock, label: "Incident Frequency", value: "—" },
  { icon: Activity, label: "Service Health", value: "—" },
];

export default function AnalyticsPage() {
  return (
    <>
      <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
        <div className="flex items-center gap-3">
          <h1 className="text-gradient-anim text-[24px] font-semibold">Analytics</h1>
          <Badge variant="info">Coming soon</Badge>
        </div>
      </div>

      <Card className="text-center py-16 mb-6">
        <div className="w-14 h-14 rounded-[36px] bg-[var(--accent-soft)] grid place-items-center mx-auto mb-5">
          <BarChart3 size={26} className="text-accent" />
        </div>
        <h2 className="text-[18px] font-semibold mb-1">Analytics is coming soon</h2>
        <p className="text-[13px] text-muted max-w-[440px] mx-auto">
          Incident frequency, MTTR trends, and service health analytics will live here.
        </p>
      </Card>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {metricCards.map(({ icon: Icon, label, value }) => (
          <Card key={label} className="opacity-70">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 rounded-[24px] bg-[var(--accent-soft)] grid place-items-center">
                <Icon size={18} className="text-accent" />
              </div>
              <span className="text-[13px] text-[var(--fg-2)]">{label}</span>
            </div>
            <div className="text-[24px] font-semibold font-display">{value}</div>
            <div className="text-[11px] text-muted mt-1">Available after launch</div>
          </Card>
        ))}
      </div>
    </>
  );
}
