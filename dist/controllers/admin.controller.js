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
import mongoose from "mongoose";
import Bookings from "../models/bookings.js";
const statusArray = ["accepted", "rejected", "pending"];
export const allInfo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.userId;
        //   check user admin
        const user = yield User.findById(userId);
        // console.log(user);
        if (!(user === null || user === void 0 ? void 0 : user.isAdmin)) {
            res.status(400).json({
                message: "Access Denied, Only admin can get this information",
            });
            return;
        }
        const users = yield User.countDocuments({
            _id: { $ne: new mongoose.Types.ObjectId(userId) },
        });
        // console.log(users);
        const bookings = yield Bookings.countDocuments();
        // console.log(bookings);
        const pendingBokings = yield Bookings.countDocuments({ status: "pending" });
        // console.log(pendingBokings);
        const data = {
            bookings: bookings,
            users: users,
            pendingBokings: pendingBokings,
        };
        res.status(200).json({ message: "success", data });
    }
    catch (error) {
        console.log("Error in admin all route", error);
        res.status(500).json({ message: "Server Error" });
    }
});
export const AllBookings = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.userId;
        //   check user admin
        const user = yield User.findById(userId);
        // console.log(user);
        if (!(user === null || user === void 0 ? void 0 : user.isAdmin)) {
            res.status(400).json({
                message: "Access Denied, Only admin can get this information",
            });
            return;
        }
        const bookings = yield Bookings.find({});
        // console.log(bookings);
        res.status(200).json({ message: "ok", bookings });
    }
    catch (error) {
        console.log("Error in admin all Booking get controller", error);
        res.status(500).json({ message: "Server Error" });
    }
});
export const updateBookingStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { bookingId, status } = req.body;
    // console.log(bookingId, status);
    if (!bookingId && !status) {
        res.status(400).json({ message: "all fields are required" });
        return;
    }
    if (typeof bookingId !== "string" &&
        typeof status !== "string" &&
        !statusArray.includes(status)) {
        res.status(400).json({
            message: "bookingIs must be string and status should be accepted,rejected or pending",
        });
    }
    try {
        const userId = req.userId;
        const user = yield User.findById(userId);
        if (!user || !(user === null || user === void 0 ? void 0 : user.isAdmin)) {
            res
                .status(401)
                .json({ message: "access denied!, admin has right to change" });
            return;
        }
        // console.log(user?.isAdmin, bookingId, status);
        const booking = yield Bookings.findByIdAndUpdate({ _id: bookingId }, { status: status }, { new: true });
        console.log(booking);
        res.status(200).json({ message: "updated Successfully" });
    }
    catch (error) {
        console.log("Error in admin update booking status controller", error);
        res.status(500).json({ message: "Server Error" });
    }
});
export const deleteBooking = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { bookingId } = req.body;
    console.log(bookingId);
    if (!bookingId) {
        res.status(400).json({ message: "Boking id is required" });
        return;
    }
    try {
        const userId = req.userId;
        const user = yield User.findById(userId);
        if (!user || !(user === null || user === void 0 ? void 0 : user.isAdmin)) {
            res
                .status(401)
                .json({ message: "access denied!, admin has right to change" });
            return;
        }
        // console.log(user?.isAdmin, bookingId, status);
        const booking = yield Bookings.findByIdAndDelete(bookingId);
        console.log(booking);
        res.status(200).json({ message: "deleted Successfully" });
    }
    catch (error) {
        console.log("Error in admin delete booking controller", error);
        res.status(500).json({ message: "Server Error" });
    }
});
export const getAllUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.userId;
        const user = yield User.findById(userId);
        if (!user || !(user === null || user === void 0 ? void 0 : user.isAdmin)) {
            res
                .status(401)
                .json({ message: "access denied!, admin has right to change" });
            return;
        }
        const userWithBookingCount = yield User.aggregate([
            {
                $match: {
                    isAdmin: false,
                },
            },
            {
                $lookup: {
                    from: "bookings",
                    localField: "_id",
                    foreignField: "userId",
                    as: "userBookings",
                },
            },
            {
                $project: {
                    _id: 1,
                    username: 1,
                    email: 1,
                    bookingCount: { $size: "$userBookings" },
                },
            },
            {
                $sort: {
                    username: 1,
                },
            },
        ]);
        res
            .status(200)
            .json({ message: "deleted Successfully", userWithBookingCount });
    }
    catch (error) {
        console.log("Error in admin get all users controller", error);
        res.status(500).json({ message: "Server Error" });
    }
});
export const updateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const AdminuserId = req.userId;
        const user = yield User.findById(AdminuserId);
        if (!user || !(user === null || user === void 0 ? void 0 : user.isAdmin)) {
            res
                .status(401)
                .json({ message: "access denied!, admin has right to change" });
            return;
        }
        const { userId, username } = req.body;
        if (!userId && !username) {
            res.status(400).json({ message: "username is required" });
            return;
        }
        const clientuser = yield User.findByIdAndUpdate({ _id: userId }, { username: username }, { new: true });
        res.status(200).json({ message: "updated successfully" });
    }
    catch (error) {
        console.log("Error in admin update user controller", error);
        res.status(500).json({ message: "Server Error" });
    }
});
