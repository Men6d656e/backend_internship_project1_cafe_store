import jwt from "jsonwebtoken";
import config from "../config/config.js";
export const genrateJwtToken = (userId) => {
    return jwt.sign({ userId: userId.toString() }, config.JWT_SECRET, {
        expiresIn: config.JWT_EXPIRE,
    });
};
export const verifyJwtToken = (token) => {
    return jwt.verify(token, config.JWT_SECRET);
};
