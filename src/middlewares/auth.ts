import { NextFunction, Request, Response } from "express";
import { verifyJwtToken } from "../lib/jwt.js";
import { Types } from "mongoose";
import jwt from "jsonwebtoken";

const { JsonWebTokenError, TokenExpiredError } = jwt;

const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let token: string | undefined;

  const authHeader = req.headers.authorization;
  // console.log(authHeader);
  if (authHeader?.startsWith("Bearer ")) {
    token = authHeader.split(" ")[1];
    // console.log("Token found in Authorization header");
  }

  if (!token) {
    token = req.cookies.token as string | undefined;
    if (token) console.log("token found in cookies");
  }
  if (!token) {
    res.status(401).json({ message: "Access denied, token required" });
    return;
  }

  try {
    const payload = verifyJwtToken(token) as {
      userId: string | Types.ObjectId;
    };
    // console.log(payload);
    req.userId = payload.userId;
    return next();
  } catch (error) {
    if (error instanceof TokenExpiredError) {
      return next();
    }
    if (error instanceof JsonWebTokenError) {
      res.status(401).json({
        message: "Invalid Token",
      });
      console.log("Invalid json token: ", error);
      return;
    }
    console.log("middleWare Error: ", error);

    res.status(500).json({
      message: "Internal server Error",
    });
  }
};

export { authMiddleware };
