"use client";

import { usePathname } from "next/navigation";
import Sidebar from "@/components/Sidebar";

export default function ClientLayout({ children }) {
  const pathname = usePathname();
  const isLandingPage = pathname === "/" || pathname === "/signup";

  return (
    <div style={{ display: "flex" }}>
      {isLandingPage ? (
        <main
          style={{
            width: "100%",
            minHeight: "100vh",
            overflowX: "hidden",
          }}
        >
          {children}
        </main>
      ) : (
        <Sidebar>{children}</Sidebar>
      )}
    </div>
  );
}