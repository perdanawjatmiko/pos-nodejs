const { User } = require("../models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

module.exports = {
  async register(req, res) {
    try {
      const { name, username, email, password, role } = req.body;

      const existing = await User.findOne({ where: { email } });
      if (existing) return res.status(400).json({ message: "Email already used" });

      const hash = await bcrypt.hash(password, 10);
      const user = await User.create({ name, username, email, password: hash, role });

      res.status(201).json({ message: "User registered", user: { id: user.id, email: user.email } });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  async login(req, res) {
    try {
      const { email, password } = req.body;

      const user = await User.findOne({
        where: {
          email: email
        }
      });

      if (!user) return res.status(404).json({ message: "User not found" });

      const valid = await bcrypt.compare(password, user.password);
      if (!valid) return res.status(401).json({ message: "Invalid credentials" });

      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRATION || "1h" }
      );

      res.json({ token, user: { id: user.id, email: user.email, role: user.role } });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
};
