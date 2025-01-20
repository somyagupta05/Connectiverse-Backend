// controllers/user.js
import { User } from "../models/user.js";
import { sendToken } from "../utils/features.js";

const login = (req, res) => {
  res.send("hello world");
};

const newUser = async (req, res) => {
  // const { name, username, password, bio } = req.body;
  const avatar = {
    public_id: "Sdfsd",
    url: "asdfd",
  };
  const user=await User.create({
    name,
    bio,
    username,
    password,
    avatar,
  });

 sendToken(res,user,201,"user craeted")
};

// Export the functions
export { login, newUser };
