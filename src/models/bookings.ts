import mongoose, { Types } from "mongoose";
import { model, Schema } from "mongoose";

export interface Booking {
  userId: Types.ObjectId;
  bookingDate: Date;
  bookingTime: string;
  numberOfPeoples: number;
  status: "pending" | "rejected" | "accepted";
  createdAt: Date;
  updatedAt: Date;
}

const bookingSchema = new Schema<Booking>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    bookingDate: {
      type: Date,
      required: true,
    },
    bookingTime: {
      type: String,
      required: true,
    },
    numberOfPeoples: {
      type: Number,
      min: 1,
      required: true,
      default: 1,
    },
    status: {
      type: String,
      enum: ["pending", "rejected", "accepted"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

const Bookings = model<Booking>("Bookings", bookingSchema);

export default Bookings;
