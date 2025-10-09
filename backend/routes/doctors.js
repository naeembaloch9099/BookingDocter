const express = require("express");
const router = express.Router();
const doctorController = require("../controllers/doctorController");
const { authenticate } = require("../middleware/auth");

router.get("/", doctorController.getDoctors);
router.post("/", authenticate, doctorController.createDoctor);

module.exports = router;
