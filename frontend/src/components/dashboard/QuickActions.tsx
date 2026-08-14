import Button from "@/components/ui/Button";

export default function QuickActions() {
  return (
    <div className="space-y-[10px]">
      <Button variant="primary" size="sm" className="w-full justify-center">
        New Incident
      </Button>
      <Button variant="secondary" size="sm" className="w-full justify-center">
        Run Postmortem
      </Button>
      <Button variant="secondary" size="sm" className="w-full justify-center">
        Invoke Runbook
      </Button>
      <Button variant="ghost" size="sm" className="w-full justify-center">
        View On-Call Schedule
      </Button>
      <div className="mt-5">
        <div className="w-full h-[2px] bg-[var(--border)] rounded overflow-hidden">
          <div className="h-full w-[30%] bg-gradient-to-r from-accent to-accent-light rounded animate-[loadBarSlide_2s_ease-in-out_infinite]" />
        </div>
        <div className="text-[11px] text-muted text-center mt-1">Auto-refreshing every 30s</div>
      </div>
      <style jsx>{`
        @keyframes loadBarSlide {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(400%); }
        }
      `}</style>
    </div>
  );
}
