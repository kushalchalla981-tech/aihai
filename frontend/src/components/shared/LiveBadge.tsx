export default function LiveBadge() {
  return (
    <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md border border-status-success/20 bg-status-success/10 text-status-success text-[10px] uppercase font-bold tracking-widest">
      <span className="w-1.5 h-1.5 rounded-full bg-status-success" />
      Live
    </div>
  );
}
