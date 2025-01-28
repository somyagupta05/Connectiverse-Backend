import { TryCatch } from "../middlewares/error.js";
import chat from "../models/chat.js";
import { emitEvent } from "../utils/features.js";
import { ErrorHandler } from "../utils/utility.js";
import { ALERT, REFETCH_CHATS } from "../constants/events.js";
const newGroupChat = TryCatch(async (req, res, next) => {
  const { name, members } = req.body;

  if (memebers.length < 2)
    return next(
      new ErrorHandler("Group chat must have at least 3 members", 400)
    );
  const allMembers = [...members, req.user];

  await Chat.create({
    name,
    groupChat: true,
    creator: req.user,
    members: allMembers,
  });
  emitEvent(req, ALERT, allMembers, `welcome to ${name} group`);
  emitEvent(req, REFETCH_CHATS, members);

  return res.status(201).json({
    success: true,
    message: "Group created",
  });
});

const getMyChats = TryCatch(async (req, res, next) => {
  const chats = await Chat.find({ members: req.user }).populate(
    "members",
    "name avatar"
  );

  return res.status(201).json({
    success: true,
    chats,
  });
});
export { newGroupChat, getMyChats };
