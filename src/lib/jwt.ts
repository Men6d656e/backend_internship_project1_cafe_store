import jwt, { SignOptions } from "jsonwebtoken";
import { Types } from "mongoose";
import config from "../config/config.js";

export const genrateJwtToken = (userId: Types.ObjectId): string => {
  return jwt.sign({ userId: userId.toString() }, config.JWT_SECRET, {
    expiresIn: config.JWT_EXPIRE as SignOptions["expiresIn"],
  });
};

export const verifyJwtToken = (token: string) => {
  return jwt.verify(token, config.JWT_SECRET);
};
