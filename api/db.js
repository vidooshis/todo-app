const mongoose = require("mongoose");
require("dotenv").config();

if (!mongoose.connection.readyState) {
  mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
}

// User Schema
const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String
});

// Todo Schema
const TodoSchema = new mongoose.Schema({
  title: String,
  userId: mongoose.Schema.Types.ObjectId,
  done: Boolean
});

// Models
const usermodel = mongoose.models.User || mongoose.model("User", UserSchema);
const todomodel = mongoose.models.Todo || mongoose.model("Todo", TodoSchema);

module.exports = { usermodel, todomodel };
