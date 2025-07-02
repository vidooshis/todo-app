const { todomodel } = require("./db");
const { authMiddleware } = require("./utils");

module.exports = authMiddleware(async (req, res) => {
  if (req.method !== "GET") return res.status(405).json({ msg: "Only GET allowed" });

  const userId = req.userId;
  const todos = await todomodel.find({ userId });

  res.json({ todos });
});
