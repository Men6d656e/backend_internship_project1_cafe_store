var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import Bookings from "../models/bookings.js";
export function newBooking(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { date, time, memberCount } = req.body;
        const userId = req.userId;
        console.log(date, time, memberCount, userId);
        if (!date && !time && !memberCount) {
            res.status(401).json({ message: "All fields are required" });
            return;
        }
        try {
            const booking = yield Bookings.create({
                userId,
                bookingDate: date,
                bookingTime: time,
                numberOfPeoples: memberCount,
            });
            // console.log(booking);
            res.status(201).json({ message: "Done! wait for approve." });
        }
        catch (error) {
            console.log("Error in creating booking: ", error);
            res.status(500).json({ message: "something is wroge try latter" });
        }
    });
}
export function getBookings(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const userId = req.userId;
            const booking = yield Bookings.find({ userId: userId });
            // console.log(booking);
            if (booking.length === 0) {
                res.status(200).json({ message: "you don't have nay booking" });
            }
            else {
                res.status(200).json({ message: "success", bookings: booking });
            }
        }
        catch (error) {
            console.log("Error in Getting user Bookings ", error);
            res.status(500).json({ message: "something is wroge try latter" });
        }
    });
}
