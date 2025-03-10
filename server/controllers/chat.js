import { TryCatch } from "../middlewares/error.js";
import Chat from "../models/chat.js"; 
import { emitEvent } from "../utils/features.js";
import { ErrorHandler } from "../utils/utility.js";
import { ALERT, REFETCH_CHATS } from "../constants/events.js";
import { getOtherMember } from "../lib/helper.js";
import { User } from "../models/user.js";

const newGroupChat = TryCatch(async (req, res, next) => {
  const { name, members } = req.body;

  if (members.length < 2)
    return next(new ErrorHandler("Group chat must have at least 3 members", 400));

  const allMembers = [...members, req.user];

  await Chat.create({
    name,
    groupChat: true,
    creator: req.user,
    members: allMembers,
  });

  emitEvent(req, ALERT, allMembers, `Welcome to ${name} group`);
  emitEvent(req, REFETCH_CHATS, members);

  return res.status(201).json({ success: true, message: "Group created" });
});

const getMyChats = TryCatch(async (req, res, next) => {
  const chats = await Chat.find({ members: req.user }).populate("members", "name avatar");

  const transformedChats = chats.map((chat) => {
    const { members, _id, groupChat, name } = chat;
    const otherMember = getOtherMember(members, req.user);

    return {
      _id,
      groupChat,
      avatar: groupChat ? members.slice(0, 3).map(({ avatar }) => avatar.url) : [otherMember.avatar.url],
      name: groupChat ? name : otherMember.name,
      members: members.filter((m) => m._id.toString() !== req.user.toString()).map((m) => m._id),
    };
  });

  return res.status(200).json({ success: true, chats: transformedChats });
});

const getMyGroups = TryCatch(async (req, res, next) => {
  const chats = await Chat.find({ members: req.user, groupChat: true, creator: req.user }).populate("members", "name avatar");

  const groups = chats.map(({ members, _id, groupChat, name }) => ({
    _id,
    groupChat,
    name,
    avatar: members.slice(0, 3).map(({ avatar }) => avatar.url),
  }));

  return res.status(200).json({ success: true, groups });
});

const addMembers = TryCatch(async (req, res, next) => {
  const { chatId, members } = req.body;
  if (!members || members.length < 1)
    return next(new ErrorHandler("Please provide members", 400));

  const chat = await Chat.findById(chatId);
  if (!chat) return next(new ErrorHandler("Chat not found", 404));
  if (!chat.groupChat) return next(new ErrorHandler("This is not a group chat", 400));
  if (chat.creator.toString() !== req.user.toString())
    return next(new ErrorHandler("You are not allowed to add members", 403));

  const newMembers = await Promise.all(members.map((id) => User.findById(id, "name")));
  const uniqueMembers = newMembers.filter((i) => !chat.members.includes(i._id.toString())).map((i) => i._id);

  chat.members.push(...uniqueMembers);

  if (chat.members.length > 100)
    return next(new ErrorHandler("Group member limit reached", 400));

  await chat.save();

  emitEvent(req, REFETCH_CHATS, chat.members);

  return res.status(200).json({ success: true, message: "Members added successfully" });
});

const removeMember = TryCatch(async (req, res, next) => {
  const { userId, chatId } = req.body;
  const [chat, userToRemove] = await Promise.all([Chat.findById(chatId), User.findById(userId, "name")]);

  if (!chat) return next(new ErrorHandler("Chat not found", 404));
  if (!chat.groupChat) return next(new ErrorHandler("This is not a group chat", 400));
  if (chat.creator.toString() !== req.user.toString())
    return next(new ErrorHandler("You are not allowed to remove members", 403));
  if (chat.members.length <= 3)
    return next(new ErrorHandler("Group must have at least 3 members", 400));

  chat.members = chat.members.filter((member) => member.toString() !== userId.toString());
  await chat.save();

  emitEvent(req, ALERT, chat.members, `${userToRemove.name} has been removed from the group`);
  emitEvent(req, REFETCH_CHATS, chat.members);

  return res.status(200).json({ success: true, message: "Member removed successfully" });
});

const leaveGroup = TryCatch(async (req, res, next) => {
  const { chatId } = req.params;
  const chat = await Chat.findById(chatId);

  if (!chat) return next(new ErrorHandler("Chat not found", 404));
  if (!chat.groupChat) return next(new ErrorHandler("This is not a group chat", 400));

  const remainingMembers = chat.members.filter((member) => member.toString() !== req.user.toString());

  if (remainingMembers.length < 3)
    return next(new ErrorHandler("Group must have at least 3 members", 400));

  if (chat.creator.toString() === req.user.toString()) {
    const randomIndex = Math.floor(Math.random() * remainingMembers.length);
    chat.creator = remainingMembers[randomIndex];
  }

  chat.members = remainingMembers;
  await chat.save();

  emitEvent(req, ALERT, chat.members, `User has left the group`);
  emitEvent(req, REFETCH_CHATS, chat.members);

  return res.status(200).json({ success: true, message: "Member left successfully" });
});

const sendAttachments = TryCatch(async (req, res, next) => {
  return res.status(200).json({ success: true, message: "Attachments sent successfully" });
});

export { newGroupChat, getMyChats, getMyGroups, addMembers, removeMember, leaveGroup, sendAttachments };
