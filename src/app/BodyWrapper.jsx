// frontend\src\app\BodyWrapper.jsx
"use client";

import { usePathname } from "next/navigation";
import Header from "../components/Header";
import Footer from "../components/Footer";
import ClientChatWrapper from "./ClientChatWrapper";
import LuxuryOverlay from "../components/LuxuryOverlay";
import GlowFade from "../components/GlowFade";

export default function BodyWrapper({ children }) {
  const pathname = usePathname();

  const isAdminChat = pathname.startsWith("/admin/chat");

  return (
    <>
      <LuxuryOverlay />

      {!isAdminChat && (
        <header className="relative z-30">
          <Header />
        </header>
      )}

      <main
        className={`relative z-20 py-16 px-4 md:px-8 backdrop-blur-[2px] bg-white/5 shadow-brand-lg`}
      >
        {children}
      </main>

      {!isAdminChat && <ClientChatWrapper />}

      {!isAdminChat && (
        <footer className="relative z-30">
          <Footer />
        </footer>
      )}

      <GlowFade />
    </>
  );
}
