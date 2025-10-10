import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import {
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaPaperPlane,
} from "react-icons/fa";
import { jsonFetch } from "../../utils/api";
import { initSocket } from "../../utils/socket";

const ContactContainer = styled.section`
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  padding: clamp(2rem, 4vw, 5rem) 2rem;
`;

// layout helpers (moved above component)
const ContentWrapper = styled.div`
  max-width: 1100px;
  margin: 0 auto;
`;

const SectionHeader = styled.div`
  margin-bottom: 1.5rem;
`;

const SectionTitle = styled.h2`
  margin: 0;
  font-size: clamp(1.5rem, 2.8vw, 2rem);
`;

const SectionSubtitle = styled.p`
  margin: 0.5rem 0 0;
  color: #6b7280;
`;

const ContactGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const ContactInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const ContactItem = styled.div`
  display: flex;
  gap: 1rem;
  align-items: flex-start;
`;

const ContactIcon = styled.div`
  width: 54px;
  height: 54px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: clamp(1.1rem, 2.4vw, 1.5rem);
  background: linear-gradient(135deg, #4f46e5 0%, #7e22ce 100%);
  color: white;
  flex-shrink: 0;
`;

const ContactText = styled.div`
  flex: 1;
`;

const ContactLabel = styled.h4`
  font-size: 1.05rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  color: #2d3748;
`;

const ContactValue = styled.p`
  color: #718096;
  line-height: 1.6;
`;

const SubmitButton = styled.button`
  background: linear-gradient(135deg, #4f46e5 0%, #7e22ce 100%);
  color: white;
  border: none;
  padding: 1rem 1.25rem;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;

  &:disabled {
    cursor: not-allowed;
    opacity: 0.7;
  }
`;

// form helpers
const FormRow = styled.div`
  display: flex;
  gap: 1rem;
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const FormGroup = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-weight: 600;
  color: #374151;
`;

const Input = styled.input`
  padding: 0.85rem 1rem;
  border-radius: 10px;
  border: 1px solid #e6e7eb;
  background: white;
  outline: none;
  &:focus {
    box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.08);
    border-color: #7c3aed;
  }
`;

const TextArea = styled.textarea`
  padding: 0.85rem 1rem;
  border-radius: 10px;
  border: 1px solid #e6e7eb;
  min-height: 140px;
  resize: vertical;
  outline: none;
  &:focus {
    box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.08);
    border-color: #7c3aed;
  }
`;

// form wrapper (used in JSX as <Form>)
const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

// --- message card styles (match admin layout) ---
const MessageCard = styled.div`
  background: white;
  border-radius: 16px;
  padding: 1.6rem;
  box-shadow: 0 6px 18px rgba(2, 6, 23, 0.06);
  border-left: 4px solid #4f46e5;
  margin-bottom: 1.25rem;
`;

const MessageHeader = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  margin-bottom: 1rem;
`;

const MessageIcon = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: linear-gradient(135deg, #4f46e5 0%, #7e22ce 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.1rem;
  flex-shrink: 0;
`;

const MessageSender = styled.div`
  flex: 1;
`;

const SenderName = styled.h4`
  margin: 0;
  font-size: 1.05rem;
  font-weight: 700;
  color: #111827;
`;

const SenderDetails = styled.div`
  display: flex;
  gap: 1rem;
  color: #6b7280;
  margin-top: 6px;
  font-size: 0.95rem;
`;

const DetailItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const DetailIcon = styled.div`
  color: #4f46e5;
  font-size: 0.95rem;
`;

const MessageContent = styled.div`
  background: #f8fafc;
  border-radius: 12px;
  padding: 1rem;
  margin-top: 0.5rem;
`;

const MessageLabel = styled.div`
  font-weight: 600;
  color: #374151;
`;

const MessageText = styled.p`
  margin: 8px 0 0 0;
  color: #374151;
  line-height: 1.5;
`;

const DeleteButton = styled.button`
  background: #ef4444;
  color: white;
  border: none;
  padding: 8px 10px;
  border-radius: 8px;
  cursor: pointer;
`;

// compact composer for subsequent messages
const ComposerBar = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 12px;
  align-items: center;
`;

const ComposerInput = styled.input`
  flex: 1;
  padding: 12px 14px;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  outline: none;
`;

const ComposerSend = styled.button`
  background: linear-gradient(135deg, #4f46e5 0%, #7e22ce 100%);
  color: white;
  border: none;
  width: 44px;
  height: 44px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  cursor: pointer;
`;

// enhanced message list styles
const MessagesList = styled.div`
  margin-top: 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const MessageItem = styled.div`
  background: linear-gradient(180deg, #ffffff 0%, #fbfdff 100%);
  border-radius: 14px;
  padding: 18px;
  box-shadow: 0 8px 20px rgba(15, 23, 42, 0.06),
    0 2px 6px rgba(15, 23, 42, 0.04);
  display: flex;
  flex-direction: column;
  transition: transform 160ms ease, box-shadow 160ms ease;
  position: relative;

  &:hover {
    transform: translateY(-6px);
    box-shadow: 0 18px 36px rgba(15, 23, 42, 0.12),
      0 6px 12px rgba(15, 23, 42, 0.06);
  }
`;

const MessageTop = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const Avatar = styled.div`
  width: 54px;
  height: 54px;
  border-radius: 12px;
  background: linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  flex-shrink: 0;
`;

const Meta = styled.div`
  flex: 1;
`;

const MetaName = styled.div`
  font-weight: 800;
  color: #0f172a;
`;

const MetaSub = styled.div`
  color: #64748b;
  font-size: 0.95rem;
  margin-top: 6px;
`;

const ReplyIcon = styled.button`
  position: absolute;
  right: 18px;
  top: 18px;
  background: linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%);
  border: none;
  width: 44px;
  height: 44px;
  border-radius: 10px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: white;
  cursor: pointer;
  box-shadow: 0 6px 16px rgba(79, 70, 229, 0.16);
`;

const MessageBody = styled.div`
  margin-top: 12px;
  color: #0f172a;
  line-height: 1.5;
`;

const ReplyBox = styled.div`
  margin-top: 12px;
  background: #f1f5f9;
  padding: 12px;
  border-radius: 10px;
  color: #0f172a;
`;

const ContactSection = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    mobileNumber: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const currentUser =
    typeof window !== "undefined" ? window.__APP_USER__ || null : null;

  const [followUpVisible, setFollowUpVisible] = useState({});
  const composerRef = useRef(null);

  // derive safe first/last name for payloads: prefer formData, then currentUser fields, then parse currentUser.name
  const getNameParts = () => {
    const fn = (formData.firstName || currentUser?.firstName || "").trim();
    const ln = (formData.lastName || currentUser?.lastName || "").trim();
    if (fn || ln) return { firstName: fn, lastName: ln };
    const name = (currentUser?.name || "").trim();
    if (!name) return { firstName: "", lastName: "" };
    const parts = name.split(/\s+/).filter(Boolean);
    return {
      firstName: parts[0] || "",
      lastName: parts.slice(1).join(" ") || "",
    };
  };

  // build a consistent message payload for POSTs
  const buildMessagePayload = (messageText, conversationId) => {
    const nameParts = getNameParts();
    return {
      firstName: nameParts.firstName || currentUser?.firstName || "",
      lastName: nameParts.lastName || currentUser?.lastName || "",
      email:
        (formData.email && formData.email.trim()) || currentUser?.email || "",
      phone:
        (formData.mobileNumber && formData.mobileNumber.trim()) ||
        currentUser?.phone ||
        "",
      message: (messageText || "").trim(),
      ...(conversationId ? { conversationId } : {}),
    };
  };

  // single socket effect: consolidate listeners to avoid duplicate handlers
  useEffect(() => {
    const sock = initSocket();

    const handler = (msg) => {
      try {
        if (!msg) return;
        if (currentUser && msg.email && msg.email === currentUser.email) {
          addOrUpdateMessage(msg);

          if (
            window.__APP_TOAST__ &&
            typeof window.__APP_TOAST__.info === "function"
          ) {
            window.__APP_TOAST__.info(`Reply received: ${msg.reply}`);
          } else {
            alert(`Reply received: ${msg.reply}`);
          }

          try {
            setFollowUpVisible((s) => ({ ...s, [msg._id]: true }));
          } catch (e) {
            console.warn(e);
          }
        }
      } catch (e) {
        console.error(e);
      }
    };

    const onNew = (msg) => {
      try {
        if (!msg) return;
        if (currentUser && msg.email === currentUser.email)
          addOrUpdateMessage(msg);
      } catch (err) {
        console.error(err);
      }
    };

    const onSent = (msg) => {
      try {
        if (!msg) return;
        if (currentUser && msg.email === currentUser.email)
          addOrUpdateMessage(msg);
      } catch (e) {
        console.error(e);
      }
    };

    const onStatus = (msg) => {
      try {
        if (!msg) return;
        if (currentUser && msg.email === currentUser.email)
          addOrUpdateMessage(msg);
      } catch (e) {
        console.error(e);
      }
    };

    sock.on("message_replied", handler);
    sock.on("new_message", onNew);
    sock.on("message_sent", onSent);
    sock.on("message_status", onStatus);

    return () => {
      try {
        sock.off("message_replied", handler);
        sock.off("new_message", onNew);
        sock.off("message_sent", onSent);
        sock.off("message_status", onStatus);
      } catch (err) {
        console.warn("Failed to remove socket handler", err);
      }
    };
  }, [currentUser]);

  // NOTE: duplicate socket listeners were removed above; keep a single consolidated
  // useEffect (defined earlier) that listens for events and updates local state.

  // typing indicator: emit start/stop while the user types
  useEffect(() => {
    const sock = initSocket();
    return () => {
      try {
        sock.emit("typing_stop", { email: currentUser?.email });
      } catch (e) {
        console.warn(e);
      }
    };
  }, [currentUser]);

  // user's own messages
  const [myMessages, setMyMessages] = useState([]);
  // helper to add or update a message in local state without duplicates
  const addOrUpdateMessage = (msg) => {
    if (!msg || !msg._id) return;
    setMyMessages((prev) => {
      // Merge msg at the front and then dedupe by _id to avoid race-created duplicates
      const combined = [msg, ...prev];
      const seen = new Set();
      const out = [];
      for (const m of combined) {
        if (!m || !m._id) continue;
        if (!seen.has(m._id)) {
          seen.add(m._id);
          out.push(m);
        }
      }
      return out;
    });
  };
  // per-message reply text for client follow-ups
  const [replyTextMap, setReplyTextMap] = useState({});
  // track deleting messages to disable delete button while in-flight
  const [deletingIds, setDeletingIds] = useState({});

  useEffect(() => {
    const fetchMine = async () => {
      if (!currentUser) return;
      try {
        const res = await jsonFetch("/api/messages?mine=true");
        // dedupe any accidental duplicates returned from server
        const msgs = res?.messages || [];
        const seen = new Set();
        const dedup = [];
        for (const m of msgs) {
          if (!m || !m._id) continue;
          if (!seen.has(m._id)) {
            seen.add(m._id);
            dedup.push(m);
          }
        }
        setMyMessages(dedup);
      } catch (err) {
        console.error("Failed to fetch user messages", err);
      }
    };
    fetchMine();
  }, [currentUser]);

  const handleDelete = async (id) => {
    const backup = myMessages;
    // optimistic remove
    setMyMessages((s) => s.filter((m) => m._id !== id));
    setDeletingIds((s) => ({ ...s, [id]: true }));
    try {
      // collect token from common locations to ensure Authorization header is sent
      const token =
        (typeof window !== "undefined" && window.__APP_TOKEN__) ||
        (typeof window !== "undefined" &&
          window.localStorage &&
          window.localStorage.getItem("app_token")) ||
        (typeof window !== "undefined" &&
          window.localStorage &&
          window.localStorage.getItem("token")) ||
        (typeof window !== "undefined" &&
          window.localStorage &&
          window.localStorage.getItem("jwt"));

      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      console.log("[DELETE] token present?", !!token, "id:", id);

      await jsonFetch(`/api/messages/${id}`, { method: "DELETE", headers });
      // success: already removed from UI
      setDeletingIds((s) => {
        const copy = { ...s };
        delete copy[id];
        return copy;
      });
    } catch (err) {
      console.error("Failed to delete message", err);
      // If server says message not found, keep it removed locally
      if (err?.status === 404 || err?.data?.message === "Message not found") {
        setDeletingIds((s) => {
          const copy = { ...s };
          delete copy[id];
          return copy;
        });
        return;
      }

      // restore UI on auth or other failures
      setMyMessages(backup);
      setDeletingIds((s) => {
        const copy = { ...s };
        delete copy[id];
        return copy;
      });

      if (err?.status === 401 || err?.status === 403) {
        if (
          window.__APP_TOAST__ &&
          typeof window.__APP_TOAST__.error === "function"
        )
          window.__APP_TOAST__.error(
            "You are not authorized to delete this message."
          );
        else alert("You are not authorized to delete this message.");
        return;
      }

      if (
        window.__APP_TOAST__ &&
        typeof window.__APP_TOAST__.error === "function"
      ) {
        window.__APP_TOAST__.error("Failed to delete message");
      } else {
        alert("Failed to delete message");
      }
    }
  };

  // handle form input changes
  const handleChange = (e) => {
    setFormData((s) => ({ ...s, [e.target.name]: e.target.value }));
  };

  // emit typing events when message field changes
  const handleMessageChange = (e) => {
    setFormData((s) => ({ ...s, [e.target.name]: e.target.value }));
    try {
      const sock = initSocket();
      sock.emit("typing_start", { email: currentUser?.email });
      // send stop after 1.5s of inactivity
      if (window._typingTimer) clearTimeout(window._typingTimer);
      window._typingTimer = setTimeout(() => {
        try {
          sock.emit("typing_stop", { email: currentUser?.email });
        } catch (err) {
          console.warn(err);
        }
      }, 1500);
    } catch (err) {
      console.warn(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    if (!currentUser) {
      if (
        window.__APP_TOAST__ &&
        typeof window.__APP_TOAST__.error === "function"
      ) {
        window.__APP_TOAST__.error("You must be logged in to send a message.");
      } else {
        alert("You must be logged in to send a message.");
      }
      return;
    }

    const payload = buildMessagePayload(formData.message);

    // require phone for first message
    if (!payload.phone) {
      if (
        window.__APP_TOAST__ &&
        typeof window.__APP_TOAST__.error === "function"
      ) {
        window.__APP_TOAST__.error("Please provide a phone number.");
      } else {
        alert("Please provide a phone number.");
      }
      return;
    }

    setIsSubmitting(true);
    try {
      console.debug("[CONTACT] Sending message payload:", payload);
      console.debug(
        "[CONTACT] Token present?",
        !!(
          (typeof window !== "undefined" && window.__APP_TOKEN__) ||
          (typeof window !== "undefined" &&
            window.localStorage?.getItem("app_token"))
        )
      );
      const res = await jsonFetch("/api/messages", {
        method: "POST",
        body: payload,
      });
      // add created message to local history so it persists in UI
      if (res && res.message) {
        addOrUpdateMessage(res.message);
      }
      const name = payload.firstName || "friend";
      if (
        window.__APP_TOAST__ &&
        typeof window.__APP_TOAST__.success === "function"
      ) {
        window.__APP_TOAST__.success(`Thank you ${name} for your message!`);
      } else {
        alert(`Thank you ${name} for your message!`);
      }

      // clear only message field, keep name/email/phone prefilled
      setFormData((s) => ({ ...s, message: "" }));
    } catch (error) {
      console.error("[CONTACT FORM] Submission failed", error);
      const errorMessage = error?.message || "Failed to send your message.";
      if (
        window.__APP_TOAST__ &&
        typeof window.__APP_TOAST__.error === "function"
      ) {
        window.__APP_TOAST__.error(errorMessage);
      } else {
        alert(errorMessage);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ContactContainer>
      <ContentWrapper>
        <SectionHeader>
          <SectionTitle>Send Us A Message</SectionTitle>
          <SectionSubtitle>
            Get in touch with us for any inquiries or appointments. We're here
            to help you.
          </SectionSubtitle>
        </SectionHeader>

        <ContactGrid>
          <ContactInfo>
            <ContactItem>
              <ContactIcon>
                <FaPhone />
              </ContactIcon>
              <ContactText>
                <ContactLabel>Phone Number</ContactLabel>
                <ContactValue>919-979-9999</ContactValue>
              </ContactText>
            </ContactItem>

            <ContactItem>
              <ContactIcon>
                <FaEnvelope />
              </ContactIcon>
              <ContactText>
                <ContactLabel>Email Address</ContactLabel>
                <ContactValue>zee5eb@gmail.com</ContactValue>
              </ContactText>
            </ContactItem>

            <ContactItem>
              <ContactIcon>
                <FaMapMarkerAlt />
              </ContactIcon>
              <ContactText>
                <ContactLabel>Our Location</ContactLabel>
                <ContactValue>Kanichi, Pakistan</ContactValue>
              </ContactText>
            </ContactItem>
          </ContactInfo>

          {currentUser ? (
            myMessages.length === 0 ? (
              <Form onSubmit={handleSubmit}>
                <FormRow>
                  <FormGroup>
                    <Label>First Name</Label>
                    <Input
                      type="text"
                      name="firstName"
                      placeholder="Your first name"
                      value={formData.firstName}
                      onChange={handleChange}
                      required
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label>Last Name</Label>
                    <Input
                      type="text"
                      name="lastName"
                      placeholder="Your last name"
                      value={formData.lastName}
                      onChange={handleChange}
                      required
                    />
                  </FormGroup>
                </FormRow>

                <FormRow>
                  <FormGroup>
                    <Label>Email</Label>
                    <Input
                      type="email"
                      name="email"
                      placeholder="Your email address"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label>Mobile</Label>
                    <Input
                      type="text"
                      name="mobileNumber"
                      placeholder="Your mobile number"
                      value={formData.mobileNumber}
                      onChange={handleChange}
                    />
                  </FormGroup>
                </FormRow>

                <FormGroup>
                  <Label>Message</Label>
                  <TextArea
                    name="message"
                    placeholder="Write your message..."
                    value={formData.message}
                    onChange={handleMessageChange}
                    required
                  />
                </FormGroup>

                <SubmitButton type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Sending..." : "Send Message"}
                  <span style={{ marginLeft: 8 }}>
                    <FaPaperPlane />
                  </span>
                </SubmitButton>
              </Form>
            ) : (
              <div style={{ width: "100%" }}>
                <ComposerBar>
                  <ComposerInput
                    placeholder="Write a message..."
                    value={formData.message}
                    onChange={(e) =>
                      setFormData((s) => ({ ...s, message: e.target.value }))
                    }
                    ref={composerRef}
                    onKeyDown={async (e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        if (!formData.message.trim()) return;
                        setIsSubmitting(true);
                        try {
                          const payload = buildMessagePayload(formData.message);
                          const res = await jsonFetch("/api/messages", {
                            method: "POST",
                            body: payload,
                          });
                          console.debug(
                            "[CONTACT] Sent follow-up payload:",
                            payload
                          );
                          if (res?.message) addOrUpdateMessage(res.message);
                          setFormData((s) => ({ ...s, message: "" }));
                        } catch (err) {
                          console.error("Compact composer send failed", err);
                          const errMsg =
                            err?.data?.message ||
                            err?.message ||
                            "Failed to send message";
                          if (err.status === 401) {
                            if (
                              window.__APP_TOAST__ &&
                              typeof window.__APP_TOAST__.error === "function"
                            )
                              window.__APP_TOAST__.error(
                                "Please login to send messages"
                              );
                            else alert("Please login to send messages");
                          } else {
                            if (
                              window.__APP_TOAST__ &&
                              typeof window.__APP_TOAST__.error === "function"
                            )
                              window.__APP_TOAST__.error(errMsg);
                            else alert(errMsg);
                          }
                        } finally {
                          setIsSubmitting(false);
                        }
                      }
                    }}
                  />
                  <ComposerSend
                    onClick={async () => {
                      if (!formData.message.trim()) return;
                      setIsSubmitting(true);
                      try {
                        const payload = buildMessagePayload(formData.message);
                        const res = await jsonFetch("/api/messages", {
                          method: "POST",
                          body: payload,
                        });
                        if (res?.message) addOrUpdateMessage(res.message);
                        setFormData((s) => ({ ...s, message: "" }));
                      } catch (err) {
                        console.error("Compact composer send failed", err);
                        const errMsg =
                          err?.data?.message ||
                          err?.message ||
                          "Failed to send message";
                        if (err.status === 401) {
                          if (
                            window.__APP_TOAST__ &&
                            typeof window.__APP_TOAST__.error === "function"
                          )
                            window.__APP_TOAST__.error(
                              "Please login to send messages"
                            );
                          else alert("Please login to send messages");
                        } else {
                          if (
                            window.__APP_TOAST__ &&
                            typeof window.__APP_TOAST__.error === "function"
                          )
                            window.__APP_TOAST__.error(errMsg);
                          else alert(errMsg);
                        }
                      } finally {
                        setIsSubmitting(false);
                      }
                    }}
                  >
                    <FaPaperPlane />
                  </ComposerSend>
                </ComposerBar>
              </div>
            )
          ) : (
            <div style={{ padding: 20 }}>
              Please login or signup to send a message.
            </div>
          )}
        </ContactGrid>

        {/* My messages list */}
        {currentUser && (
          <div style={{ marginTop: 24 }}>
            <h3>Your messages</h3>
            {myMessages.length === 0 ? (
              <div style={{ padding: 12 }}>No messages yet.</div>
            ) : (
              myMessages.map((m) => (
                <MessageItem key={m._id}>
                  <MessageTop>
                    <Avatar>
                      {((m.firstName || "").charAt(0) || "") +
                        ((m.lastName || "").charAt(0) || "")}
                    </Avatar>
                    <Meta>
                      <MetaName>
                        {m.firstName} {m.lastName}
                      </MetaName>
                      <MetaSub>
                        {m.email} • {new Date(m.createdAt).toLocaleString()}
                      </MetaSub>
                    </Meta>
                    <div>
                      <DeleteButton
                        onClick={() => handleDelete(m._id)}
                        disabled={!!deletingIds[m._id]}
                        title={
                          deletingIds[m._id] ? "Deleting..." : "Delete message"
                        }
                      >
                        {deletingIds[m._id] ? <>Deleting...</> : "Delete"}
                      </DeleteButton>
                    </div>
                  </MessageTop>

                  <MessageBody>{m.message}</MessageBody>

                  {m.reply && (
                    <ReplyBox>
                      <strong>Reply:</strong>
                      <div style={{ marginTop: 6 }}>{m.reply}</div>
                    </ReplyBox>
                  )}

                  {/* per-message reply input for client follow-ups */}
                  <div style={{ marginTop: 12 }}>
                    <div
                      style={{ display: "flex", gap: 8, alignItems: "center" }}
                    >
                      <ComposerInput
                        placeholder="Write a follow-up..."
                        value={replyTextMap[m._id] || ""}
                        onChange={(e) =>
                          setReplyTextMap((s) => ({
                            ...s,
                            [m._id]: e.target.value,
                          }))
                        }
                        onKeyDown={async (e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            const text = (replyTextMap[m._id] || "").trim();
                            if (!text) return;
                            try {
                              const payload = buildMessagePayload(
                                text,
                                m.conversationId || m.email
                              );
                              const res = await jsonFetch("/api/messages", {
                                method: "POST",
                                body: payload,
                              });
                              if (res?.message) addOrUpdateMessage(res.message);
                              setReplyTextMap((s) => ({ ...s, [m._id]: "" }));
                            } catch (err) {
                              console.error(err);
                            }
                          }
                        }}
                      />
                      <ComposerSend
                        onClick={async () => {
                          const text = (replyTextMap[m._id] || "").trim();
                          if (!text) return;
                          try {
                            const payload = buildMessagePayload(
                              text,
                              m.conversationId || m.email
                            );
                            const res = await jsonFetch("/api/messages", {
                              method: "POST",
                              body: payload,
                            });
                            if (res?.message) addOrUpdateMessage(res.message);
                            setReplyTextMap((s) => ({ ...s, [m._id]: "" }));
                          } catch (err) {
                            console.error(err);
                          }
                        }}
                        aria-label="Send follow-up"
                      >
                        <FaPaperPlane />
                      </ComposerSend>
                    </div>
                  </div>
                  {m.reply && followUpVisible[m._id] ? (
                    <div
                      style={{
                        marginTop: 10,
                        display: "flex",
                        gap: 8,
                        alignItems: "center",
                      }}
                    >
                      <div style={{ color: "#374151" }}>
                        Keep in mind — tell us if you have any other query?
                      </div>
                      <button
                        onClick={() => {
                          try {
                            if (composerRef && composerRef.current)
                              composerRef.current.focus();
                          } catch (e) {
                            console.warn(e);
                          }
                        }}
                        style={{
                          background: "#4f46e5",
                          color: "white",
                          border: "none",
                          padding: "6px 10px",
                          borderRadius: 8,
                          cursor: "pointer",
                        }}
                      >
                        Reply
                      </button>
                      <button
                        onClick={() =>
                          setFollowUpVisible((s) => ({ ...s, [m._id]: false }))
                        }
                        style={{
                          background: "#e5e7eb",
                          color: "#374151",
                          border: "none",
                          padding: "6px 10px",
                          borderRadius: 8,
                          cursor: "pointer",
                        }}
                      >
                        Dismiss
                      </button>
                    </div>
                  ) : null}
                </MessageItem>
              ))
            )}
          </div>
        )}
      </ContentWrapper>
    </ContactContainer>
  );
};

export default ContactSection;
