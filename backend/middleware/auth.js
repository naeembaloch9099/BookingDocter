const jwt = require("jsonwebtoken");

exports.authenticate = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || req.cookies.token;
    if (!authHeader) {
      console.warn(
        "[AUTH] No token provided - headers:",
        Object.keys(req.headers)
      );
      return res.status(401).json({ message: "No token provided" });
    }

    let token = authHeader;
    if (authHeader.startsWith("Bearer ")) token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "devsecret");
    req.userId = decoded.id;
    req.userRole = decoded.role;
    // also expose email so controllers can make email-based authorization decisions
    req.userEmail = decoded.email;
    next();
  } catch (err) {
    console.error("[AUTH] Token verification failed", err && err.message);
    res.status(401).json({ message: "Invalid token" });
  }
};
