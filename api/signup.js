const bcrypt = require("bcrypt");
const { usermodel } = require("./db");
const { z } = require("zod");

module.exports = async (req, res) => {
  if (req.method !== "POST") return res.status(405).json({ msg: "Only POST allowed" });

  const schema = z.object({
    name: z.string().min(3),
    email: z.string().email(),
    password: z.string().min(3)
  });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ msg: "Invalid input", error: parsed.error });

  const { name, email, password } = req.body;
  try {
    const hashed = await bcrypt.hash(password, 5);
    await usermodel.create({ name, email, password: hashed });
    res.json({ msg: "You are signed up" });
  } catch (e) {
    if (e.code === 11000) return res.status(409).json({ msg: "User already exists" });
    res.status(500).json({ msg: "Server error", error: e.message });
  }
};
