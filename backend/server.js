require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");

const connectDB = require("./config/db");

const authRoutes = require("./routes/auth");
const appointmentRoutes = require("./routes/appointments");
const doctorRoutes = require("./routes/doctors");
const messageRoutes = require("./routes/messages");

const app = express();

// middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan("dev"));

// connect to DB
connectDB();

// routes
app.use("/api/auth", authRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/doctors", doctorRoutes);
app.use("/api/messages", messageRoutes);

app.get("/", (req, res) => {
  res.json({ ok: true, message: "Backend running" });
});

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

// socket.io setup
try {
  const { Server } = require("socket.io");
  const io = new Server(server, {
    cors: {
      origin: true,
      methods: ["GET", "POST"],
    },
  });

  // simple token-based auth for socket connections (optional)
  io.use((socket, next) => {
    try {
      const token =
        socket.handshake.auth?.token || socket.handshake.headers?.authorization;
      // if token present, decode just enough to get role
      if (token) {
        const jwt = require("jsonwebtoken");
        let t = token;
        if (typeof t === "string" && t.startsWith("Bearer "))
          t = t.split(" ")[1];
        try {
          const decoded = jwt.verify(t, process.env.JWT_SECRET || "devsecret");
          socket.user = decoded;
        } catch (e) {
          socket.user = null;
        }
      }
    } catch (e) {
      socket.user = null;
    }
    next();
  });

  io.on("connection", (socket) => {
    console.log("Socket connected", socket.id, socket.user?.role || "no-role");

    // if user is admin, add to admins room
    if (socket.user && socket.user.role === "admin") {
      socket.join("admins");
      console.log("Socket joined admins room:", socket.id);
    }

    socket.on("join_admins", () => {
      // allow explicit join if client requests and we trust them server-side
      socket.join("admins");
    });

    socket.on("reply_message", async (payload) => {
      // payload should contain: messageId, replyText
      try {
        const { messageId, replyText } = payload || {};
        if (!messageId || !replyText) return;
        const Message = require("./models/Message");
        const msg = await Message.findById(messageId);
        if (!msg) return;
        // attach reply and save
        msg.reply = replyText;
        await msg.save();
        // emit once globally so both admins and the original sender receive the update
        io.emit("message_replied", msg);
      } catch (e) {
        console.error("Socket reply_message error", e);
      }
    });

    // mark message as delivered (admin/client acknowledges receipt)
    socket.on("message_delivered", async (payload) => {
      try {
        const { messageId } = payload || {};
        if (!messageId) return;
        const Message = require("./models/Message");
        const msg = await Message.findById(messageId);
        if (!msg) return;
        msg.status = "delivered";
        await msg.save();
        io.to("admins").emit("message_status", msg);
        io.emit("message_status", msg);
      } catch (e) {
        console.error("message_delivered error", e);
      }
    });

    // mark message read
    socket.on("message_read", async (payload) => {
      try {
        const { messageId } = payload || {};
        if (!messageId) return;
        const Message = require("./models/Message");
        const msg = await Message.findById(messageId);
        if (!msg) return;
        msg.status = "read";
        await msg.save();
        io.to("admins").emit("message_status", msg);
        io.emit("message_status", msg);
      } catch (e) {
        console.error("message_read error", e);
      }
    });

    // typing indicators
    socket.on("typing_start", (payload) => {
      try {
        const { email } = payload || {};
        if (!email) return;
        // notify admins that a particular user is typing
        io.to("admins").emit("typing", { email, typing: true });
      } catch (e) {
        console.error("typing_start error", e);
      }
    });

    socket.on("typing_stop", (payload) => {
      try {
        const { email } = payload || {};
        if (!email) return;
        io.to("admins").emit("typing", { email, typing: false });
      } catch (e) {
        console.error("typing_stop error", e);
      }
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected", socket.id);
    });
  });

  // give controllers access to io if needed
  try {
    const messageController = require("./controllers/messageController");
    if (messageController && typeof messageController.setIo === "function") {
      messageController.setIo(io);
    }
  } catch (e) {
    console.warn("Could not set io on controllers", e.message || e);
  }
} catch (e) {
  console.warn("Socket.io not initialized", e.message || e);
}
