const Doctor = require("../models/Doctor");

exports.createDoctor = async (req, res) => {
  try {
    console.log("[CREATE DOCTOR] Payload received:", req.body);
    const { name, email, department } = req.body;
    if (!name || !email) {
      console.warn("[CREATE DOCTOR] Missing required fields");
      return res
        .status(400)
        .json({ message: "Doctor name and email are required" });
    }

    const payload = { ...req.body };

    if (payload.photo && typeof payload.photo === "string") {
      const trimmed = payload.photo.trim();
      payload.photo = trimmed.length ? trimmed : undefined;
    }

    const doc = new Doctor(payload);
    await doc.save();
    console.log("[CREATE DOCTOR] Saved doctor:", doc._id);
    res.status(201).json({ ok: true, doctor: doc });
  } catch (err) {
    console.error("[CREATE DOCTOR ERROR]", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getDoctors = async (req, res) => {
  try {
    console.log("[GET DOCTORS] Request received");
    const q = {};
    if (req.query.search) q.name = { $regex: req.query.search, $options: "i" };
    const doctors = await Doctor.find(q).limit(200);
    console.log("[GET DOCTORS] Found", doctors.length, "doctors");
    res.json({ ok: true, doctors });
  } catch (err) {
    console.error("[GET DOCTORS ERROR]", err);
    res.status(500).json({ message: "Server error" });
  }
};
