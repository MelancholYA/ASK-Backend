import { NextFunction, Response, Request } from "express";
import jwt from "jsonwebtoken";

type Imiddlware = (req: Request, res: Response, next: NextFunction) => void;

const protectForUser: Imiddlware = (req, res, next) => {
  const token = req.headers["x-auth-token"];
  if (!token) {
    res.status(400);
    throw new Error("Unauthorized : no token provided");
  }
  
  if (Array.isArray(token)) {
    res.status(400);
    throw new Error("Unauthorized : malformed token");
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "");
    if (typeof decoded === "string") {
      res.status(400);
      throw new Error("Unauthorized : Malformed token");
    }
    req.user = decoded;
    next();
  } catch (error) {
    throw new Error("Unauthorized");
  }
};

export { protectForUser };
