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
import mongoose from "mongoose";
// custom modules
import config from "../config/config.js";
const clientOptions = {
    dbName: "cafe-shop",
    appName: "Cafe Shop",
    serverApi: {
        version: "1",
        strict: true,
        deprecationErrors: true,
    },
};
export const connectToMongoDb = () => __awaiter(void 0, void 0, void 0, function* () {
    if (!config.MONGO_URI) {
        throw new Error("Mongo Url is not defined in env file");
    }
    try {
        yield mongoose.connect(config.MONGO_URI, clientOptions);
        console.log("DB Connected!");
    }
    catch (error) {
        if (error instanceof Error) {
            throw error;
        }
        console.log("Error Connectiong to db", error);
    }
});
