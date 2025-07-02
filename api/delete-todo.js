const { todomodel } = require("./db");
const { authMiddleware } = require("./utils");

module.exports = authMiddleware(async (req, res) => {
  if (req.method !== "DELETE") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const { id } = req.query;

  try {
    await todomodel.findByIdAndDelete(id);
    res.json({ message: "todo deleted" });
  } catch (e) {
    res.status(500).json({ message: "Error deleting todo" });
  }
});
