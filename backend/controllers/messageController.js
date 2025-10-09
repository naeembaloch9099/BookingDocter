const Message = require("../models/Message");

exports.createMessage = async (req, res) => {
  try {
    console.log("[CREATE MESSAGE] Payload received:", req.body);
    const { firstName, lastName, email, phone, message } = req.body;

    if (!firstName || !email || !message) {
      console.warn("[CREATE MESSAGE] Missing required fields");
      return res.status(400).json({
        message: "First name, email, and message are required",
      });
    }

    const msg = new Message({
      firstName,
      lastName,
      email,
      phone,
      message,
    });
    await msg.save();
    console.log("[CREATE MESSAGE] Saved message:", msg._id);
    res.status(201).json({ ok: true, message: msg });
  } catch (err) {
    console.error("[CREATE MESSAGE ERROR]", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getMessages = async (req, res) => {
  try {
    console.log("[GET MESSAGES] Request received");
    const q = {};
    if (req.query.search)
      q.message = { $regex: req.query.search, $options: "i" };
    const messages = await Message.find(q).limit(200).sort({ createdAt: -1 });
    console.log("[GET MESSAGES] Found", messages.length, "messages");
    res.json({ ok: true, messages });
  } catch (err) {
    console.error("[GET MESSAGES ERROR]", err);
    res.status(500).json({ message: "Server error" });
  }
};
