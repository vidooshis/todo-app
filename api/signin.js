const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { usermodel } = require("./db");

module.exports = async (req, res) => {
  console.log("HIT signin.js API route");
  if (req.method !== "POST") return res.status(405).json({ msg: "Only POST allowed" });

  const { email, password } = req.body;
  const user = await usermodel.findOne({ email });
  if (!user) return res.status(403).json({ msg: "User not found" });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(403).json({ msg: "Incorrect credentials" });

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
  res.json({ token, name: user.name });
};
