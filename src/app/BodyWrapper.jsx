"use client";

import { usePathname } from "next/navigation";
import { useEffect, memo } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ClientChatWrapper from "./ClientChatWrapper";

function BodyWrapper({ children }) {
  const pathname = usePathname();
  const isAdminRoute = pathname.startsWith("/admin");

  // GA disable for admin pages
  useEffect(() => {
    if (isAdminRoute && typeof window !== "undefined") {
      window["ga-disable-G-RQ99HQ5Z7T"] = true;
    }
  }, [isAdminRoute]);

  // SPA page view
  useEffect(() => {
    if (!isAdminRoute && typeof window !== "undefined" && typeof window.gtag === "function") {
      window.gtag("event", "page_view", { page_path: pathname });
    }
  }, [pathname, isAdminRoute]);

  return (
    <div className="relative flex min-h-screen flex-col overflow-x-hidden">
      {!isAdminRoute && <Header />}
      <main className="pt-[88px] relative z-10 flex-1 bg-background">{children}</main>
      {!isAdminRoute && <ClientChatWrapper />}
      {!isAdminRoute && <Footer />}
    </div>
  );
}

export default memo(BodyWrapper);