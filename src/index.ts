// node modules
import express, { Application, Request, Response } from "express";
import cors, { CorsOptions } from "cors";
import cookieParser from "cookie-parser";
// custom modules
import config from "./config/config.js";
// // routes

import userRoutes from "./routes/user.route.js";
import bookingRoutes from "./routes/booking.routes.js";
import adminRoutes from "./routes/admin.routes.js";

import { connectToMongoDb } from "./lib/db.js";

const app: Application = express();
const corsOptions: CorsOptions = {
  origin(origin, callback) {
    if (
      config.NODE_ENV === "development" ||
      !origin ||
      config.WHITELIST_ORIGENS.includes(origin)
    ) {
      callback(null, true);
    } else {
      // reject request
      callback(new Error("Cors origin is not allow"), false);
      console.log("Cors origin is not allowed");
    }
  },
  credentials: true,
};
// // middleware
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors(corsOptions));

(async () => {
  try {
    await connectToMongoDb();
    // server check
    app.get("/", (req: Request, res: Response) => {
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
  } catch (error) {
    if (config.NODE_ENV === "production") {
      process.exit(1);
    }
    console.log("Fail to Start the server");
  }
})();
