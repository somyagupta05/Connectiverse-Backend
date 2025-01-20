// controllers/user.js
import { User } from "../models/user.js";
import { sendToken } from "../utils/features.js";

const newUser = async (req, res) => {
  // const { name, username, password, bio } = req.body;
  const avatar = {
    public_id: "Sdfsd",
    url: "asdfd",
  };
  const user = await User.create({
    name,
    bio,
    username,
    password,
    avatar,
  });

  sendToken(res, user, 201, "user craeted");
};

const login = async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username }).select("+password");
  if (!user) return res.status(400).json({ message: "Invalid user name " });

  const isMatch = await compare(password, user.password);

  if (!isMatch) return res.status(400).json({ message: "Invalid password" });

  sendToken(res, user, 20, `welcome Back ,${user.name}`);
};

// Export the functions
export { login, newUser };
