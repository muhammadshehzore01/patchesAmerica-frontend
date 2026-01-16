// src/app/ClientChatWrapper.jsx
"use client";

import dynamic from "next/dynamic";

const UserChatWidget = dynamic(
  () => import("@/components/UserChatWidget"),
  { ssr: false }
);

export default function ClientChatWrapper() {
  return (
    <div className="fixed bottom-4 right-4 z-[9999]">
      <UserChatWidget />
    </div>
  );
}
