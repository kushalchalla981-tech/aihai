export default function LiveBadge({ label = "Live" }: { label?: string }) {
  return (
    <span className="inline-flex items-center gap-[6px] px-3 py-[3px] rounded-[9999px] bg-green-100 text-success text-[11px] font-medium">
      <span className="w-[5px] h-[5px] rounded-full bg-success animate-live-pulse" />
      {label}
    </span>
  );
}
