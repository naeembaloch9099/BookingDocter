/* eslint-env node, commonjs */
const express = require("express");
const messageController = require("../controllers/messageController.js");
const { authenticate } = require("../middleware/auth.js");
const router = express.Router();

router.get("/", authenticate, messageController.getMessages);
// allow public message creation (contact form) without requiring auth
router.post("/", messageController.createMessage);
router.delete("/:id", authenticate, messageController.deleteMessage);
router.patch("/:id/reply", authenticate, messageController.replyToMessage);

module.exports = router;
