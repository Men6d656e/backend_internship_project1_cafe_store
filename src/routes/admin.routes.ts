import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.js";
import {
  AllBookings,
  allInfo,
  deleteBooking,
  getAllUsers,
  updateBookingStatus,
  updateUser,
} from "../controllers/admin.controller.js";

const router = Router();

// dashboard info
router.get("/all", authMiddleware, allInfo);

// all bookings
router.get("/bookings", authMiddleware, AllBookings);

// update booking status
router.post("/updateStatus", authMiddleware, updateBookingStatus);

// delete
router.post("/deleteBooking", authMiddleware, deleteBooking);

// all get users
router.get("/users", authMiddleware, getAllUsers);

// updateUser
router.put("/update", authMiddleware, updateUser);

export default router;
