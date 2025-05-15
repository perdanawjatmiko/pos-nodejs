const jwt = require("jsonwebtoken");

module.exports = {
  authenticate: (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Token required" });

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
      next();
    } catch (err) {
      return res.status(401).json({ message: "Invalid token" });
    }
  },

  authorize: (roles = []) => {
    return (req, res, next) => {
      if (!roles.includes(req.user.role)) {
        console.log("ROLES DIIZINKAN:", roles);
        console.log("ROLE USER:", req.user?.role);
        return res.status(403).json({ message: "Forbidden" });
      }
      next();
    };
  }
};
