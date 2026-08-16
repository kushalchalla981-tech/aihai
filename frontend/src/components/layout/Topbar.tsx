"use client";

import { useState, useRef, useEffect } from "react";
import { Search, Bell, X, User } from "lucide-react";
import ProductSwitcher, { useProduct } from "./ProductSwitcher";

export default function Topbar() {
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [clock, setClock] = useState("");
  const notifRef = useRef<HTMLDivElement>(null);
  const product = useProduct();

  const searchPlaceholder = product === "security"
    ? "Search findings, projects..."
    : "Search incidents, logs...";

  useEffect(() => {
    function tick() {
      setClock(new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false }) + " UTC");
    }
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false);
      }
    }
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  return (
    <header className="h-[var(--topbar-h)] bg-surface-base border-b border-border-soft flex items-center gap-6 px-6 flex-shrink-0 z-10 relative">
      <ProductSwitcher />

      <div className="flex-1 max-w-[420px] relative hidden md:block">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary" />
        <input
          type="text"
          placeholder={searchPlaceholder}
          className="w-full py-1.5 pl-9 pr-4 border border-border-soft rounded-md bg-surface-elevated text-[13px] text-text-primary outline-none transition-colors duration-150 focus:border-accent focus:ring-1 focus:ring-accent"
        />
      </div>

      <div className="flex items-center gap-3 ml-auto">
        <span className="font-mono text-[12px] text-text-secondary hidden sm:inline-block tabular-nums">{clock}</span>

        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setNotifOpen((o) => !o)}
            className="w-8 h-8 rounded-md grid place-items-center text-text-secondary hover:bg-surface-elevated hover:text-text-primary transition-colors duration-150 relative"
            aria-label="Notifications"
          >
            <Bell size={16} />
            <span className="absolute top-[6px] right-[6px] w-1.5 h-1.5 rounded-full bg-status-critical border border-surface-base" />
          </button>

          {notifOpen && (
            <div className="absolute top-full right-0 mt-2 w-[320px] bg-surface-elevated border border-border-strong rounded-lg shadow-lg p-3 z-50">
              <div className="text-[12px] font-semibold text-text-secondary uppercase tracking-wide mb-2 px-2">Notifications</div>
              {[
                { type: "critical", text: <><strong>CRIT-2210</strong> escalated — API gateway timeout</>, time: "2 min ago" },
                { type: "success", text: <><strong>INC-118</strong> auto-resolved after canary rollback</>, time: "14 min ago" },
                { type: "warning", text: <>Memory usage exceeds 85% on <strong>api-prod-3</strong></>, time: "32 min ago" },
              ].map((n, i) => (
                <div key={i} className="flex gap-3 py-2 px-2 hover:bg-surface-base rounded-md transition-colors cursor-pointer">
                  <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${n.type === 'critical' ? 'bg-status-critical' : n.type === 'success' ? 'bg-status-success' : 'bg-status-high'}`} />
                  <div>
                    <div className="text-[13px] text-text-primary leading-tight">{n.text}</div>
                    <div className="text-[11px] text-text-tertiary mt-1">{n.time}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <button
          onClick={() => setProfileOpen((o) => !o)}
          className="w-8 h-8 rounded-md bg-surface-elevated border border-border-strong text-text-primary grid place-items-center text-[12px] font-medium cursor-pointer flex-shrink-0 hover:border-accent transition-colors duration-150"
        >
          AK
        </button>
      </div>

      {profileOpen && (
        <>
          <div className="fixed inset-0 z-40 bg-page-bg/50" onClick={() => setProfileOpen(false)} />
          <div className="fixed top-0 right-0 w-[300px] h-screen z-50 bg-surface-base border-l border-border-soft p-6 flex flex-col shadow-2xl animate-[fade-in_0.2s_ease]">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-[16px] font-semibold">Profile</h3>
              <button onClick={() => setProfileOpen(false)} className="w-8 h-8 rounded-md grid place-items-center text-text-secondary hover:bg-surface-elevated transition-colors duration-150">
                <X size={16} />
              </button>
            </div>
            <div className="text-center py-6 border-b border-border-soft">
              <div className="w-14 h-14 rounded-full bg-surface-elevated border border-border-strong text-text-primary grid place-items-center text-[20px] font-medium mx-auto mb-3">AK</div>
              <div className="font-semibold text-[15px]">Alex Kovacs</div>
              <div className="text-[13px] text-text-secondary mt-1">alex@example.com</div>
            </div>
            <nav className="flex-1 py-4 flex flex-col gap-1">
              {[
                { label: "My Account", icon: User },
                { label: "Settings", href: product === "security" ? "/security/settings" : "/incidents/settings", icon: User },
              ].map((item, i) => (
                <a key={i} href={item.href || "#"} className="flex items-center gap-3 px-3 py-2 rounded-md text-[13px] text-text-secondary hover:bg-surface-elevated hover:text-text-primary transition-colors duration-150">
                  <item.icon size={14} className="text-text-tertiary" />
                  {item.label}
                </a>
              ))}
              <div className="mt-auto pt-4 border-t border-border-soft">
                <a href="#" className="flex items-center gap-3 px-3 py-2 rounded-md text-[13px] text-status-critical hover:bg-status-critical/10 transition-colors">
                  Sign Out
                </a>
              </div>
            </nav>
          </div>
        </>
      )}
    </header>
  );
}
