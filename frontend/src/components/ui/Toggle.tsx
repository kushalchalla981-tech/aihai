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
          {label && <div className="text-[13px] font-medium text-text-primary">{label}</div>}
          {description && <div className="text-[12px] text-text-secondary">{description}</div>}
        </div>
      )}
      <button
        onClick={() => {
          const next = !on;
          setInternal(next);
          onChange?.(next);
        }}
        className={`relative w-8 h-[18px] rounded-full transition-colors duration-150 flex-shrink-0 ${on ? "bg-accent" : "bg-surface-elevated border border-border-strong"}`}
        role="switch"
        aria-checked={on}
      >
        <span
          className={`absolute top-[2px] left-[2px] w-[14px] h-[14px] rounded-full bg-text-primary transition-transform duration-150 ${on ? "translate-x-[14px]" : "bg-text-secondary"}`}
        />
      </button>
    </div>
  );
}
