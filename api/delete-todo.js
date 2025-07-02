const { todomodel } = require("./db");
const { authMiddleware } = require("./utils");
const url = require("url");

module.exports = authMiddleware(async (req, res) => {
  if (req.method !== "DELETE") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const parsedUrl = url.parse(req.url, true);
  const id = parsedUrl.pathname.split("/").pop(); // Get last part of the URL

  if (!id) {
    return res.status(400).json({ message: "Missing ID in request" });
  }

  try {
    await todomodel.findByIdAndDelete(id);
    res.json({ message: "Todo deleted successfully" });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Error deleting todo" });
  }
});
