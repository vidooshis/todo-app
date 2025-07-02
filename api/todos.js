const { todomodel } = require("./db");
const { getUserIdFromToken } = require("./utils");

module.exports = async (req, res) => {
  if (req.method !== "GET") return res.status(405).json({ msg: "Only GET allowed" });

  const userId = getUserIdFromToken(req);
  if (!userId) return res.status(403).json({ msg: "Invalid token" });

  const todos = await todomodel.find({ userId });
  res.json({ todos });
};
