import { TryCatch } from "../middlewares/error";
import chat from "../models/chat";
import { emitEvent } from "../utils/features";
import { ErrorHandler } from "../utils/utility";
import { ALERT, REFETCH_CHATS } from "../constants/events";
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
export { newGroupChat };
