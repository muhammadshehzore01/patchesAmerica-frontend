// src/app/admin/chat/layout.jsx
// src/app/admin/chat/layout.jsx
export const metadata = {
  title: "Admin Chat",
};

export default function AdminChatLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-900 text-white relative font-sans">
      {/* Aurora subtle background */}
      <div className="aurora-effect"></div>
      {children}
    </div>
  );
}
