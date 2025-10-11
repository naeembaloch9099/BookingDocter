/* eslint-env node, commonjs */
const Message = require("../models/Message");

let io = null;
function setIo(serverIo) {
  io = serverIo;
}

async function createMessage(req, res) {
  try {
    console.log("[CREATE MESSAGE] Payload received:", req.body);
    console.log(
      "[CREATE MESSAGE] req.userId:",
      req.userId,
      "req.userRole:",
      req.userRole
    );
    const { firstName, lastName, email, phone, message } = req.body;

    if (!firstName || !email || !message) {
      console.warn("[CREATE MESSAGE] Missing required fields");
      return res.status(400).json({
        message: "First name, email, and message are required",
      });
    }

    // allow client to pass a conversationId to link follow-ups to an original message
    const conversationId =
      req.body.conversationId || (req.userId ? String(req.userId) : email);
    const msg = new Message({
      firstName,
      lastName,
      email,
      phone,
      message,
      createdBy: req.userId || undefined,
      status: "sent",
      conversationId,
    });
    await msg.save();
    console.log("[CREATE MESSAGE] Saved message:", msg._id);
    // emit to connected admin clients in 'admins' room so they get real-time updates
    try {
      if (io) {
        // Emit new_message only to admin sockets (they join the 'admins' room).
        io.to("admins").emit("new_message", msg);
        // Inform sender/clients that the message was created
        io.emit("message_sent", msg);
        console.log(
          "[CREATE MESSAGE] Emitted new_message (admins) and message_sent via socket"
        );
      }
    } catch (e) {
      console.error("[CREATE MESSAGE] Socket emit failed", e);
    }

    res.status(201).json({ ok: true, message: msg });
  } catch (err) {
    console.error("[CREATE MESSAGE ERROR]", err);
    res.status(500).json({ message: "Server error" });
  }
}

async function getMessages(req, res) {
  try {
    console.log("[GET MESSAGES] Request received");
    const q = {};
    // support searching text
    if (req.query.search)
      q.message = { $regex: req.query.search, $options: "i" };
    // if client requests only their own messages
    if (req.query.mine === "true" && req.userId) q.createdBy = req.userId;

    const messages = await Message.find(q).limit(200).sort({ createdAt: -1 });
    console.log("[GET MESSAGES] Found", messages.length, "messages");
    res.json({ ok: true, messages });
  } catch (err) {
    console.error("[GET MESSAGES ERROR]", err);
    res.status(500).json({ message: "Server error" });
  }
}

async function deleteMessage(req, res) {
  try {
    const id = req.params.id;
    if (!id) return res.status(400).json({ message: "Invalid id" });

    const msg = await Message.findById(id);
    if (!msg) return res.status(404).json({ message: "Message not found" });

    // allow deletion by owner id, owner email, or admin
    const ownerIdMatch = String(msg.createdBy || "") === String(req.userId);
    const ownerEmailMatch = req.userEmail && msg.email === req.userEmail;
    if (!ownerIdMatch && !ownerEmailMatch && req.userRole !== "admin") {
      return res
        .status(403)
        .json({ message: "Not allowed to delete this message" });
    }

    await Message.deleteOne({ _id: id });
    res.json({ ok: true, id });
  } catch (err) {
    console.error("[DELETE MESSAGE ERROR]", err);
    res.status(500).json({ message: "Server error" });
  }
}

// admin reply via REST (useful when socket auth isn't available on client)
async function replyToMessage(req, res) {
  try {
    const id = req.params.id;
    const { reply } = req.body || {};
    if (!id) return res.status(400).json({ message: "Invalid id" });
    if (!reply) return res.status(400).json({ message: "Reply text required" });

    // only allow admins to set the official reply
    // diagnostic logging to help debug auth issues
    console.log("[REPLY] userId:", req.userId, "userRole:", req.userRole);
    try {
      console.log(
        "[REPLY] Auth header (server):",
        req.headers.authorization ? "present" : "missing"
      );
    } catch (err) {
      // log minor error while checking headers to help debug auth issues
      console.debug("[REPLY] header check error", err && err.message);
    }

    if (req.userRole !== "admin") {
      console.warn("[REPLY] Forbidden - not admin", {
        userId: req.userId,
        role: req.userRole,
      });
      return res.status(403).json({ message: "Not allowed" });
    }

    const msg = await Message.findById(id);
    if (!msg) return res.status(404).json({ message: "Message not found" });

    msg.reply = reply;
    await msg.save();

    // emit reply event once so all clients (including admins) receive it
    try {
      if (io) {
        io.emit("message_replied", msg);
      }
    } catch (err) {
      console.error("[REPLY MESSAGE] Socket emit failed", err);
    }

    res.json({ ok: true, message: msg });
  } catch (err) {
    console.error("[REPLY MESSAGE ERROR]", err);
    res.status(500).json({ message: "Server error" });
  }
}

module.exports = {
  setIo,
  createMessage,
  getMessages,
  deleteMessage,
  replyToMessage,
};
