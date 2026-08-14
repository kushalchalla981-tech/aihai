import clsx from "clsx";

export default function LoadingSkeleton({ className }: { className?: string }) {
  return (
    <div className={clsx("skeleton", className)}>
      &zwnj;
    </div>
  );
}
