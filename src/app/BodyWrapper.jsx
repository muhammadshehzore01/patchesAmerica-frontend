"use client";

import { usePathname } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ClientChatWrapper from "./ClientChatWrapper";

export default function BodyWrapper({ children }) {
  const pathname = usePathname();
  const isAdminChat = pathname.startsWith("/admin-chat");

  return (
    <div className="relative flex min-h-screen flex-col overflow-x-hidden">
      {/* HEADER */}
      {!isAdminChat && <Header />}

      {/* MAIN CONTENT */}
      <main className="relative z-10 flex-1 bg-background">
        {children}
      </main>

      {/* FLOATING CHAT (does NOT affect scroll now) */}
      {!isAdminChat && <ClientChatWrapper />}

      {/* FOOTER */}
      {!isAdminChat && <Footer />}
    </div>
  );
}
