import React, { useState, useMemo } from "react";
import styled from "styled-components";
import { FaUser, FaEnvelope, FaPhone, FaComment } from "react-icons/fa";
import { FaPaperPlane } from "react-icons/fa";
import { initSocket } from "../utils/socket";
import { useEffect } from "react";
import { buildAuthHeaders, getApiBase } from "../utils/api";

const MessagesContainer = styled.div`
  max-width: 1000px;
  margin: 0 auto;
`;

const Header = styled.div`
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: 800;
  color: #1f2937;
  margin-bottom: 0.5rem;

  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`;

const MessagesGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const MessageCard = styled.div`
  background: white;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border-left: 4px solid #4f46e5;

  @media (max-width: 768px) {
    padding: 1.5rem;
  }
`;

const MessageHeader = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  margin-bottom: 1.5rem;

  @media (max-width: 480px) {
    flex-direction: column;
    gap: 0.75rem;
  }
`;

const MessageIcon = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 12px;
  background: linear-gradient(135deg, #4f46e5 0%, #7e22ce 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.2rem;
  flex-shrink: 0;

  @media (max-width: 768px) {
    width: 45px;
    height: 45px;
    font-size: 1.1rem;
  }
`;

const MessageSender = styled.div`
  flex: 1;
`;

const SenderName = styled.h3`
  font-size: 1.2rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 0.5rem;

  @media (max-width: 768px) {
    font-size: 1.1rem;
  }
`;

const SenderDetails = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;

  @media (max-width: 480px) {
    gap: 1rem;
    flex-direction: column;
  }
`;

const DetailItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #6b7280;
  font-size: 0.9rem;
`;

const DetailIcon = styled.div`
  color: #4f46e5;
  font-size: 0.9rem;
`;

const MessageContent = styled.div`
  background: #f9fafb;
  border-radius: 12px;
  padding: 1.5rem;
  border-left: 3px solid #e5e7eb;
`;

const MessageLabel = styled.span`
  font-weight: 600;
  color: #374151;
  margin-right: 0.5rem;
`;

const MessageText = styled.p`
  color: #6b7280;
  line-height: 1.6;
  margin: 0.5rem 0 0 0;
`;

const Messages = ({ messages = [] }) => {
  const user =
    typeof window !== "undefined" ? window.__APP_USER__ || null : null;
  const isAdmin = user && user.role === "admin";
  const [replyText, setReplyText] = useState({});
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all"); // all | replied | unreplied

  const handleReply = async (messageId) => {
    const text = (replyText[messageId] || "").trim();
    if (!text) return;
    // try REST first to ensure persistence and server-side emit
    try {
      const base = getApiBase();
      const url = `${base.replace(/\/$/, "")}/api/messages/${messageId}/reply`;
      const headers = {
        "Content-Type": "application/json",
        ...buildAuthHeaders(),
      };
      const res = await fetch(url, {
        method: "PATCH",
        headers,
        body: JSON.stringify({ reply: text }),
      });
      if (!res.ok) throw new Error(`Reply failed: ${res.status}`);
      // persisted; clear input
      setReplyText((s) => ({ ...s, [messageId]: "" }));
      return;
    } catch (err) {
      console.warn("REST reply failed, falling back to socket", err);
    }

    // fallback to socket emit (older behavior)
    try {
      const sock = initSocket();
      sock.emit("reply_message", { messageId, replyText: text });
      setReplyText((s) => ({ ...s, [messageId]: "" }));
    } catch (e) {
      console.error("Failed to send reply via socket", e);
    }
  };

  // typing state per email
  const [typingMap, setTypingMap] = React.useState({});

  useEffect(() => {
    const sock = initSocket();
    const onTyping = ({ email, typing }) => {
      setTypingMap((s) => ({ ...s, [email]: typing }));
      // clear after a short timeout if typing stops
      if (!typing) {
        setTimeout(() => {
          setTypingMap((s) => ({ ...s, [email]: false }));
        }, 3000);
      }
    };
    const onStatus = () => {
      // noop here: AdminDashboard already updates messages state; keep for safety
    };
    sock.on("typing", onTyping);
    sock.on("message_status", onStatus);
    return () => {
      try {
        sock.off("typing", onTyping);
        sock.off("message_status", onStatus);
      } catch (err) {
        console.warn(err);
      }
    };
  }, []);

  // derive grouped messages by email (or createdBy if available)
  const grouped = useMemo(() => {
    // apply search and filter first
    const q = (search || "").trim().toLowerCase();
    const filtered = (messages || []).filter((m) => {
      if (!m) return false;
      // filter by replied/unreplied
      if (filter === "replied" && !m.reply) return false;
      if (filter === "unreplied" && m.reply) return false;
      if (!q) return true;
      const hay = `${m.firstName || ""} ${m.lastName || ""} ${m.email || ""} ${
        m.message || ""
      }`.toLowerCase();
      return hay.includes(q);
    });

    const map = {};
    for (const m of filtered) {
      const key = m.email || m.createdBy || m._id;
      if (!map[key]) {
        map[key] = {
          key,
          email: m.email,
          phone: m.phone,
          name: `${m.firstName || ""} ${m.lastName || ""}`.trim(),
          items: [],
        };
      }
      map[key].items.push(m);
    }

    // convert to array and sort by most recent message in group
    return Object.values(map).sort((a, b) => {
      const ta = new Date(a.items[0]?.createdAt || 0).getTime();
      const tb = new Date(b.items[0]?.createdAt || 0).getTime();
      return tb - ta;
    });
  }, [messages, search, filter]);

  return (
    <MessagesContainer>
      <Header>
        <Title>MESSAGE</Title>
      </Header>

      <div
        style={{
          marginBottom: 16,
          display: "flex",
          gap: 12,
          alignItems: "center",
        }}
      >
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name, email or message"
          style={{
            padding: 10,
            borderRadius: 8,
            border: "1px solid #e5e7eb",
            flex: 1,
          }}
        />
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          style={{ padding: 10, borderRadius: 8 }}
        >
          <option value="all">All</option>
          <option value="unreplied">Unreplied</option>
          <option value="replied">Replied</option>
        </select>
      </div>

      <MessagesGrid>
        {grouped.length === 0 ? (
          <div style={{ padding: 20 }}>No messages yet.</div>
        ) : (
          grouped.map((group) => (
            <MessageCard key={group.key}>
              <MessageHeader>
                <MessageIcon>
                  <FaUser />
                </MessageIcon>
                <MessageSender>
                  <SenderName>
                    {group.name || group.email}{" "}
                    {typingMap[group.email] ? (
                      <span
                        style={{
                          fontSize: 12,
                          color: "#6b7280",
                          marginLeft: 8,
                        }}
                      >
                        typing...
                      </span>
                    ) : null}
                  </SenderName>
                  <SenderDetails>
                    {group.email ? (
                      <DetailItem>
                        <DetailIcon>
                          <FaEnvelope />
                        </DetailIcon>
                        {group.email}
                      </DetailItem>
                    ) : null}
                    {group.phone ? (
                      <DetailItem>
                        <DetailIcon>
                          <FaPhone />
                        </DetailIcon>
                        {group.phone}
                      </DetailItem>
                    ) : null}
                  </SenderDetails>
                </MessageSender>
              </MessageHeader>

              <MessageContent>
                {group.items.map((message) => (
                  <div key={message._id} style={{ marginBottom: 12 }}>
                    <div>
                      <MessageLabel>Message:</MessageLabel>
                    </div>
                    <MessageText>{message.message}</MessageText>
                    {message.reply ? (
                      <div style={{ marginTop: 8 }}>
                        <MessageLabel>Reply:</MessageLabel>
                        <MessageText>{message.reply}</MessageText>
                      </div>
                    ) : null}

                    {isAdmin ? (
                      <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                        <input
                          value={replyText[message._id] || ""}
                          onChange={(e) =>
                            setReplyText((s) => ({
                              ...s,
                              [message._id]: e.target.value,
                            }))
                          }
                          placeholder="Write a reply..."
                          style={{
                            flex: 1,
                            padding: "8px 10px",
                            borderRadius: 8,
                            border: "1px solid #e5e7eb",
                          }}
                        />
                        <button
                          onClick={() => handleReply(message._id)}
                          aria-label="Send reply"
                          style={{
                            background: "#4f46e5",
                            color: "white",
                            border: "none",
                            padding: "8px 10px",
                            borderRadius: 8,
                            cursor: "pointer",
                          }}
                        >
                          <FaPaperPlane />
                        </button>
                      </div>
                    ) : null}
                  </div>
                ))}
              </MessageContent>
            </MessageCard>
          ))
        )}
      </MessagesGrid>
    </MessagesContainer>
  );
};

export default Messages;
