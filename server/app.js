import express from "express";
import router from "./routes/user.js";
import { connectDB } from "./utils/features.js";
import dotenv from "dotenv";
import { errorMiddleware } from "./middlewares/error.js";

dotenv.config({
  path: "./.env",
});
const app = express();

// using middlewares here
app.use(express.json());

const mongoURI = process.env.MONGO_URI;
const port = process.env.PORT || 3000;

connectDB(mongoURI);
app.use("/user", router);

app.get("/", (req, res) => {
  res.send("hello world");
});

app.use(errorMiddleware);
app.listen(port, () => {
  console.log(`server is running on port ${port}`);
});
