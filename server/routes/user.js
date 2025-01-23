// routes/user.js
import { getMyProfile, login, newUser } from "../controllers/user.js";
import express from "express";
import { singleAvatar } from "../middlewares/multer.js";
import { isAuthenticated } from "../middlewares/auth.js";

const app = express.Router();

app.post("/new", singleAvatar, newUser);
app.post("/login", login);

// after here user must be logges in to access routes

app.get("/me", isAuthenticated, getMyProfile);
export default app;
