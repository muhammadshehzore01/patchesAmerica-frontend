"use client";

import { useEffect, useState, useRef } from "react";
import { MessageCircle, Image as ImageIcon, Send } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";

const MEDIA_BASE = (process.env.NEXT_PUBLIC_MEDIA_BASE || "http://localhost:8000").replace(/\/+$/, "");
const WS_BASE = (typeof window !== "undefined"
  ? process.env.NEXT_PUBLIC_WS_BASE || "wss://northernpatches.com/ws"
  : process.env.DOCKER_INTERNAL_WS_BASE || "ws://django_backend:8000"
);

// ----- WebSocket Wrapper -----
class WSClient {
  constructor(url) {
    this.url = url;
    this.ws = null;
    this.queue = [];
    this.listeners = {};
    this.connect();
  }

  connect() {
    this.ws = new WebSocket(this.url);
    this.ws.onopen = () => {
      console.log("🟢 WebSocket connected");
      // flush queue
      while (this.queue.length > 0) this.ws.send(this.queue.shift());
    };
    this.ws.onmessage = (ev) => {
      if (this.listeners["message"]) this.listeners["message"](ev);
    };
    this.ws.onclose = (ev) => {
      console.log("🔴 WebSocket disconnected", ev.code);
      // auto-reconnect after 1s
      setTimeout(() => this.connect(), 1000);
    };
    this.ws.onerror = (err) => {
      console.error("WebSocket error", err);
      this.ws.close();
    };
  }

  send(data) {
    const msg = typeof data === "string" ? data : JSON.stringify(data);
    if (this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(msg);
    } else {
      this.queue.push(msg);
    }
  }

  on(event, cb) {
    this.listeners[event] = cb;
  }

  close() {
    this.ws?.close();
  }
}

// ----- User Chat Widget -----
export default function UserChatWidget() {
  const [open, setOpen] = useState(false);
  const [username, setUsername] = useState("");
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [unreadCount, setUnreadCount] = useState(0);

  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const nameInputRef = useRef(null);
  const originalTitle = useRef(document.title);
  const blinkInterval = useRef(null);

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Load saved username + messages
  useEffect(() => {
    const savedName = localStorage.getItem("chatUserName");
    const savedMessages = localStorage.getItem("chatMessages");
    if (savedName?.trim()) setUsername(savedName.trim());
    if (savedMessages) setMessages(JSON.parse(savedMessages));
  }, []);

  // Save last 50 messages
  useEffect(() => {
    if (!username) return;
    const safeMessages = messages.slice(-50);
    localStorage.setItem("chatMessages", JSON.stringify(safeMessages));
  }, [messages, username]);

  // WebSocket setup
  useEffect(() => {
    if (!username) return;

    const wsClient = new WSClient(`${WS_BASE}/ws/user/${encodeURIComponent(username)}/`);
    wsClient.on("message", (e) => {
      const data = JSON.parse(e.data);
      if (!data.message && !data.attachment) return;

      setMessages((prev) => {
        if (data.tempId) {
          return prev.map((m) =>
            m.id === data.tempId
              ? {
                  ...m,
                  image: null,
                  attachment: data.attachment,
                  temp: false,
                  from_admin: data.from_admin ?? m.from_admin,
                }
              : m
          );
        }

        const exists = prev.some(
          (m) =>
            (m.id && m.id === data.id) ||
            (m.message === data.message &&
              m.from_admin === data.from_admin &&
              m.attachment === data.attachment)
        );
        if (exists) return prev;

        return [...prev, { ...data }];
      });

      if (!open) {
        setUnreadCount((prev) => prev + 1);
        notifyUser();
      }
    });

    setSocket(wsClient);
    return () => wsClient.close();
  }, [username, open]);

  // Send message
  const sendMessage = () => {
    const message = input.trim();
    if (!message || !socket) return;

    const tempId = Date.now().toString();
    socket.send({ action: "reply", message, tempId });
    setMessages((prev) => [
      ...prev,
      { id: tempId, message, from_admin: false, temp: true },
    ]);
    setInput("");
  };

  // Send image
  const sendImage = (file) => {
    if (!file || !socket) return;
    const tempId = Date.now().toString();
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result;
      socket.send({ action: "reply", attachment: base64, tempId });
      setMessages((prev) => [
        ...prev,
        { id: tempId, image: base64, temp: true, from_admin: false },
      ]);
    };
    reader.readAsDataURL(file);
  };

  // Start chat
  const handleStartChat = () => {
    const name = nameInputRef.current?.value.trim();
    if (!name) return alert("Please enter your name to start chat");
    localStorage.setItem("chatUserName", name);
    setUsername(name);
    setOpen(true);
  };

  // Reset chat
  const handleResetChat = () => {
    localStorage.removeItem("chatUserName");
    localStorage.removeItem("chatMessages");
    setUsername("");
    setMessages([]);
    setUnreadCount(0);
    socket?.close();
  };

  // Notify user
  const notifyUser = () => {
    new Audio("/notification.wav").play().catch(() => {});
    if (blinkInterval.current) clearInterval(blinkInterval.current);
    let blink = true;
    const original = originalTitle.current;
    blinkInterval.current = setInterval(() => {
      document.title = blink ? `(${unreadCount + 1}) New Message 💬` : original;
      blink = !blink;
    }, 1000);
    setTimeout(() => {
      clearInterval(blinkInterval.current);
      blinkInterval.current = null;
      document.title = original;
    }, 6000);
  };

  // Attachment URL resolver
  const getAttachmentUrl = (path) => {
    if (!path) return null;
    if (path.startsWith("http")) return path;
    return `${MEDIA_BASE}${path.startsWith("/") ? path : `/${path}`}`;
  };

  return (
    <>
      {/* Floating Chat Button */}
      <div className="fixed bottom-5 right-5 flex flex-col items-end z-50 space-y-2">
        <AnimatePresence>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              onClick={() => setOpen((prev) => !prev)}
              className={`relative flex items-center gap-2 ${
                open
                  ? "bg-gradient-to-r from-blue-700 to-blue-800"
                  : "bg-gradient-to-r from-blue-600 to-blue-800"
              } text-white font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 px-6 py-3 md:rounded-full rounded-full md:text-base text-sm md:w-auto w-14 h-14 md:h-auto justify-center`}
            >
              <MessageCircle className="w-6 h-6" />
              <span className="hidden md:inline">Live Chat</span>
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 bg-red-500 text-xs px-2 py-0.5 rounded-full animate-pulse">
                  {unreadCount}
                </span>
              )}
            </Button>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Chat Window */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className="fixed bottom-24 right-5 w-80 md:w-96 rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-gray-300 z-50 backdrop-blur-lg max-h-[calc(100vh-6rem)]"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-700 to-blue-800 text-white px-4 py-3 flex justify-between items-center shadow-md">
              <span className="font-semibold tracking-wide">Chat Support</span>
              <div className="flex gap-2 items-center">
                {username && (
                  <button
                    onClick={handleResetChat}
                    className="text-xs bg-red-500 px-2 py-1 rounded-md hover:bg-red-600"
                    title="End chat"
                  >
                    End Chat
                  </button>
                )}
                <button
                  onClick={() => setOpen(false)}
                  className="text-lg opacity-80 hover:opacity-100 transition"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Username Input */}
            {!username ? (
              <div className="p-4 flex flex-col items-center justify-center bg-blue-800 flex-1">
                <p className="text-gray-200 mb-2 font-medium">
                  Enter your name to start chat 👋
                </p>
                <input
                  ref={nameInputRef}
                  type="text"
                  placeholder="Your name"
                  className="w-full border text-white rounded-lg p-2 mb-3 bg-blue-700 placeholder-gray-200"
                  onKeyDown={(e) => e.key === "Enter" && handleStartChat()}
                />
                <button
                  onClick={handleStartChat}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium w-full"
                >
                  Start Chat
                </button>
              </div>
            ) : (
              <>
                {/* Messages */}
                <div className="overflow-y-auto p-3 space-y-2 bg-gradient-to-b from-blue-900 via-blue-700 to-gray-700 text-gray-100 h-[400px] md:h-[500px]">
                  {messages.length === 0 && (
                    <p className="text-sm text-gray-300 text-center mt-6">
                      Say hi 👋 — our team will reply soon!
                    </p>
                  )}
                  {messages.map((msg, i) => (
                    <div
                      key={i}
                      className={`flex ${msg.from_admin ? "justify-start" : "justify-end"}`}
                    >
                      <div
                        className={`max-w-[70%] px-3 py-2 rounded-2xl text-sm break-words shadow-lg ${
                          msg.from_admin
                            ? "bg-gray-200 text-gray-900"
                            : "bg-blue-700 text-white"
                        }`}
                      >
                        {msg.image || msg.attachment ? (
                          <div className="flex flex-col">
                            <img
                              src={msg.image ? msg.image : getAttachmentUrl(msg.attachment)}
                              alt="attachment"
                              className="rounded-lg max-w-full shadow-md"
                              onError={(e) => (e.target.src = "/no-image.png")}
                            />
                            {msg.attachment && !msg.temp && (
                              <a
                                href={getAttachmentUrl(msg.attachment)}
                                download
                                className="mt-1 text-xs text-blue-200 hover:underline"
                              >
                                Download
                              </a>
                            )}
                          </div>
                        ) : (
                          msg.message
                        )}
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div className="flex items-center gap-2 p-2 border-t bg-blue-600 shadow-inner">
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => fileInputRef.current.click()}
                    className="rounded-full hover:bg-blue-900 hover:text-white"
                    title="Upload image"
                  >
                    <ImageIcon className="w-5 h-5" />
                  </Button>
                  <input
                    type="file"
                    accept="image/png, image/jpeg, image/webp"
                    ref={fileInputRef}
                    className="hidden"
                    onChange={(e) => sendImage(e.target.files[0])}
                  />
                  <input
                    type="text"
                    placeholder="Type a message..."
                    className="flex-1 border border-gray-300 rounded-xl px-3 py-2 focus:outline-none text-sm text-gray-900 placeholder-gray-500 bg-white"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                  />
                  <Button
                    size="icon"
                    onClick={sendMessage}
                    className="rounded-full bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-lg hover:bg-blue-900 hover:text-white transition-all duration-200"
                  >
                    <Send className="w-5 h-5" />
                  </Button>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
