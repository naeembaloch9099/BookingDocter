const express = require("express");
const router = express.Router();
const appointmentController = require("../controllers/appointmentController");
const { authenticate } = require("../middleware/auth");

router.get("/", appointmentController.getAppointments);
router.post("/", appointmentController.createAppointment);
router.patch("/:id/status", authenticate, appointmentController.updateStatus);

module.exports = router;
