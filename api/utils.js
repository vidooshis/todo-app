const jwt = require("jsonwebtoken");
require("dotenv").config();

const JWT_SECRET = process.env.JWT_SECRET;

function authMiddleware(handler) {
  return async (req, res) => {
    try {
      const token = req.headers.token;
      if (!token) {
        return res.status(401).json({ message: "Token missing" });
      }

      const decoded = jwt.verify(token, JWT_SECRET);
      req.userId = decoded.id;

      return handler(req, res); // 👈 pass control
    } catch (e) {
      return res.status(403).json({ message: "Invalid token" });
    }
  };
}

module.exports = { authMiddleware };
