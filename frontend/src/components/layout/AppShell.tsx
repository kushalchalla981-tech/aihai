"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import AmbientBg from "./AmbientBg";
import { useProduct } from "./ProductSwitcher";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const product = useProduct();
  const isLanding = pathname === "/";

  useEffect(() => {
    if (isLanding) {
      delete document.body.dataset.product;
    } else {
      document.body.dataset.product = product;
    }
  }, [product, isLanding]);

  if (isLanding) {
    return (
      <main className="min-h-screen bg-page-bg text-text-primary flex flex-col">
        {children}
      </main>
    );
  }

  return (
    <div className="flex h-screen bg-page-bg text-text-primary overflow-hidden">
      <AmbientBg />
      <Sidebar />
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden bg-page-bg border-l border-border-soft">
        <Topbar />
        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          <div className="max-w-container mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
