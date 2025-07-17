// node modules
import mongoose, { ConnectOptions } from "mongoose";

// custom modules
import config from "../config/config.js";

const clientOptions: ConnectOptions = {
  dbName: "cafe-shop",
  appName: "Cafe Shop",
  serverApi: {
    version: "1",
    strict: true,
    deprecationErrors: true,
  },
};
export const connectToMongoDb = async (): Promise<void> => {
  if (!config.MONGO_URI) {
    throw new Error("Mongo Url is not defined in env file");
  }
  try {
    await mongoose.connect(config.MONGO_URI, clientOptions);
    console.log("DB Connected!");
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    console.log("Error Connectiong to db", error);
  }
};
