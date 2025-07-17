import { Request, Response } from "express";
import Bookings from "../models/bookings.js";

export async function newBooking(req: Request, res: Response) {
  const { date, time, memberCount } = req.body;
  const userId = req.userId;
  console.log(date, time, memberCount, userId);
  if (!date && !time && !memberCount) {
    res.status(401).json({ message: "All fields are required" });
    return;
  }
  try {
    const booking = await Bookings.create({
      userId,
      bookingDate: date,
      bookingTime: time,
      numberOfPeoples: memberCount,
    });
    // console.log(booking);
    res.status(201).json({ message: "Done! wait for approve." });
  } catch (error) {
    console.log("Error in creating booking: ", error);
    res.status(500).json({ message: "something is wroge try latter" });
  }
}

export async function getBookings(req: Request, res: Response) {
  try {
    const userId = req.userId;

    const booking = await Bookings.find({ userId: userId });
    // console.log(booking);
    if (booking.length === 0) {
      res.status(200).json({ message: "you don't have nay booking" });
    } else {
      res.status(200).json({ message: "success", bookings: booking });
    }
  } catch (error) {
    console.log("Error in Getting user Bookings ", error);
    res.status(500).json({ message: "something is wroge try latter" });
  }
}
