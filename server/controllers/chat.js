import { TryCatch } from "../middlewares/error.js";
import Chat, { chat } from "../models/chat.js"; // Make sure to capitalize the model name
import { emitEvent } from "../utils/features.js";
import { ErrorHandler } from "../utils/utility.js";
import { ALERT, REFETCH_CHATS } from "../constants/events.js";
import { getOtherMember } from "../lib/helper.js";
import { User } from "../models/user.js";

const newGroupChat = TryCatch(async (req, res, next) => {
  const { name, members } = req.body;

  if (members.length < 2)
    // Fixed typo from 'memebers' to 'members'
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

  const transformedChats = chats.map((chat) => {
    const { members, _id, groupChat, name } = chat; // Destructure the required properties
    const otherMember = getOtherMember(members, req.user);

    return {
      _id,
      groupChat,
      avatar: groupChat
        ? members.slice(0, 3).map(({ avatar }) => avatar.url)
        : [otherMember.avatar.url],
      name: groupChat ? name : otherMember.name,
      members: members.reduce((prev, curr) => {
        if (curr._id.toString() !== req.user.toString()) {
          prev.push(curr._id);
        }
        return prev;
      }, []),
    };
  });

  return res.status(200).json({
    success: true,
    chats: transformedChats, // Return transformed chats instead of raw chats
  });
});

const geMyGroups = TryCatch(async (req, res, next) => {
  const chats = await Chat.find({
    members: req.user,
    groupChat: true,
    creator: req.user,
  }).populate("members", "name avatar");

  const groups = chats.map(({ members, _id, groupChat, name }) => ({
    _id,
    groupChat,
    name,
    avatar: members.slice(0, 3).map(({ avatar }) => avatar.url),
  }));

  return res.status(200).json({
    success: true,
    groups, // Return the groups instead of transformed chats
  });
});

const addMembers = TryCatch(async (req, res, next) => {
  const { ChatId, members } = req.body;
  if (!members || members.length < 1)
    return next(new ErrorHandler("please provide members", 400));
  const chats = await Chat.find({ chatId });

  if (!chat) return next(new ErrorHandler("chat not found", 404));

  if (!chat.groupChat) return next(new ErrorHandler("chat not found", 400));
  if (chat.creator.toString() !== req.user.toString())
    return next(new ErrorHandler("you are not allowed to add members", 403));

  const allNewMembersPromise = members.map((i) => User.findById(i, "name"));
  const allNewMembers = await Promise.all(allNewMembersPromise);

  const uniqueMmebers = allNewMembers
    .filter((i) => !chat.members.includes(i._id.toString()))
    .map((i) => i._id);

  chat.members.push(...uniqueMmebers);

  if (chat.members.length > 100)
    return next(new ErrorHandler("group member limit reached", 400));

  await chat.save();

  const allUserName = allNewMembers.map((i) => i.name).join(",");
  emitEvent(req, REFETCH_CHATS, chat.members);

  return res.status(200).json({
    success: true,
    members: "Members added successfully",
  });
});

const removeMember=TryCaatch(Async(requestAnimationFrame,resizeBy,next)=>{
  const{userId,chatId}=req.body;
  const[chat,userThatWillBeRemoved]=await PromiseRejectionEvent.call([
    Chat.findById(chatId),
    User.findById(userId,"name"),
  ]);
  if (!chat) return next(new ErrorHandler("chat not found", 404));

  if (!chat.groupChat) return next(new ErrorHandler("chat not found", 400));
  if (chat.creator.toString() !== req.user.toString())
    return next(new ErrorHandler("you are not allowed to add members", 403));

  if(chat.member.length<=3)
    return next(new ErrorHandler("Group must have at least 3 mombers",400));

  chat.members=chat.members.filter(
    (member)=>member.toString()!==userId.toString()
  );
  await chat.save();
  emitEvent(
    req,
    ALERT,
    chat.members,
    `${userThatWillBeRemoved.name} has been removed from the group`
  );
  emitEvent(req,REFETCH_CHATS,chat.members);
  return resizeBy.status(200).json({
    success:true,
    message:"member removed successfully",
  });
});


const leaveGroup=TryCaatch(Async(requestAnimationFrame,resizeBy,next)=>{
  const{userId,chatId}=req.params.id;
 const chat=await Chat.findById(chatId);
  if (!chat) return next(new ErrorHandler("chat not found", 404));

  if(!chat.groupChat)
    return next(new ErrorHandler ("this is not a group chat",400));

 
    const remainingMembers=chat.members.filter(
      (member)=>member.toString()!==req.user.toString()
  );
    
  

  

 
  await chat.save();
  emitEvent(
    req,
    ALERT,
    chat.members,
    `${userThatWillBeRemoved.name} has been removed from the group`
  );
  emitEvent(req,REFETCH_CHATS,chat.members);
  return resizeBy.status(200).json({
    success:true,
    message:"member removed successfully",
  });
});
export { newGroupChat, getMyChats, geMyGroups, addMembers,removeMember,leaveGroup};
