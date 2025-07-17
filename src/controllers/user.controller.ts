import { Request, Response } from "express";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { genrateJwtToken } from "../lib/jwt.js";
import config from "../config/config.js";

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body as { email: string; password: string };
    // console.log(email, password);
    const user = await User.findOne({ email });
    // console.log(user);
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      res.status(401).json({ message: "Password is incorrect" });
      return;
    }
    // console.log(isPasswordMatch);
    const token = genrateJwtToken(user._id);
    res.cookie("token", token, {
      httpOnly: true,
      secure: config.NODE_ENV === "production",
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    res.cookie("isAdmin", user.isAdmin, {
      httpOnly: true,
      secure: config.NODE_ENV === "production",
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    res.status(201).json({
      message: "Login successflly",
      isAdmin: user.isAdmin,
    });
  } catch (error) {
    console.log("Error in Login:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const signUp = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, username, password } = req.body as {
      email: string;
      username: string;
      password: string;
    };
    if (!email && !password && !username) {
      res.status(401).json({ message: "all fields are requierd" });
      return;
    }
    const isAlreadyExists = await User.findOne({ email });
    if (isAlreadyExists) {
      res.status(400).json({ message: "user already exists" });
      return;
    }
    const allUsers = await User.find({});
    if (allUsers.length === 0) {
      const user = await User.create({
        username,
        email,
        password,
        isAdmin: true,
      });
      const token = genrateJwtToken(user._id);
      res.cookie("token", token, {
        httpOnly: true,
        secure: config.NODE_ENV === "production",
        sameSite: "none",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });
      res.cookie("isAdmin", user.isAdmin, {
        httpOnly: true,
        secure: config.NODE_ENV === "production",
        sameSite: "none",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });
      res
        .status(201)
        .json({ message: "Sign up Successfully", isAdmin: user.isAdmin });
    } else {
      const user = await User.create({
        username,
        email,
        password,
      });
      const token = genrateJwtToken(user._id);
      res.cookie("token", token, {
        httpOnly: true,
        secure: config.NODE_ENV === "production",
        sameSite: "none",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });
      res.cookie("isAdmin", user.isAdmin, {
        httpOnly: true,
        secure: config.NODE_ENV === "production",
        sameSite: "none",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });
      res
        .status(201)
        .json({ message: "Sign up Successfully", isAdmin: user.isAdmin });
    }
  } catch (error) {
    console.log("Error in SignUp", error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const logout = async (req: Request, res: Response): Promise<void> => {
  try {
    const token = req.cookies.token as string;
    res.clearCookie("token", {
      httpOnly: true,
      secure: config.NODE_ENV === "production",
      sameSite: "none",
    });
    res.clearCookie("isAdmin", {
      httpOnly: true,
      secure: config.NODE_ENV === "production",
      sameSite: "none",
    });
    res.status(200).json({ message: "loged out successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
    console.log("Error in logout", error);
  }
};

export const userRole = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.userId;
    console.log(userId);
    const user = await User.findById({ _id: userId });
    if (!user) {
      res.status(404).json({ message: "somthing went wrong" });
      return;
    }
    res.status(200).json({
      message: "success",
      role: `${user.isAdmin === true ? "admin" : "user"}`,
    });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
    console.log("Error in logout", error);
  }
};
