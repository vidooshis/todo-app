const { todomodel } = require("./db");
const { authMiddleware } = require("./utils");

module.exports = authMiddleware(async (req, res) => {
  if (req.method !== "POST") return res.status(405).json({ msg: "Only POST allowed" });

  const { title } = req.body;
  const userId = req.userId;

  await todomodel.create({ title, userId, done: false });
  res.json({ msg: "Todo created" });
});
