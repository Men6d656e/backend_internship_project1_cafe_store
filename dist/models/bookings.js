import mongoose from "mongoose";
import { model, Schema } from "mongoose";
const bookingSchema = new Schema({
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
}, {
    timestamps: true,
});
const Bookings = model("Bookings", bookingSchema);
export default Bookings;
