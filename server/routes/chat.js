// routes/user.js
import { getMyProfile, login, logout, newUser } from "../controllers/user.js";
import express from "express";
import {
  getMyChats,
  newGroupChat,
  getMyGroups,
  addMembers,
  leaveGroup,
} from "../controllers/chat.js";
import { isAuthenticated } from "../middlewares/auth.js";

const app = express.Router();

// after here user must be logges in to access routes
app.use(isAuthenticated);

app.post("/new", newGroupChat);

app.get("/my", getMyChats);

app.get("/my/groups", getMyGroups);

app.put("/addmembers", addMembers);

app.put("/removemember", removeMember);

app.delete("/leave/:id"leaveGroup);
export default app;
