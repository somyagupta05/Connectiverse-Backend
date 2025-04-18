// controllers/user.js
import { User } from "../models/user.js";
import { cookieOptions, sendToken } from "../utils/features.js";
import { TryCatch } from "../middlewares/error.js";
import { ErrorHandler } from "../utils/utility.js";
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

const login = TryCatch(async (req, res, next) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username }).select("+password");
    if (!user)
      return next(new ErrorHandler("Invalid user name or password", 404));

    const isMatch = await compare(password, user.password);

    if (!isMatch)
      return next(new ErrorHandler("Invalid password or username", 404));

    sendToken(res, user, 20, `welcome Back ,${user.name}`);
  } catch (error) {
    next(error);
  }
});

const getMyProfile = TryCatch(async (req, res) => {
  const user = await User.findById(req.user);
  res.status(200).json({
    success: true,
    data: req.user,
  });
});

const logout = TryCatch(async (req, res) => {
  res
    .status(200)
    .cookie("chattu-token", "", { ...cookieOptions, maxAge: 0 })
    .json({
      success: true,
      message: "Looged out successfully",
    });
});

const searchUser = TryCatch(async (req, res) => {
  const { name } = req.query;
  return res.status(200).json({
    success: true,
    message: name,
  });
});
export { login, newUser, getMyProfile, logout, searchUser };
