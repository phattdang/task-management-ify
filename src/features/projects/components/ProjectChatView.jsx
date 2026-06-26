import React, { useState, useEffect, useRef, useCallback } from "react";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import chatApi from "../apis/chatApi";

const WS_URL = import.meta.env.VITE_WS_URL || "http://localhost:8080/ws";

const AVATAR_COLORS = [
  "bg-blue-500", "bg-purple-500", "bg-green-500", "bg-pink-500",
  "bg-orange-500", "bg-teal-500", "bg-rose-500", "bg-indigo-500",
];

const getAvatarColor = (name = "") => {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
};

const getInitials = (name = "") =>
  name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase() || "?";

const formatTime = (timestamp) => {
  if (!timestamp) return "";
  const d = new Date(timestamp);
  return d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true });
};

const formatDateGroup = (timestamp) => {
  if (!timestamp) return "";
  const d = new Date(timestamp);
  return d.toLocaleDateString("vi-VN", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
};

function groupMessagesByDate(messages) {
  const groups = [];
  let lastDate = null;
  for (const msg of messages) {
    const dateLabel = formatDateGroup(msg.timestamp);
    if (dateLabel !== lastDate) {
      groups.push({ type: "date", label: dateLabel, key: dateLabel + msg.id });
      lastDate = dateLabel;
    }
    groups.push({ type: "message", data: msg, key: msg.id });
  }
  return groups;
}

// Connection Status Badge
function StatusBadge({ status }) {
  const cfg = {
    connecting: { dot: "bg-amber-400 animate-pulse", text: "Connecting..." },
    connected:  { dot: "bg-emerald-500 animate-pulse", text: "Live" },
    disconnected: { dot: "bg-slate-400", text: "Disconnected" },
    error:      { dot: "bg-red-500", text: "Connection error" },
  };
  const c = cfg[status] || cfg.disconnected;
  return (
    <span className="flex items-center gap-1.5 text-xs font-medium text-slate-500 dark:text-slate-400">
      <span className={`w-2 h-2 rounded-full shrink-0 ${c.dot}`}></span>
      {c.text}
    </span>
  );
}

export default function ProjectChatView({ projectInfo, projectId }) {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [connectionStatus, setConnectionStatus] = useState("disconnected");
  const [historyLoading, setHistoryLoading] = useState(true);

  const stompClientRef = useRef(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Derive current user email from token
  const currentUserEmail = (() => {
    try {
      const token = localStorage.getItem("access_token");
      if (!token) return null;
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload.sub || payload.email || null;
    } catch {
      return null;
    }
  })();

  const members = projectInfo?.members || [];
  const onlineCount = members.filter((m) => m.isOnline).length;

  // Scroll to bottom
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // Fetch history + connect WS
  useEffect(() => {
    if (!projectId) return;

    let stompClient = null;

    // 1. Load history
    const loadHistory = async () => {
      setHistoryLoading(true);
      try {
        const res = await chatApi.getHistory(projectId);
        const list = res.data?.body || [];
        // Sort ascending by timestamp
        list.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
        setMessages(list);
      } catch (err) {
        console.error("Failed to load chat history:", err);
      } finally {
        setHistoryLoading(false);
      }
    };

    loadHistory();

    // 2. Connect STOMP
    const accessToken = localStorage.getItem("access_token");

    setConnectionStatus("connecting");

    stompClient = new Client({
      webSocketFactory: () => new SockJS(WS_URL),
      connectHeaders: {
        Authorization: `Bearer ${accessToken}`,
      },
      reconnectDelay: 5000,
      onConnect: () => {
        setConnectionStatus("connected");
        stompClient.subscribe(`/topic/project/${projectId}`, (frame) => {
          try {
            const payload = JSON.parse(frame.body);
            setMessages((prev) => [...prev, payload]);
          } catch (e) {
            console.error("Failed to parse incoming message:", e);
          }
        });
      },
      onDisconnect: () => setConnectionStatus("disconnected"),
      onStompError: (frame) => {
        console.error("STOMP error", frame);
        setConnectionStatus("error");
      },
      onWebSocketError: () => setConnectionStatus("error"),
    });

    stompClient.activate();
    stompClientRef.current = stompClient;

    return () => {
      if (stompClient?.active) {
        stompClient.deactivate();
      }
      stompClientRef.current = null;
      setConnectionStatus("disconnected");
    };
  }, [projectId]);

  // Send message
  const sendMessage = useCallback(() => {
    const trimmed = inputText.trim();
    if (!trimmed) return;
    if (!stompClientRef.current?.active) return;

    stompClientRef.current.publish({
      destination: `/app/chat/${projectId}/sendMessage`,
      body: JSON.stringify({ content: trimmed }),
    });

    setInputText("");
    inputRef.current?.focus();
  }, [inputText, projectId]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleReconnect = () => {
    if (stompClientRef.current && !stompClientRef.current.active) {
      setConnectionStatus("connecting");
      stompClientRef.current.activate();
    }
  };

  const grouped = groupMessagesByDate(messages);

  return (
    <div className="h-full flex bg-white dark:bg-slate-900 overflow-hidden">

      {/* ── Main Chat Column ── */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* Chat Header */}
        <div className="h-16 px-6 flex items-center justify-between border-b border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm shrink-0 z-10">
          <div>
            <h2 className="text-base font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <span>💬</span>
              Project General Chat
            </h2>
            <div className="flex items-center gap-3 mt-0.5">
              <span className="flex items-center gap-1.5 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                {onlineCount > 0 ? `${onlineCount} Members Online` : `${members.length} Members`}
              </span>
              <StatusBadge status={connectionStatus} />
            </div>
          </div>

          {/* Reconnect button if error */}
          {(connectionStatus === "error" || connectionStatus === "disconnected") && (
            <button
              onClick={handleReconnect}
              className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/30 dark:hover:bg-blue-900/50 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800 rounded-lg transition-colors"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Reconnect
            </button>
          )}
        </div>

        {/* Error Banner */}
        {connectionStatus === "error" && (
          <div className="px-6 py-2.5 bg-red-50 dark:bg-red-900/20 border-b border-red-200 dark:border-red-800/50 flex items-center gap-2 text-sm text-red-700 dark:text-red-400 shrink-0">
            <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            WebSocket connection lost. Chat history is still visible. Click Reconnect to retry.
          </div>
        )}

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5
          [&::-webkit-scrollbar]:w-1.5
          [&::-webkit-scrollbar-track]:bg-transparent
          [&::-webkit-scrollbar-thumb]:bg-slate-300
          dark:[&::-webkit-scrollbar-thumb]:bg-slate-700
          [&::-webkit-scrollbar-thumb]:rounded-full
          hover:[&::-webkit-scrollbar-thumb]:bg-slate-400
          dark:hover:[&::-webkit-scrollbar-thumb]:bg-slate-600">

          {/* Loading skeleton */}
          {historyLoading && (
            <div className="flex flex-col gap-4 animate-pulse">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 shrink-0" />
                  <div className="flex flex-col gap-2 w-full max-w-xs">
                    <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-24" />
                    <div className="h-9 bg-slate-200 dark:bg-slate-700 rounded-2xl w-full" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Empty state */}
          {!historyLoading && messages.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center text-center select-none">
              <div className="text-5xl mb-4">💬</div>
              <p className="font-semibold text-slate-700 dark:text-slate-300">No messages yet</p>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Be the first to say something!</p>
            </div>
          )}

          {/* Grouped messages */}
          {!historyLoading && grouped.map((item) => {
            if (item.type === "date") {
              return (
                <div key={item.key} className="flex items-center gap-3 my-4">
                  <div className="flex-1 h-px bg-slate-200 dark:bg-slate-800" />
                  <span className="px-3 py-0.5 text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-full whitespace-nowrap">
                    {item.label}
                  </span>
                  <div className="flex-1 h-px bg-slate-200 dark:bg-slate-800" />
                </div>
              );
            }

            const msg = item.data;
            const isMine = msg.senderEmail === currentUserEmail;

            if (isMine) {
              return (
                <div key={item.key} className="flex justify-end group">
                  <div className="flex flex-col items-end gap-1 max-w-[70%]">
                    <div className="flex items-baseline gap-2">
                      <span className="text-[11px] text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">
                        {formatTime(msg.timestamp)}
                      </span>
                    </div>
                    <div className="px-4 py-2.5 bg-blue-600 text-white rounded-2xl rounded-tr-sm shadow-sm text-sm leading-relaxed">
                      {msg.content}
                    </div>
                    <span className="text-[10px] text-slate-400 dark:text-slate-500">{formatTime(msg.timestamp)}</span>
                  </div>
                </div>
              );
            }

            return (
              <div key={item.key} className="flex gap-3 group max-w-[70%]">
                <div className={`w-8 h-8 rounded-full ${getAvatarColor(msg.senderName)} flex items-center justify-center text-white text-[10px] font-bold shrink-0 mt-1`}>
                  {getInitials(msg.senderName)}
                </div>
                <div className="flex flex-col gap-1">
                  <div className="flex items-baseline gap-2">
                    <span className="font-semibold text-sm text-slate-800 dark:text-slate-200">{msg.senderName}</span>
                    <span className="text-[11px] text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">{formatTime(msg.timestamp)}</span>
                  </div>
                  <div className="px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/50 rounded-2xl rounded-tl-sm shadow-sm text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                    {msg.content}
                  </div>
                  <span className="text-[10px] text-slate-400 dark:text-slate-500">{formatTime(msg.timestamp)}</span>
                </div>
              </div>
            );
          })}

          <div ref={messagesEndRef} />
        </div>

        {/* Chat Input */}
        <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 shrink-0">
          <div className={`flex items-end gap-2 rounded-xl border px-3 py-2 transition-all
            ${connectionStatus === "connected"
              ? "border-slate-200 dark:border-slate-700/60 bg-slate-50 dark:bg-slate-800/80 focus-within:border-blue-400 dark:focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20"
              : "border-slate-200 dark:border-slate-700/40 bg-slate-50/70 dark:bg-slate-800/50 opacity-80"
            }`}>

            {/* Attach button */}
            <button
              title="Attach file (coming soon)"
              className="p-2 text-slate-400 hover:text-blue-500 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors shrink-0 mb-0.5"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
              </svg>
            </button>

            {/* Textarea */}
            <textarea
              ref={inputRef}
              rows={1}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={
                connectionStatus === "connected"
                  ? "Message Project General Chat... (Enter to send)"
                  : "Connecting to chat..."
              }
              disabled={connectionStatus !== "connected"}
              className="flex-1 max-h-36 bg-transparent border-none focus:ring-0 resize-none py-2.5 text-sm text-slate-800 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500 disabled:cursor-not-allowed leading-relaxed [&::-webkit-scrollbar]:hidden"
            />

            {/* Right buttons */}
            <div className="flex items-center gap-1 mb-0.5 shrink-0">
              <button
                title="Emoji (coming soon)"
                className="p-2 text-slate-400 hover:text-amber-500 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </button>
              <button
                onClick={sendMessage}
                disabled={!inputText.trim() || connectionStatus !== "connected"}
                title="Send"
                className="p-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 dark:disabled:bg-slate-700 text-white rounded-lg shadow-sm transition-all disabled:cursor-not-allowed flex items-center justify-center"
              >
                <svg className="w-4 h-4 translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
          </div>
          <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1.5 px-1">
            Press <kbd className="px-1 py-0.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded text-[10px] font-mono">Enter</kbd> to send &nbsp;·&nbsp; <kbd className="px-1 py-0.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded text-[10px] font-mono">Shift + Enter</kbd> for new line
          </p>
        </div>
      </div>

      {/* ── Online Sidebar ── */}
      <div className="w-60 bg-slate-50 dark:bg-slate-900/50 hidden md:flex flex-col border-l border-slate-200 dark:border-slate-800 shrink-0">
        <div className="h-16 px-5 flex items-center border-b border-slate-200 dark:border-slate-800 shrink-0">
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">Members</h3>
          <span className="ml-auto text-xs font-medium text-slate-500 dark:text-slate-400">{members.length}</span>
        </div>
        <div className="flex-1 overflow-y-auto p-3
          [&::-webkit-scrollbar]:w-1
          [&::-webkit-scrollbar-track]:bg-transparent
          [&::-webkit-scrollbar-thumb]:bg-slate-200
          dark:[&::-webkit-scrollbar-thumb]:bg-slate-700">

          {members.length === 0 && (
            <p className="text-xs text-slate-400 px-2 py-3">No members found.</p>
          )}

          {onlineCount > 0 && (
            <div className="mb-3">
              <h4 className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-2 px-2">
                Online — {onlineCount}
              </h4>
              {members.filter((m) => m.isOnline).map((m) => (
                <div key={m.id} className="flex items-center gap-2.5 px-2 py-1.5 rounded-lg hover:bg-slate-200/50 dark:hover:bg-slate-800/50 cursor-pointer transition-colors group">
                  <div className="relative">
                    <div className={`w-7 h-7 rounded-full ${getAvatarColor(m.fullName)} flex items-center justify-center text-white text-[10px] font-bold`}>
                      {getInitials(m.fullName)}
                    </div>
                    <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 border-2 border-slate-50 dark:border-slate-900 rounded-full" />
                  </div>
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300 truncate group-hover:text-slate-900 dark:group-hover:text-slate-100">
                    {m.fullName}
                  </span>
                </div>
              ))}
            </div>
          )}

          {members.filter((m) => !m.isOnline).length > 0 && (
            <div>
              <h4 className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-2 px-2">
                Offline — {members.filter((m) => !m.isOnline).length}
              </h4>
              {members.filter((m) => !m.isOnline).map((m) => (
                <div key={m.id} className="flex items-center gap-2.5 px-2 py-1.5 rounded-lg hover:bg-slate-200/50 dark:hover:bg-slate-800/50 cursor-pointer transition-colors group opacity-60 hover:opacity-100">
                  <div className="relative">
                    <div className="w-7 h-7 rounded-full bg-slate-300 dark:bg-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-400 text-[10px] font-bold">
                      {getInitials(m.fullName)}
                    </div>
                    <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-slate-400 dark:bg-slate-500 border-2 border-slate-50 dark:border-slate-900 rounded-full" />
                  </div>
                  <span className="text-sm font-medium text-slate-600 dark:text-slate-400 truncate group-hover:text-slate-900 dark:group-hover:text-slate-100">
                    {m.fullName}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
