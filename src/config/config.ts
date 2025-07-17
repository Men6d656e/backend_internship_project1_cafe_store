// node modules
import dotenv from "dotenv";

dotenv.config();
console.log("--- .env Variables Loaded (from config.ts) ---");
console.log("NODE_ENV:", process.env.NODE_ENV);
console.log("MONGO_URL:", process.env.MONGO_URL);
console.log("JWT_SECRET (first 5 chars):", process.env.JWT_SECRET?.substring(0, 5));
console.log("JWT_EXPIRE:", process.env.JWT_EXPIRE);
console.log("-----------------------------------------------");

const config = {
  PORT: process.env.PORT || 1234,
  NODE_ENV: process.env.NODE_ENV,
  WHITELIST_ORIGENS: process.env.WHITELIST_ORIGENS
    ? process.env.WHITELIST_ORIGENS.split(",")
    : ["http://localhost:300", "http://127.0.0.1:3000"],
  MONGO_URI: process.env.MONGO_URL,
  JWT_SECRET: process.env.JWT_SECRET as string,
  JWT_EXPIRE: process.env.JWT_EXPIRE as string,
};

export default config;
