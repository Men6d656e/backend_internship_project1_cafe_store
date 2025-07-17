var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// node modules
import expres from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
// custom modules
import config from "./config/config.js";
// // routes
import userRoutes from "./routes/user.route.js";
import bookingRoutes from "./routes/booking.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import { connectToMongoDb } from "./lib/db.js";
const app = expres();
app.set("trust proxy", 1);
const corsOptions = {
    origin(origin, callback) {
        if (config.NODE_ENV === "development" ||
            !origin ||
            config.WHITELIST_ORIGENS.includes(origin)) {
            callback(null, true);
        }
        else {
            // reject request
            callback(new Error("Cors origin is not allow"), false);
            console.log("Cors origin is not allowed");
        }
    },
    credentials: true,
};
// // middleware
app.use(cookieParser());
app.use(expres.json());
app.use(expres.urlencoded({ extended: true }));
app.use(cors(corsOptions));
(() => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield connectToMongoDb();
        // server check
        app.get("/", (req, res) => {
            res.status(200).json({ message: "Server is Running!" });
        });
        // user routes
        app.use("/api/auth", userRoutes);
        // bookingroutes
        app.use("/api/booking", bookingRoutes);
        // admin routes
        app.use("/api/admin", adminRoutes);
        app.listen(config.PORT, () => {
            console.log(`Server listening on Port ${config.PORT}`);
        });
    }
    catch (error) {
        if (config.NODE_ENV === "production") {
            process.exit(1);
        }
        console.log("Fail to Start the server");
    }
}))();
