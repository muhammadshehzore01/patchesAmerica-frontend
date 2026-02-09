// src/app/BodyWrapper.jsx
"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ClientChatWrapper from "./ClientChatWrapper";

export default function BodyWrapper({ children }) {
  const pathname = usePathname();
  const isAdminRoute = pathname.startsWith("/admin");

  // Prevent GA pollution from admin pages
  useEffect(() => {
    if (isAdminRoute && typeof window !== "undefined") {
      window["ga-disable-G-RQ99HQ5Z7T"] = true;
    }
  }, [isAdminRoute]);

  // SPA page_view tracking
  useEffect(() => {
    if (!isAdminRoute && typeof window !== "undefined" && typeof window.gtag === "function") {
      window.gtag("event", "page_view", {
        page_path: pathname,
      });
    }
  }, [pathname, isAdminRoute]);

  return (
    <div className="relative flex min-h-screen flex-col overflow-x-hidden">
      {!isAdminRoute && <Header />}
      <main className="pt-[88px] relative z-10 flex-1 bg-background">
        {children}
      </main>
      {!isAdminRoute && <ClientChatWrapper />}
      {!isAdminRoute && <Footer />}
    </div>
  );
}