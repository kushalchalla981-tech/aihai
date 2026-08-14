"use client";

import { useState, useRef, useEffect } from "react";
import { Search, Bell, X } from "lucide-react";

export default function Topbar() {
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [clock, setClock] = useState("");
  const notifRef = useRef<HTMLDivElement>(null);

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
    <header className="h-[var(--topbar-h)] bg-[var(--surface)] backdrop-blur-[20px] border-b border-[var(--border-soft)] flex items-center gap-6 px-6 flex-shrink-0">
      <div className="flex-1 max-w-[420px] relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
        <input
          type="text"
          placeholder="Search incidents, logs..."
          className="w-full py-2 pl-9 pr-4 border border-[var(--border)] rounded-[9999px] bg-white/50 text-[13px] text-[var(--fg)] outline-none transition-[border-color,box-shadow] duration-[180ms] focus:border-accent focus:shadow-[0_0_0_3px_var(--accent-soft)]"
        />
      </div>

      <div className="flex items-center gap-[10px] ml-auto">
        <span className="font-mono text-[13px] text-muted">{clock}</span>

        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setNotifOpen((o) => !o)}
            className="w-9 h-9 rounded-full grid place-items-center text-[var(--fg-2)] hover:bg-[var(--accent-soft)] hover:text-accent transition-colors duration-[180ms] relative"
            aria-label="Notifications"
          >
            <Bell size={18} />
            <span className="absolute top-[6px] right-[6px] w-2 h-2 rounded-full bg-danger border-2 border-[var(--surface)]" />
          </button>

          {notifOpen && (
            <div className="absolute top-full right-0 mt-2 w-[320px] bg-[var(--surface)] backdrop-blur-[24px] border border-[var(--border)] rounded-[20px] shadow-[0_24px_80px_rgba(79,140,255,0.18)] p-4 z-50">
              {[
                { icon: "alert", text: <><strong>CRIT-2210</strong> escalated — API gateway timeout</>, time: "2 min ago" },
                { icon: "check", text: <><strong>INC-118</strong> auto-resolved after canary rollback</>, time: "14 min ago" },
                { icon: "warning", text: <>Memory usage exceeds 85% on <strong>api-prod-3</strong></>, time: "32 min ago" },
              ].map((n, i) => (
                <div key={i} className="flex gap-4 py-[10px] border-b border-[var(--border-soft)] last:border-b-0">
                  <div className="w-7 h-7 rounded-full bg-[var(--accent-soft)] grid place-items-center flex-shrink-0">
                    <div className="w-3.5 h-3.5 rounded-full bg-accent" />
                  </div>
                  <div>
                    <div className="text-[13px] text-[var(--fg-2)]">{n.text}</div>
                    <div className="text-[11px] text-muted mt-[2px]">{n.time}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <button
          onClick={() => setProfileOpen((o) => !o)}
          className="w-[34px] h-[34px] rounded-full bg-gradient-to-br from-accent to-accent-light text-surface-on grid place-items-center text-[13px] font-semibold cursor-pointer flex-shrink-0 hover:shadow-[0_0_0_3px_var(--accent-soft)] transition-shadow duration-[180ms]"
        >
          AK
        </button>
      </div>

      {profileOpen && (
        <>
          <div className="fixed inset-0 z-40 bg-black/30 backdrop-blur-[4px]" onClick={() => setProfileOpen(false)} />
          <div className="fixed top-0 right-0 w-[360px] h-screen z-50 bg-[var(--surface)] backdrop-blur-[24px] border-l border-[var(--border)] p-6 flex flex-col animate-[fade-in_0.2s_ease]">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold">Profile</h3>
              <button onClick={() => setProfileOpen(false)} className="w-8 h-8 rounded-full grid place-items-center text-muted hover:bg-[var(--accent-soft)] hover:text-accent transition-colors duration-[180ms]">
                <X size={18} />
              </button>
            </div>
            <div className="text-center py-6 border-b border-[var(--border-soft)]">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-accent to-accent-light text-surface-on grid place-items-center text-[22px] font-semibold mx-auto mb-4">AK</div>
              <div className="font-semibold text-[17px]">Alex Kovacs</div>
              <div className="text-[13px] text-muted mt-1">alex@example.com</div>
            </div>
            <nav className="flex-1 py-4 flex flex-col gap-[2px]">
              {[
                { label: "My Account", icon: "user" },
                { label: "Settings", href: "/settings" },
                { label: "Notifications", icon: "bell" },
                { label: "Security", icon: "shield" },
              ].map((item) => (
                <a key={item.label} href={item.href || "#"} className="flex items-center gap-4 px-4 py-[10px] rounded-[10px] text-[14px] text-[var(--fg-2)] hover:bg-[var(--accent-soft)] hover:text-accent transition-colors duration-[180ms]">
                  <div className="w-[18px] h-[18px] rounded bg-muted/20" />
                  {item.label}
                </a>
              ))}
              <a href="#" className="flex items-center gap-4 px-4 py-[10px] rounded-[10px] text-[14px] text-danger hover:bg-red-50 mt-auto">
                <div className="w-[18px] h-[18px] rounded bg-danger/20" />
                Sign Out
              </a>
            </nav>
          </div>
        </>
      )}
    </header>
  );
}
