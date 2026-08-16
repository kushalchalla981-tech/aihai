"use client";

import { useState } from "react";

interface Props {
  defaultChecked?: boolean;
  checked?: boolean;
  onChange?: (value: boolean) => void;
  label?: string;
  description?: string;
}

export default function Toggle({ defaultChecked = false, checked, onChange, label, description }: Props) {
  const [internal, setInternal] = useState(defaultChecked);
  const on = checked ?? internal;

  return (
    <div className="flex items-center justify-between gap-4">
      {(label || description) && (
        <div>
          {label && <div className="text-[14px] font-medium">{label}</div>}
          {description && <div className="text-[12px] text-muted">{description}</div>}
        </div>
      )}
      <button
        onClick={() => {
          const next = !on;
          setInternal(next);
          onChange?.(next);
        }}
        className={`relative w-10 h-[22px] rounded-[11px] transition-colors duration-[180ms] flex-shrink-0 ${on ? "bg-accent" : "bg-[var(--border)]"}`}
        role="switch"
        aria-checked={on}
      >
        <span
          className={`absolute top-[2px] left-[2px] w-[18px] h-[18px] rounded-full bg-surface-on shadow-[0_0_0_1px_rgba(255,255,255,0.64)] transition-transform duration-[180ms] ${on ? "translate-x-[18px]" : ""}`}
        />
      </button>
    </div>
  );
}
