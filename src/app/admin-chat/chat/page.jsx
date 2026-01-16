"use client";

import { useEffect, useState, useRef } from "react";
import clsx from "clsx";

const WS_BASE = process.env.NEXT_PUBLIC_WS_BASE;
const MEDIA_BASE = process.env.NEXT_PUBLIC_MEDIA_BASE;

export default function AdminChatPage() {
  const [users, setUsers] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [connectedUser, setConnectedUser] = useState(null);
  const [userMessages, setUserMessages] = useState({});
  const [input, setInput] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminName, setAdminName] = useState("admin");
  const [previewImage, setPreviewImage] = useState(null);

  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);
  const titleBlinkRef = useRef(null);
  const fileInputRef = useRef(null);

  // Authentication
  useEffect(() => {
    if (typeof window === "undefined") return;
    const token = localStorage.getItem("adminToken");
    const name = localStorage.getItem("adminName") || "admin";
    setAdminName(name);
    if (!token) window.location.href = "/admin-chat/login";
    else setIsAuthenticated(true);
  }, []);

  const playSound = () => new Audio("/notification.wav").play().catch(() => {});

  const startTitleBlink = (text = "💬 New Message!") => {
    if (titleBlinkRef.current) return;
    const original = document.title;
    let visible = false;
    titleBlinkRef.current = setInterval(() => {
      document.title = visible ? text : original;
      visible = !visible;
    }, 1000);
  };

  const stopTitleBlink = () => {
    clearInterval(titleBlinkRef.current);
    titleBlinkRef.current = null;
    document.title = "Admin Chat";
  };

  const showNotification = (title, body) => {
    if (typeof Notification !== "undefined" && Notification.permission === "granted") {
      const n = new Notification(title, { body, silent: false });
      setTimeout(() => n.close(), 4000);
    }
  };

  const initWebSocket = () => {
    if (typeof window === "undefined") return;
    const token = localStorage.getItem("adminToken");
    if (!token) return;

    const ws = new WebSocket(`${WS_BASE}/ws/admin-chat/${encodeURIComponent(adminName)}/?token=${token}`);
    socketRef.current = ws;

    ws.onopen = () => console.log("✅ Connected to chat server");

    ws.onmessage = (e) => {
      try {
        const data = JSON.parse(e.data);
        switch (data.type) {
          case "online_users":
            setUsers(
              data.users.map((u) => ({
                username: u.username,
                country: u.country || "Unknown",
                online: true,
                unread: 0,
                flash: false,
              }))
            );
            break;

          case "user_joined":
            setUsers((prev) => {
              if (prev.some((u) => u.username === data.username)) return prev;
              return [
                ...prev,
                {
                  username: data.username,
                  country: data.country || "Unknown",
                  online: true,
                  unread: 0,
                  flash: true,
                },
              ];
            });
            setTimeout(() => {
              setUsers((prev) =>
                prev.map((u) =>
                  u.username === data.username ? { ...u, flash: false } : u
                )
              );
            }, 2000);
            showNotification("👤 User Joined", `${data.username} joined`);
            break;

          case "user_message":
            addMessage(data.username, {
              id: `${data.username}-${data.timestamp}-${Math.random()}`,
              from: "user",
              message: data.message,
              attachment: data.attachment,
              timestamp: data.timestamp,
            });
            break;

          case "sent_admin":
            addMessage(data.to, {
              id: `${data.to}-${data.timestamp}-${Math.random()}`,
              from: "admin",
              message: data.message,
              attachment: data.attachment,
              timestamp: data.timestamp,
            });
            break;

          case "admin_list":
            setAdmins(data.admins);
            break;

          case "history":
            setUserMessages((prev) => ({
              ...prev,
              [data.user]: data.messages.map((m) => ({
                id: `${m.sender}-${m.timestamp}-${Math.random()}`,
                from: m.sender === "admin" ? "admin" : "user",
                message: m.message,
                attachment: m.attachment,
                timestamp: m.timestamp,
              })),
            }));
            break;

          default:
            console.warn("⚠️ Unhandled WS type:", data.type);
        }
      } catch (err) {
        console.error("WS message error:", err);
      }
    };

    ws.onclose = (e) => {
      console.log("❌ Disconnected:", e.code);
      if (e.code !== 1000) setTimeout(initWebSocket, 2000);
    };
  };

  const addMessage = (usernameKey, msg) => {
    setUserMessages((prev) => {
      const userMsgs = prev[usernameKey] || [];
      if (userMsgs.some((m) => m.id === msg.id)) return prev;
      const newMsgs = [...userMsgs, msg];

      if (connectedUser !== usernameKey && msg.from === "user") {
        playSound();
        startTitleBlink();
        setUsers((prevUsers) =>
          prevUsers.map((u) =>
            u.username === usernameKey
              ? { ...u, unread: (u.unread || 0) + 1, flash: true }
              : u
          )
        );
        setTimeout(() => {
          setUsers((prevUsers) =>
            prevUsers.map((u) =>
              u.username === usernameKey ? { ...u, flash: false } : u
            )
          );
        }, 2000);
        showNotification(usernameKey, msg.message || "Sent an image");
      }

      return { ...prev, [usernameKey]: newMsgs };
    });
  };

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (Notification.permission !== "granted") Notification.requestPermission();
    if (isAuthenticated) initWebSocket();
    return () => socketRef.current?.close();
  }, [isAuthenticated]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [userMessages, connectedUser]);

  const socketSend = (payload) => {
    const ws = socketRef.current;
    if (ws && ws.readyState === WebSocket.OPEN) ws.send(JSON.stringify(payload));
  };

  const sendMessage = () => {
    if (!connectedUser || !socketRef.current) return;

    const payload = {
      action: "reply",
      to: connectedUser,
      message: input.trim(),
    };

    if (fileInputRef.current?.files?.[0]) {
      const file = fileInputRef.current.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        payload.attachment = reader.result;
        socketSend(payload);
        setInput("");
        setPreviewImage(null);
        fileInputRef.current.value = "";
      };
      reader.readAsDataURL(file);
    } else if (input.trim() !== "") {
      socketSend(payload);
      setInput("");
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) {
      setPreviewImage(null);
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => setPreviewImage(ev.target.result);
    reader.readAsDataURL(file);
  };

  const fetchHistory = (user) => {
    setConnectedUser(user.username);
    stopTitleBlink();
    setUsers((prev) =>
      prev.map((u) => (u.username === user.username ? { ...u, unread: 0 } : u))
    );
    socketSend({ action: "history", user: user.username });
  };

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminName");
    window.location.href = "/admin-chat/login";
  };

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen flex bg-gray-900 text-white relative">
      {/* USERS LIST */}
      <aside className="w-1/4 bg-gray-800 p-4 space-y-3 border-r border-gray-700">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-lg font-bold gradient-heading">Users Online</h2>
          <button
            onClick={handleLogout}
            className="btn-primary bg-red-600 hover:bg-red-700 text-xs px-2 py-1 rounded"
          >
            Logout
          </button>
        </div>
        <ul className="space-y-2 max-h-[70vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-800">
          {users.length > 0 ? (
            users.map((u, idx) => (
              <li
                key={`${u.username}-${idx}`}
                onClick={() => fetchHistory(u)}
                className={clsx(
                  "flex items-center justify-between p-2 rounded cursor-pointer transition-colors duration-300 card",
                  connectedUser === u.username
                    ? "bg-blue-700 text-white"
                    : "hover:bg-gray-700",
                  u.flash && "animate-pulse bg-blue-600"
                )}
              >
                <div>
                  <p className="font-semibold">
                    {u.username}{" "}
                    {u.unread > 0 && (
                      <span className="ml-1 bg-red-500 text-xs px-1 rounded">
                        {u.unread}
                      </span>
                    )}
                  </p>
                  <p className="text-xs text-gray-400">{u.country}</p>
                </div>
                <span
                  className={`w-3 h-3 rounded-full ${
                    u.online ? "bg-green-400" : "bg-gray-500"
                  }`}
                />
              </li>
            ))
          ) : (
            <p className="text-sm text-gray-400">No users online</p>
          )}
        </ul>

        {/* Admins */}
        <div className="mt-4 border-t border-gray-700 pt-3">
          <h3 className="text-sm font-semibold text-gray-400">Admins Online</h3>
          <ul className="text-xs text-gray-300 space-y-1">
            {admins.map((a, idx) => (
              <li key={`${a}-${idx}`}>👑 {a}</li>
            ))}
          </ul>
        </div>
      </aside>

      {/* CHAT WINDOW */}
      <main className="flex-1 flex flex-col">
        <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-gray-900 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-800">
          {connectedUser ? (
            userMessages[connectedUser]?.length > 0 ? (
              userMessages[connectedUser].map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.from === "admin" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={clsx(
                      "max-w-[70%] px-3 py-2 rounded-lg text-sm break-words relative shadow-md card",
                      msg.from === "admin"
                        ? "bg-blue-700 text-white rounded-br-none"
                        : "bg-gray-200 text-gray-900 rounded-bl-none"
                    )}
                  >
                    {msg.attachment ? (
                      <div className="flex flex-col gap-1">
                        {(() => {
                          const imgUrl =
                            msg.attachment.startsWith("http")
                              ? msg.attachment
                              : msg.attachment.startsWith("data:")
                              ? msg.attachment
                              : `${MEDIA_BASE}/${msg.attachment}`.replace(/([^:]\/)\/+/g, "$1");

                          const isImage = /\.(jpg|jpeg|png|gif|webp)$/i.test(imgUrl);

                          return (
                            <>
                              {isImage && (
                                <img
                                  src={imgUrl}
                                  alt="attachment"
                                  className="rounded-lg max-w-full max-h-60 object-contain shadow-lg border border-gray-600"
                                />
                              )}
                              <a
                                href={imgUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                download
                                className="text-xs text-blue-300 hover:text-blue-400 hover:underline"
                              >
                                📎 {isImage ? "View Full Image" : "Download Attachment"}
                              </a>
                            </>
                          );
                        })()}
                      </div>
                    ) : (
                      msg.message
                    )}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-400 text-sm text-center mt-10">
                No messages yet.
              </p>
            )
          ) : (
            <p className="text-gray-400 text-center mt-10">Select a user to view chat</p>
          )}
          <div ref={messagesEndRef} />
        </div>

        {connectedUser && (
          <div className="p-3 border-t border-gray-700 flex flex-col bg-gray-800 gap-2">
            {previewImage && (
              <div className="flex items-center gap-2 bg-gray-700 p-2 rounded-lg">
                <img
                  src={previewImage}
                  alt="Preview"
                  className="w-20 h-20 object-contain rounded shadow-lg"
                />
                <button
                  onClick={() => {
                    setPreviewImage(null);
                    fileInputRef.current.value = "";
                  }}
                  className="text-red-400 text-xs hover:underline"
                >
                  ✖ Remove
                </button>
              </div>
            )}

            <div className="flex items-center gap-2">
              <label className="text-xs bg-gray-700 px-3 py-1 rounded cursor-pointer hover:bg-gray-600">
                📎 Choose File
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 p-2 rounded bg-gray-700 text-white placeholder-gray-400 outline-none"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage();
                  }
                }}
              />
              <button
                onClick={sendMessage}
                className="btn-primary px-4 py-2 text-white font-semibold"
              >
                Send
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
