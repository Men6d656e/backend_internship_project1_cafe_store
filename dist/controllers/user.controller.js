var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { genrateJwtToken } from "../lib/jwt.js";
import config from "../config/config.js";
export const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        // console.log(email, password);
        const user = yield User.findOne({ email });
        // console.log(user);
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        const isPasswordMatch = yield bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            res.status(401).json({ message: "Password is incorrect" });
            return;
        }
        // console.log(isPasswordMatch);
        const token = genrateJwtToken(user._id);
        res.cookie("token", token, {
            httpOnly: true,
            secure: config.NODE_ENV === "production",
            sameSite: config.NODE_ENV === "production" ? "none" : "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });
        res.cookie("isAdmin", user.isAdmin ? "admin" : "user", {
            httpOnly: true,
            secure: config.NODE_ENV === "production",
            sameSite: config.NODE_ENV === "production" ? "none" : "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });
        res.status(201).json({
            message: "Login successflly",
            isAdmin: user.isAdmin,
        });
    }
    catch (error) {
        console.log("Error in Login:", error);
        res.status(500).json({ message: "Server Error" });
    }
});
export const signUp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, username, password } = req.body;
        if (!email && !password && !username) {
            res.status(401).json({ message: "all fields are requierd" });
            return;
        }
        const isAlreadyExists = yield User.findOne({ email });
        if (isAlreadyExists) {
            res.status(400).json({ message: "user already exists" });
            return;
        }
        const allUsers = yield User.find({});
        if (allUsers.length === 0) {
            const user = yield User.create({
                username,
                email,
                password,
                isAdmin: true,
            });
            const token = genrateJwtToken(user._id);
            res.cookie("token", token, {
                httpOnly: true,
                secure: config.NODE_ENV === "production",
                sameSite: config.NODE_ENV === "production" ? "none" : "lax",
                maxAge: 7 * 24 * 60 * 60 * 1000,
            });
            res.cookie("isAdmin", user.isAdmin ? "admin" : "user", {
                httpOnly: true,
                secure: config.NODE_ENV === "production",
                sameSite: config.NODE_ENV === "production" ? "none" : "lax",
                maxAge: 7 * 24 * 60 * 60 * 1000,
            });
            res
                .status(201)
                .json({ message: "Sign up Successfully", isAdmin: user.isAdmin });
        }
        else {
            const user = yield User.create({
                username,
                email,
                password,
            });
            const token = genrateJwtToken(user._id);
            res.cookie("token", token, {
                httpOnly: true,
                secure: config.NODE_ENV === "production",
                sameSite: config.NODE_ENV === "production" ? "none" : "lax",
                maxAge: 7 * 24 * 60 * 60 * 1000,
            });
            res.cookie("isAdmin", user.isAdmin ? "admin" : "user", {
                httpOnly: true,
                secure: config.NODE_ENV === "production",
                sameSite: config.NODE_ENV === "production" ? "none" : "lax",
                maxAge: 7 * 24 * 60 * 60 * 1000,
            });
            res
                .status(201)
                .json({ message: "Sign up Successfully", isAdmin: user.isAdmin });
        }
    }
    catch (error) {
        console.log("Error in SignUp", error);
        res.status(500).json({ message: "Server Error" });
    }
});
export const logout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = req.cookies.token;
        res.clearCookie("token", {
            httpOnly: true,
            secure: config.NODE_ENV === "production",
            sameSite: config.NODE_ENV === "production" ? "none" : "lax",
        });
        res.clearCookie("isAdmin", {
            httpOnly: true,
            secure: config.NODE_ENV === "production",
            sameSite: config.NODE_ENV === "production" ? "none" : "lax",
        });
        res.status(200).json({ message: "loged out successfully" });
    }
    catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
        console.log("Error in logout", error);
    }
});
export const userRole = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.userId;
        console.log(userId);
        const user = yield User.findById({ _id: userId });
        if (!user) {
            res.status(404).json({ message: "somthing went wrong" });
            return;
        }
        res.status(200).json({
            message: "success",
            role: `${user.isAdmin === true ? "admin" : "user"}`,
        });
    }
    catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
        console.log("Error in logout", error);
    }
});
