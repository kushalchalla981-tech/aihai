export default function SystemHealth() {
  const services = [
    { name: "API Gateway", status: "Degraded", variant: "danger" as const },
    { name: "User Service", status: "Elevated Errors", variant: "warn" as const },
    { name: "Database Primary", status: "Operational", variant: "success" as const },
    { name: "Redis Cluster", status: "Operational", variant: "success" as const },
    { name: "Billing Service", status: "Operational", variant: "success" as const },
  ];

  return (
    <div>
      <div className="flex items-center justify-center mb-4">
        <div className="relative w-16 h-16">
          <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
            <circle className="fill-none stroke-[var(--border)]" cx="50" cy="50" r="45" strokeWidth="6" />
            <circle
              className="fill-none stroke-success"
              cx="50" cy="50" r="45"
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray="283"
              strokeDashoffset="5.66"
              style={{ transition: "stroke-dashoffset 1.5s cubic-bezier(0.22, 1, 0.36, 1)" }}
            />
          </svg>
          <div className="absolute inset-0 grid place-items-center text-center">
            <div className="font-display text-[14px] font-bold leading-none">98</div>
            <div className="text-[9px] text-muted">%</div>
          </div>
        </div>
      </div>
      {services.map((s) => (
        <div key={s.name} className="flex items-center justify-between py-[10px] border-b border-[var(--border-soft)] last:border-b-0">
          <div className="text-[14px] font-medium flex items-center gap-[10px]">
            <span
              className={`inline-block w-2 h-2 rounded-full shadow-[0_0_8px_currentColor] ${
                s.variant === "danger" ? "text-danger bg-danger" :
                s.variant === "warn" ? "text-warn bg-warn" :
                "text-success bg-success"
              }`}
            />
            {s.name}
          </div>
          <span
            className={`inline-flex items-center px-[10px] py-[2px] rounded-[9999px] text-[11px] font-medium ${
              s.variant === "danger" ? "bg-red-100 text-danger" :
              s.variant === "warn" ? "bg-amber-100 text-warn" :
              "bg-green-100 text-success"
            }`}
          >
            {s.status}
          </span>
        </div>
      ))}
    </div>
  );
}
