// routes/user.js
import { getMyProfile, login, logout, newUser } from "../controllers/user.js";
import express from "express";
import { singleAvatar } from "../middlewares/multer.js";
import { isAuthenticated } from "../middlewares/auth.js";
import { searchUser } from "../controllers/user.js";
const app = express.Router();

app.post("/new", singleAvatar, newUser);
app.post("/login", login);

// after here user must be logges in to access routes
app.use(isAuthenticated);

app.get("/me", isAuthenticated, getMyProfile);
app.get("/logout", logout);

app.get("/search", searchUser);
export default app;
