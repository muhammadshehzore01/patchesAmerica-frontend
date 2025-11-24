"use client";

import dynamic from "next/dynamic";

// dynamically import UserChatWidget with SSR disabled
const UserChatWidget = dynamic(() => import("@/components/UserChatWidget"), {
  ssr: false,
});

export default function ClientChatWrapper() {
  return <UserChatWidget />;
}
