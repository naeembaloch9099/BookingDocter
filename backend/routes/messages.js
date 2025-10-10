const express = require("express");
const router = express.Router();
const messageController = require("../controllers/messageController");
const { authenticate } = require("../middleware/auth");

router.get("/", authenticate, messageController.getMessages);
router.post("/", authenticate, messageController.createMessage);
router.delete("/:id", authenticate, messageController.deleteMessage);
router.patch("/:id/reply", authenticate, messageController.replyToMessage);

module.exports = router;
