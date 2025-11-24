// src/app/admin/chat/layout.jsx
export const metadata = {
  title: "Admin Chat",
};

export default function AdminChatLayout({ children }) {
  return (
    <div
      className="min-h-screen bg-gray-900 text-white"
      // optional: center content
      style={{ display: "flex", flexDirection: "column" }}
    >
      {children}
    </div>
  );
}
