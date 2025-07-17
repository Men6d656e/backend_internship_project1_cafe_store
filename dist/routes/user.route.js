import { Router } from "express";
import { login, logout, signUp, userRole, } from "../controllers/user.controller.js";
import { authMiddleware } from "../middlewares/auth.js";
const router = Router();
// login
router.post("/log-in", login);
// sign up
router.post("/sign-up", signUp);
// logout
router.post("/logout", authMiddleware, logout);
// get user role
router.get("/my-role", authMiddleware, userRole);
export default router;
