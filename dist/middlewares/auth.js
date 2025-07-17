var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { verifyJwtToken } from "../lib/jwt.js";
import jwt from "jsonwebtoken";
const { JsonWebTokenError, TokenExpiredError } = jwt;
const authMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let token;
    const authHeader = req.headers.authorization;
    // console.log(authHeader);
    if (authHeader === null || authHeader === void 0 ? void 0 : authHeader.startsWith("Bearer ")) {
        token = authHeader.split(" ")[1];
        // console.log("Token found in Authorization header");
    }
    if (!token) {
        token = req.cookies.token;
        if (token)
            console.log("token found in cookies");
    }
    if (!token) {
        res.status(401).json({ message: "Access denied, token required" });
        return;
    }
    try {
        const payload = verifyJwtToken(token);
        // console.log(payload);
        req.userId = payload.userId;
        return next();
    }
    catch (error) {
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
});
export { authMiddleware };
