const { todomodel } = require("./db");
const { getUserIdFromToken } = require("./utils");

module.exports = async (req, res) => {
  if (req.method !== "POST") return res.status(405).json({ msg: "Only POST allowed" });

  const userId = getUserIdFromToken(req);
  if (!userId) return res.status(403).json({ msg: "Invalid token" });

  const { title } = req.body;
  await todomodel.create({ title, userId, done: false });
  res.json({ msg: "Todo created" });
};
