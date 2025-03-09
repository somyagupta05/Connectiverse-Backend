import { TryCatch } from "./error";
import { ErrorHandler } from "../utils/utility.js";
import { errorMiddleware} from "./error"; // Make sure ".js" is included

// const { errorMiddleware } = require("./error.js");

const isAuthenticated = (req, res, next) => {
  const token = req.cookies["chattu-token"];

  if (!token)
    return next(new ErrorHandler("please login to access this route", 401));
  const decodedData = jwt.verify(token, process.env.JWT_SECRET);

  req.user = decodedData._id;

  next();
};

export { isAuthenticated };
