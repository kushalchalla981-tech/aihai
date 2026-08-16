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
      <>
        <AmbientBg />
        <main className="content-area">{children}</main>
      </>
    );
  }

  return (
    <>
      <AmbientBg />
      <div className="app-shell">
        <Sidebar />
        <div className="main-area">
          <Topbar />
          <main className="content-area">{children}</main>
        </div>
      </div>
    </>
  );
}