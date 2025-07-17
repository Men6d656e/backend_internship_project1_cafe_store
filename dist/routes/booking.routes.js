import { Router } from "express";
import { getBookings, newBooking } from "../controllers/booking.controller.js";
import { authMiddleware } from "../middlewares/auth.js";
const router = Router();
// create booking
router.post("/new", authMiddleware, newBooking);
// create booking
router.get("/userBookings", authMiddleware, getBookings);
export default router;
