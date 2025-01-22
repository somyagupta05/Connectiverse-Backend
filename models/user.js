const mongoose = require("mongoose");
import { hash } from "bcrypt";
const userSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    skills: [{ type: String, enum: ["beginner", "intermediate", "advanced"] }],
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profilePicture: { type: String, default: "default-profile.png" },
    messages: [{ type: mongoose.Schema.Types.ObjectId, ref: "Message" }],

    friends: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    rooms: [{ type: mongoose.Schema.Types.ObjectId, ref: "Room" }],
    todo: [{ type: mongoose.Schema.Types.ObjectId, ref: "Todo" }],
  },
  { timestamps: true }
);

Schema.pre("save", async function (next) {
  if (!this.isModified("password")) next();
  this.password = await hash(this.password, 10);
});
export const User = mongoose.models.User || model("user", schema);
// module.exports = mongoose.model("User", userSchema);
