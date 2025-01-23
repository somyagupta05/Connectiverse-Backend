import { TryCatch } from "./error";

const isAuthenticated = TryCatch(async (req, res, next) => {
  console.log("cookies", req.cookies);

  next();
});

export { isAuthenticated };
