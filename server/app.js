import express from "express";
import router from "./routes/user.js";
import { connectDB } from "./utils/features.js";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { errorMiddleware } from "./middlewares/error.js";
import chatRoute from "./routes/chat.js";
import { createUser } from "./seeders/user.js";
dotenv.config({
  path: "./.env",
});
const app = express();

// using middlewares here
app.use(express.json());
app.use(cookieParser());

const mongoURI = process.env.MONGO_URI;
const port = process.env.PORT || 3000;

connectDB(mongoURI);
createUser(10);
app.use("/user", router);
app.use("/chat", chatRoute);
app.get("/", (req, res) => {
  res.send("hello world");
});

app.use(errorMiddleware);
app.listen(port, () => {
  console.log(`server is running on port ${port}`);
});
