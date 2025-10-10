const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    firstName: { type: String },
    lastName: { type: String },
    email: { type: String },
    phone: { type: String },
    message: { type: String },
    reply: { type: String },
    status: {
      type: String,
      enum: ["sent", "delivered", "read"],
      default: "sent",
    },
    conversationId: { type: String },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Message", messageSchema);
